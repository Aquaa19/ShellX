import { AppEnv } from '../../config/env';
import { PingResult } from '../../types';

export async function pingServer(
  ip: string,
  port: string,
  timeoutMs: number = AppEnv.ws.pingTimeoutMs,
): Promise<PingResult> {
  const startTime = Date.now();
  return new Promise((resolve) => {
    // Gateway ping route uses the dynamic server IP and custom WS port
    const probeUrl = `${AppEnv.ws.scheme}://${ip}:${AppEnv.ws.port}/ping`;
    let settled = false;

    const settle = (result: PingResult) => {
      if (settled) return;
      settled = true;
      try {
        ws.close(1000);
      } catch (e) {
        // Ignore close error on one-shot probe
      }
      resolve(result);
    };

    const timer = setTimeout(() => {
      settle({
        reachable: false,
        latencyMs: null,
        error: 'Connection timed out.',
      });
    }, timeoutMs);

    const ws = new WebSocket(probeUrl);

    ws.onopen = () => {
      clearTimeout(timer);
      settle({
        reachable: true,
        latencyMs: Date.now() - startTime,
        error: null,
      });
    };

    ws.onerror = () => {
      clearTimeout(timer);
      settle({
        reachable: false,
        latencyMs: null,
        error: 'Host unreachable.',
      });
    };

    ws.onclose = (event) => {
      clearTimeout(timer);
      if (!settled && event.code !== 1000) {
        settle({
          reachable: false,
          latencyMs: null,
          error: `Connection closed (code ${event.code}).`,
        });
      }
    };
  });
}
