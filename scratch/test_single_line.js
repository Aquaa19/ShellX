const WebSocket = require('ws');

const gatewayUrl = 'ws://18.232.76.157:8080/terminal?user=student&uid=debug-user-single-line';
const ws = new WebSocket(gatewayUrl);

ws.on('open', () => {
  console.log("WebSocket opened. Waiting 6 seconds for Docker container to boot...");
  setTimeout(runTest, 6000);
});

ws.on('message', (data) => {
  console.log("RCV:", JSON.stringify(data.toString()));
});

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTest() {
  console.log("Sending single-line command...");
  const cmd = `[ "$( ( uname -r | grep -qE '^[0-9]+\\.[0-9]+' && echo "OK" || echo "FAIL" ) | tr '[:upper:]' '[:lower:]' )" = "ok" ] && [ "$( ( [ "$(whoami)" = "student" ] && echo "OK" || echo "FAIL" ) | tr '[:upper:]' '[:lower:]' )" = "ok" ] && echo "SINGLE_LINE_OK"\r`;
  ws.send(cmd);
  await wait(4000);
  console.log("Finished.");
  ws.close();
}
