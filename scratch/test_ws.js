const http = require('http');

function checkPath(path) {
  return new Promise((resolve) => {
    const options = {
      hostname: '18.232.76.157',
      port: 8080,
      path: path,
      method: 'GET',
      headers: {
        'Connection': 'Upgrade',
        'Upgrade': 'websocket',
        'Sec-WebSocket-Key': 'dGhlIHNhbXBsZSBub25jZQ==',
        'Sec-WebSocket-Version': '13'
      }
    };

    const req = http.request(options);
    
    req.on('response', (res) => {
      resolve({ path, status: res.statusCode, headers: res.headers, type: 'HTTP' });
    });

    req.on('upgrade', (res, socket, upgradeHead) => {
      socket.end();
      resolve({ path, status: 101, headers: res.headers, type: 'WS' });
    });

    req.on('error', (err) => {
      resolve({ path, error: err.message });
    });

    req.end();
  });
}

function checkRest(path) {
  return new Promise((resolve) => {
    const options = {
      hostname: '18.232.76.157',
      port: 8080,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({ path, status: res.statusCode, body: body.substring(0, 100) });
      });
    });

    req.on('error', (err) => {
      resolve({ path, error: err.message });
    });

    req.end();
  });
}

async function run() {
  console.log('--- Probing WebSocket paths ---');
  const wsPaths = ['/ping', '/audit', '/mirror', '/terminal', '/pty/mirror', '/mirror/some-id'];
  for (const path of wsPaths) {
    const res = await checkPath(path);
    console.log(JSON.stringify(res, null, 2));
  }

  console.log('\n--- Probing REST paths ---');
  const restPaths = ['/api/nodes', '/nodes', '/api', '/'];
  for (const path of restPaths) {
    const res = await checkRest(path);
    console.log(JSON.stringify(res, null, 2));
  }
}

run();
