import socket
import concurrent.futures

def scan_port(port):
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(1.5)
        res = s.connect_ex(('18.232.76.157', port))
        if res == 0:
            print(f"Port {port} is OPEN")
            return port
    except Exception:
        pass
    return None

print("Scanning ports 8000 to 9000 on 18.232.76.157...")
open_ports = []
with concurrent.futures.ThreadPoolExecutor(max_workers=50) as executor:
    ports = list(range(8000, 9000))
    results = executor.map(scan_port, ports)
    for r in results:
        if r is not None:
            open_ports.append(r)

print("Scan complete. Open ports:", open_ports)
