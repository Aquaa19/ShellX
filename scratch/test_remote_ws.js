const WebSocket = require('ws');

const gatewayUrl = 'ws://18.232.76.157:8080/terminal?user=student&uid=debug-user-123';
const ws = new WebSocket(gatewayUrl);

ws.on('open', () => {
  console.log("WebSocket connection opened.");
  
  // Wait a moment for bash to boot and show the prompt
  setTimeout(() => {
    runTest();
  }, 2000);
});

ws.on('message', (data) => {
  console.log("RCV:", data.toString());
});

ws.on('close', (code, reason) => {
  console.log(`WebSocket closed: ${code} - ${reason}`);
});

ws.on('error', (err) => {
  console.error("WS ERROR:", err);
});

async function sendCommand(cmd) {
  console.log("\nSENDING:", JSON.stringify(cmd));
  ws.send(cmd);
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTest() {
  // Test 1: Let's run a simple echo to see if the terminal is responsive
  await sendCommand("echo 'HELLO_WORLD'\r");
  await wait(1000);

  // Test 2: Run the validation command using trailing backslash continuation (current behavior)
  const cmdWithBackslash = [
    `[ "$( ( uname -r | grep -qE '^[0-9]+\\.[0-9]+' && echo \\"OK\\" || echo \\"FAIL\\" ) | tr '[:upper:]' '[:lower:]' )" = "ok" ] && \\`,
    `[ "$( ( [ \\"$(whoami)\\" = \\"student\\" ] && echo \\"OK\\" || echo \\"FAIL\\" ) | tr '[:upper:]' '[:lower:]' )" = "ok" ] && \\`,
    `echo "BACKSLASH_OK"`
  ].join('\r') + '\r';
  
  await sendCommand(cmdWithBackslash);
  await wait(3000);

  // Test 3: Run the validation command using && line continuation without backslash
  const cmdWithAndAnd = [
    `[ "$( ( uname -r | grep -qE '^[0-9]+\\.[0-9]+' && echo \\"OK\\" || echo \\"FAIL\\" ) | tr '[:upper:]' '[:lower:]' )" = "ok" ] &&`,
    `[ "$( ( [ \\"$(whoami)\\" = \\"student\\" ] && echo \\"OK\\" || echo \\"FAIL\\" ) | tr '[:upper:]' '[:lower:]' )" = "ok" ] &&`,
    `echo "ANDAND_OK"`
  ].join('\r') + '\r';

  await sendCommand(cmdWithAndAnd);
  await wait(3000);

  // Test 4: Run the validation command as a single line (no continuation)
  const singleLineCmd = `[ "$( ( uname -r | grep -qE '^[0-9]+\\.[0-9]+' && echo \\"OK\\" || echo \\"FAIL\\" ) | tr '[:upper:]' '[:lower:]' )" = "ok" ] && [ "$( ( [ \\"$(whoami)\\" = \\"student\\" ] && echo \\"OK\\" || echo \\"FAIL\\" ) | tr '[:upper:]' '[:lower:]' )" = "ok" ] && echo "SINGLE_LINE_OK"\r`;
  
  await sendCommand(singleLineCmd);
  await wait(3000);

  console.log("\nFinished tests.");
  ws.close();
}
