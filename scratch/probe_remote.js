const WebSocket = require('ws');

const gatewayUrl = 'ws://18.232.76.157:8080/terminal?user=student&uid=debug-user-probe';
const ws = new WebSocket(gatewayUrl);

ws.on('open', () => {
  console.log("WebSocket opened.");
  setTimeout(() => {
    console.log("Sending probe commands...");
    ws.send("whoami\r");
    setTimeout(() => {
      ws.send("uname -r\r");
      setTimeout(() => {
        ws.send("cat /etc/os-release\r");
        setTimeout(() => {
          ws.close();
        }, 3000);
      }, 2000);
    }, 2000);
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
