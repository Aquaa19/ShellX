const WebSocket = require('ws');

const gatewayUrl = 'ws://18.232.76.157:8080/terminal?user=student&uid=debug-monitor';
const ws = new WebSocket(gatewayUrl);

console.log("Connecting to", gatewayUrl);

ws.on('open', () => {
  console.log("WebSocket connection opened. Monitoring for 20 seconds...");
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
  console.log("Done monitoring.");
  ws.close();
}, 20000);
