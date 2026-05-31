import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  terminalSocket, 
  pingServer as servicePingServer, 
  parseTerminalOutput 
} from '../services/terminal';
import type { 
  ConnectionState, 
  ServerConfig, 
  PingResult, 
  TerminalLine 
} from '../types';

interface TerminalConnectionContextState {
  connectionState:  ConnectionState;
  latencyMs:        number | null;
  lastError:        string | null;
  isReconnecting:   boolean;
  // Actions
  connect:          (config: ServerConfig, uid: string) => void;
  disconnect:       () => void;
  sendCommand:      (command: string) => void;
  sendRawKey:       (ansiSequence: string) => void;
  pingServer:       (config: ServerConfig) => Promise<PingResult>;
  // Terminal output stream
  outputLines:      TerminalLine[];
  clearOutput:      () => void;
}

const TerminalConnectionContext = createContext<TerminalConnectionContextState | null>(null);

export const TerminalConnectionContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('offline');
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [outputLines, setOutputLines] = useState<TerminalLine[]>([]);

  // Persistent reference to reuse credentials in auto-reconnect loops
  const configRef = useRef<ServerConfig | null>(null);
  const uidRef = useRef<string | null>(null);

  const disconnect = useCallback(() => {
    terminalSocket.disconnect();
    setConnectionState('disconnected');
    setIsReconnecting(false);
  }, []);

  const connect = useCallback((config: ServerConfig, uid: string) => {
    configRef.current = config;
    uidRef.current = uid;
    setConnectionState('connecting');
    setLastError(null);
    setIsReconnecting(false);

    terminalSocket.connect(config.ip, config.port, config.sshUser, uid, {
      onOpen: () => {
        setConnectionState('connected');
        setLastError(null);
        setIsReconnecting(false);
      },
      onMessage: (data) => {
        const parsed = parseTerminalOutput(data, '');
        setOutputLines((prev) => {
          const combined = [...prev, ...parsed];
          return combined.length > 500 ? combined.slice(-500) : combined;
        });
      },
      onError: () => {
        setLastError('Socket error occurred.');
      },
      onClose: (code) => {
        setConnectionState(code === 1000 ? 'disconnected' : 'error');
        if (code !== 1000) {
          setIsReconnecting(true);
        } else {
          setIsReconnecting(false);
        }
      },
    });
  }, []);

  const sendCommand = useCallback((command: string) => {
    const commandLine: TerminalLine = {
      id: `local-cmd-${Date.now()}-${Math.random()}`,
      type: 'command',
      content: command,
      timestamp: Date.now(),
    };
    setOutputLines((prev) => {
      const combined = [...prev, commandLine];
      return combined.length > 500 ? combined.slice(-500) : combined;
    });
    terminalSocket.send(command + '\n');
  }, []);

  const sendRawKey = useCallback((ansiSequence: string) => {
    terminalSocket.send(ansiSequence);
  }, []);

  const pingServer = useCallback(async (config: ServerConfig): Promise<PingResult> => {
    return servicePingServer(config.ip, config.port);
  }, []);

  const clearOutput = useCallback(() => {
    setOutputLines([]);
  }, []);

  // Safe teardown when context goes out of scope
  useEffect(() => {
    return () => {
      terminalSocket.disconnect();
    };
  }, []);

  return (
    <TerminalConnectionContext.Provider
      value={{
        connectionState,
        latencyMs,
        lastError,
        isReconnecting,
        connect,
        disconnect,
        sendCommand,
        sendRawKey,
        pingServer,
        outputLines,
        clearOutput,
      }}
    >
      {children}
    </TerminalConnectionContext.Provider>
  );
};

export function useTerminalConnection(): TerminalConnectionContextState {
  const context = useContext(TerminalConnectionContext);
  if (!context) {
    throw new Error('[useTerminalConnection] Must be used within <TerminalConnectionContextProvider>.');
  }
  return context;
}
