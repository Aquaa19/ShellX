export type TerminalLineType = 'command' | 'output' | 'error' | 'system';

export interface TerminalLine {
  id:         string;
  type:       TerminalLineType;
  content:    string;
  timestamp?: number;
}

export type ConnectionState = 'connected' | 'connecting' | 'disconnected' | 'error' | 'offline';

export type VimMode = 'NORMAL' | 'INSERT' | 'VISUAL' | 'COMMAND';

export interface ServerConfig {
  ip:      string;
  port:    string;
  sshUser: string;
}

export interface PingResult {
  reachable:  boolean;
  latencyMs:  number | null;
  error:      string | null;
}
