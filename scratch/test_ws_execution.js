const WebSocket = require('ws');

const gatewayUrl = 'ws://18.232.76.157:8080/terminal?user=student&uid=debug-user-456';
const ws = new WebSocket(gatewayUrl);

ws.on('open', () => {
  console.log("WebSocket opened.");
  setTimeout(runTest, 2000);
});

ws.on('message', (data) => {
  console.log("RCV:", JSON.stringify(data.toString()));
});

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTest() {
  // Test 1: Send with \n
  console.log("\nSending with \\n:");
  ws.send("echo 'TEST_N'\n");
  await wait(2000);

  // Test 2: Send with \r
  console.log("\nSending with \\r:");
  ws.send("echo 'TEST_R'\r");
  await wait(2000);

  // Test 3: Send with \r\n
  console.log("\nSending with \\r\\n:");
  ws.send("echo 'TEST_RN'\r\n");
  await wait(2000);

  console.log("\nFinished.");
  ws.close();
}
