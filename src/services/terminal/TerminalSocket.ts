import { AppEnv } from '../../config/env';

export type SocketEventCallback = {
  onOpen:    () => void;
  onMessage: (data: string) => void;
  onError:   (event: any) => void;
  onClose:   (code: number, reason: string) => void;
};

function buildGatewayUrl(ip: string, port: string, sshUser: string, uid: string): string {
  const { scheme, port: wsPort } = AppEnv.ws;
  return `${scheme}://${ip}:${wsPort}/terminal?user=${encodeURIComponent(sshUser)}&uid=${encodeURIComponent(uid)}&sshPort=${port}`;
}

class TerminalSocketClient {
  private ws: WebSocket | null = null;
  private callbacks: SocketEventCallback | null = null;
  private reconnectAttempts: number = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private isIntentionallyClosed: boolean = false;

  // Cached connection settings for reconnects
  private ip: string = '';
  private port: string = '';
  private sshUser: string = '';
  private uid: string = '';

  connect(ip: string, port: string, sshUser: string, uid: string, callbacks: SocketEventCallback): void {
    // Clean up any existing connection
    this.disconnect();

    this.ip = ip;
    this.port = port;
    this.sshUser = sshUser;
    this.uid = uid;
    this.callbacks = callbacks;
    this.isIntentionallyClosed = false;

    try {
      const url = buildGatewayUrl(ip, port, sshUser, uid);
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
        this.callbacks?.onOpen();
      };

      this.ws.onmessage = (event) => {
        if (typeof event.data === 'string') {
          this.callbacks?.onMessage(event.data);
        }
      };

      this.ws.onerror = (event) => {
        this.callbacks?.onError(event);
      };

      this.ws.onclose = (event) => {
        this.callbacks?.onClose(event.code ?? 1000, event.reason ?? '');
        if (!this.isIntentionallyClosed && this.reconnectAttempts < AppEnv.ws.maxReconnectAttempts) {
          this.scheduleReconnect();
        }
      };
    } catch (error) {
      console.warn('[TerminalSocketClient] Connection initiation failed:', error);
      // Simulate socket error callback
      this.callbacks?.onError({ type: 'error', message: 'Connection initiation failed' });
    }
  }

  send(data: string): void {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.warn('[TerminalSocketClient] Socket not open. Dropping payload:', data);
      return;
    }
    this.ws.send(data);
  }

  sendRaw(bytes: Uint8Array): void {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.warn('[TerminalSocketClient] Socket not open. Dropping raw binary bytes.');
      return;
    }
    this.ws.send(bytes);
  }

  disconnect(): void {
    this.isIntentionallyClosed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      try {
        this.ws.close(1000, 'Client disconnect');
      } catch {
        // Suppress close errors
      }
      this.ws = null;
    }
    this.reconnectAttempts = 0;
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;

    const delay = Math.min(
      AppEnv.ws.reconnectDelayMs * Math.pow(2, this.reconnectAttempts),
      30000
    );

    this.reconnectAttempts++;
    console.log(`[TerminalSocketClient] Reconnect scheduled in ${delay}ms (Attempt ${this.reconnectAttempts})`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (!this.isIntentionallyClosed) {
        this.connect(this.ip, this.port, this.sshUser, this.uid, this.callbacks!);
      }
    }, delay);
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  get readyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }
}

export const terminalSocket = new TerminalSocketClient();
