const WebSocket = require('ws');

const gatewayUrl = 'ws://18.232.76.157:8080/terminal?user=student&uid=debug-user-echo';
const ws = new WebSocket(gatewayUrl);

ws.on('open', () => {
  console.log("WebSocket opened.");
  setTimeout(() => {
    console.log("Sending echo command...");
    ws.send("echo 'HELLO'\r");
  }, 2000);
});

ws.on('message', (data) => {
  console.log("RCV:", JSON.stringify(data.toString()));
});

ws.on('close', (code, reason) => {
  console.log(`WebSocket closed: ${code} - ${reason}`);
});

ws.on('error', (err) => {
  console.error("WS ERROR:", err);
});

setTimeout(() => {
  ws.close();
}, 8000);
