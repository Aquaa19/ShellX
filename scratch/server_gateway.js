const http = require('http');
const url = require('url');
const { spawn } = require('child_process');
const { WebSocketServer } = require('ws');
const fs = require('fs');
const os = require('os');

const PORT = 8080;

// Track active sessions: Map<uid, { ws, container, mirrors: Set, outputBuffer: Array }>
const activeSessions = new Map();

// Track active audit connections
const activeAuditSockets = new Set();

const wss = new WebSocketServer({ noServer: true });
const wssAudit = new WebSocketServer({ noServer: true });
const wssMirror = new WebSocketServer({ noServer: true });

// HTTP request handler with REST routes & CORS support
const server = http.createServer((req, res) => {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // GET /api/nodes
  if (req.url === '/api/nodes' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    
    const cpus = os.cpus().length;
    const load = os.loadavg()[0];
    const cpuUsage = Math.min(100, Math.round((load / cpus) * 100)) || 15;
    
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const ramUsage = Math.round((usedMem / totalMem) * 100);
    
    const uptimeSec = os.uptime();
    const days = Math.floor(uptimeSec / (3600*24));
    const hours = Math.floor((uptimeSec % (3600*24)) / 3600);
    const minutes = Math.floor((uptimeSec % 3600) / 60);
    const uptimeStr = `${days}d ${hours}h ${minutes}m`;
    
    const activeUsersCount = activeSessions.size;

    const nodeStats = [
      {
        id: 'node-1',
        ip: '18.232.76.157',
        hostname: os.hostname() || 'gateway-us-east-1',
        cpuUsage: cpuUsage,
        ramUsage: ramUsage,
        maxUsers: 50,
        activeUsers: activeUsersCount,
        uptime: uptimeStr
      }
    ];

    res.writeHead(200);
    res.end(JSON.stringify(nodeStats));
    return;
  }

  // POST /api/student/:id/:action
  if (req.url.startsWith('/api/student/') && req.method === 'POST') {
    res.setHeader('Content-Type', 'application/json');
    const parts = req.url.split('/');
    const studentId = parts[3];
    const action = parts[4];
    
    console.log(`[Gateway] Admin requested action "${action}" on student: ${studentId}`);
    
    if (action === 'wipe') {
      const studentDir = `/opt/shellx/users/${studentId}`;
      if (fs.existsSync(studentDir)) {
        try {
          spawn('sudo', ['rm', '-rf', studentDir]);
          console.log(`[Gateway] Wiped student sandbox folder: ${studentDir}`);
        } catch (err) {
          console.error(`[Gateway] Failed to wipe directory: ${err.message}`);
        }
      }
    } else if (action === 'suspend') {
      const session = activeSessions.get(studentId);
      if (session) {
        session.ws.send('\r\n[ SYSTEM: Your sandbox environment has been suspended by the administrator. ]\r\n');
        session.ws.close(1008);
      }
    }
    
    res.writeHead(200);
    res.end(JSON.stringify({ success: true }));
    return;
  }

  // POST /api/nodes/:nodeId/:action
  if (req.url.startsWith('/api/nodes/') && req.method === 'POST') {
    res.setHeader('Content-Type', 'application/json');
    const parts = req.url.split('/');
    const nodeId = parts[3];
    const action = parts[4];
    
    console.log(`[Gateway] Admin requested action "${action}" on node: ${nodeId}`);
    
    if (action === 'wipe') {
      try {
        spawn('sudo', ['rm', '-rf', '/opt/shellx/users/*']);
        console.log('[Gateway] Wiped all student sandboxes.');
      } catch (err) {
        console.error('[Gateway] Failed to wipe all sandboxes:', err);
      }
    }
    
    res.writeHead(200);
    res.end(JSON.stringify({ success: true }));
    return;
  }

  res.writeHead(404);
  res.end();
});

// Broadcast logs to all active audit sockets
function broadcastAudit(data) {
  const payload = JSON.stringify(data);
  for (const ws of activeAuditSockets) {
    if (ws.readyState === 1) {
      ws.send(payload);
    }
  }
}

