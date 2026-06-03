import socket

def test_handshake(path):
    print(f"Testing route: {path}")
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(3)
        s.connect(('18.232.76.157', 8080))
        
        req = (
            f"GET {path} HTTP/1.1\r\n"
            "Host: 18.232.76.157:8080\r\n"
            "Upgrade: websocket\r\n"
            "Connection: Upgrade\r\n"
            "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\n"
            "Sec-WebSocket-Version: 13\r\n\r\n"
        )
        s.sendall(req.encode('utf-8'))
        resp = s.recv(1024).decode('utf-8')
        first_line = resp.split('\r\n')[0]
        print(f"  Response: {first_line}")
        s.close()
    except Exception as e:
        print("  Error:", e)

test_handshake('/audit')
test_handshake('/pty/audit')
test_handshake('/terminal')
test_handshake('/mirror')
test_handshake('/pty/mirror')