// Student terminal WebSocket handler
wss.on('connection', (ws, req) => {
  const parameters = url.parse(req.url, true).query;
  const uid = parameters.uid || 'guest';

  console.log(`[Gateway] New connection established for UID: ${uid}`);

  const userDir = `/opt/shellx/users/${uid}`;
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
    try {
      spawn('sudo', ['chown', '1000:1000', userDir]);
    } catch (e) {
      console.error('[Gateway] Failed to chown user directory:', e.message);
    }
  }

  const container = spawn('script', [
    '-q',
    '-c',
    `docker run -it --rm --network none --memory 128m --cpus 0.5 -v ${userDir}:/home/student shellx-student-env bash`,
    '/dev/null'
  ]);

  const session = {
    ws,
    container,
    mirrors: new Set(),
    outputBuffer: []
  };
  activeSessions.set(uid, session);

  // stdout piping
  container.stdout.on('data', (data) => {
    const output = data.toString();
    if (ws.readyState === 1) ws.send(output);
    
    session.outputBuffer.push(output);
    if (session.outputBuffer.length > 50) session.outputBuffer.shift();
    
    for (const mirrorWs of session.mirrors) {
      if (mirrorWs.readyState === 1) mirrorWs.send(output);
    }
  });

  // stderr piping
  container.stderr.on('data', (data) => {
    const output = data.toString();
    if (ws.readyState === 1) ws.send(output);
    
    session.outputBuffer.push(output);
    if (session.outputBuffer.length > 50) session.outputBuffer.shift();
    
    for (const mirrorWs of session.mirrors) {
      if (mirrorWs.readyState === 1) mirrorWs.send(output);
    }
  });

  // Command reconstruction buffer
  let inputBuffer = '';
  ws.on('message', (message) => {
    const str = message.toString();
    container.stdin.write(message);

    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (char === '\r' || char === '\n') {
        if (inputBuffer.trim().length > 0) {
          broadcastAudit({
            username: uid + '@shellx',
            command: inputBuffer.trim(),
            exitCode: 0,
            lessonTitle: 'Active Sandbox'
          });
        }
        inputBuffer = '';
      } else if (char === '\u007f' || char === '\x08') {
        inputBuffer = inputBuffer.slice(0, -1);
      } else if (char.charCodeAt(0) >= 32 && char.charCodeAt(0) <= 126) {
        inputBuffer += char;
      }
    }
  });

  ws.on('close', () => {
    console.log(`[Gateway] Connection closed for UID: ${uid}`);
    activeSessions.delete(uid);
    container.kill();
    for (const mirrorWs of session.mirrors) {
      mirrorWs.send('[ SYSTEM: Live mirror connection terminated because student disconnected. ]\r\n');
      mirrorWs.close(1000);
    }
  });

  container.on('close', () => {
    ws.close();
  });
});

// Admin live command audit feed WebSocket handler
wssAudit.on('connection', (ws) => {
  console.log('[Gateway] Admin connected to live command audit stream.');
  activeAuditSockets.add(ws);
  
  ws.on('close', () => {
    activeAuditSockets.delete(ws);
    console.log('[Gateway] Admin disconnected from live command audit stream.');
  });
});

// Admin screen mirror WebSocket handler
wssMirror.on('connection', (ws, req) => {
  const pathname = url.parse(req.url).pathname;
  const parts = pathname.split('/');
  const studentId = parts[2];
  
  console.log(`[Gateway] Admin connected to mirror session for student: ${studentId}`);
  
  const session = activeSessions.get(studentId);
  if (session) {
    for (const chunk of session.outputBuffer) {
      ws.send(chunk);
    }
    session.mirrors.add(ws);
    
    ws.on('close', () => {
      session.mirrors.delete(ws);
      console.log(`[Gateway] Admin disconnected from mirror session for student: ${studentId}`);
    });
  } else {
    ws.send('[ SYSTEM: Student session not active. ]\r\n');
    ws.close(1008);
  }
});

// Routing upgrades
server.on('upgrade', (request, socket, head) => {
  const parsedUrl = url.parse(request.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname === '/terminal' || pathname === '/ping') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      if (pathname === '/ping') {
        ws.send('pong');
        ws.close(1000);
      } else {
        wss.emit('connection', ws, request);
      }
    });
  } else if (pathname === '/audit') {
    wssAudit.handleUpgrade(request, socket, head, (ws) => {
      wssAudit.emit('connection', ws, request);
    });
  } else if (pathname.startsWith('/mirror/')) {
    wssMirror.handleUpgrade(request, socket, head, (ws) => {
      wssMirror.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(PORT, () => {
  console.log(`[Gateway] Server listening on port ${PORT}...`);
});
