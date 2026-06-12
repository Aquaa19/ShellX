import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  terminalSocket, 
  pingServer as servicePingServer, 
  parseTerminalOutput,
  stripAnsiCodes
} from '../services/terminal';
import type { 
  ConnectionState, 
  ServerConfig, 
  PingResult, 
  TerminalLine 
} from '../types';
import { useAppContext } from './AppContext';
import { useAuthContext } from './AuthContext';

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
  executeBackgroundCommand: (command: string) => Promise<string>;
  // Terminal output stream
  outputLines:      TerminalLine[];
  clearOutput:      () => void;
}

const TerminalConnectionContext = createContext<TerminalConnectionContextState | null>(null);

export const TerminalConnectionContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { serverConfig } = useAppContext();
  const { user } = useAuthContext();

  const [connectionState, setConnectionState] = useState<ConnectionState>('offline');
  const [latencyMs, _setLatencyMs] = useState<number | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [outputLines, setOutputLines] = useState<TerminalLine[]>([]);

  // Persistent reference to reuse credentials in auto-reconnect loops
  const configRef = useRef<ServerConfig | null>(null);
  const uidRef = useRef<string | null>(null);
  const lastSentCommandRef = useRef<string | null>(null);

  // Background execution management refs
  const activeBackgroundId = useRef<string | null>(null);
  const backgroundBuffer = useRef<string>('');
  const backgroundPromise = useRef<{ resolve: (data: string) => void; reject: (err: any) => void } | null>(null);
  const backgroundTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        // Intercept and buffer background execution stream
        if (activeBackgroundId.current) {
          backgroundBuffer.current += data;
          const startMarker = `START_${activeBackgroundId.current}`;
          const endMarker = `END_${activeBackgroundId.current}`;

          if (backgroundBuffer.current.includes(endMarker)) {
            if (backgroundTimeout.current) {
              clearTimeout(backgroundTimeout.current);
              backgroundTimeout.current = null;
            }
            const bufferText = backgroundBuffer.current;
            const startIdx = bufferText.indexOf(startMarker);
            const endIdx = bufferText.indexOf(endMarker);

            let content = '';
            if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
              content = bufferText.substring(startIdx + startMarker.length, endIdx);
            } else {
              content = bufferText;
            }

            const cleanContent = stripAnsiCodes(content).trim();
            backgroundPromise.current?.resolve(cleanContent);

            activeBackgroundId.current = null;
            backgroundBuffer.current = '';
            backgroundPromise.current = null;
          }
          return; // Prevents background logs from polluting terminal lists
        }

        const parsed = parseTerminalOutput(data, '');
        const filtered = parsed.filter((line) => {
          const trimmedLine = line.content.trim();
          if (lastSentCommandRef.current && trimmedLine === lastSentCommandRef.current) {
            lastSentCommandRef.current = null;
            return false;
          }
          return true;
        });

        if (filtered.length > 0) {
          setOutputLines((prev) => {
            const combined = [...prev, ...filtered];
            return combined.length > 500 ? combined.slice(-500) : combined;
          });
        }
      },
      onError: () => {
        setLastError('Socket error occurred.');
        if (activeBackgroundId.current) {
          if (backgroundTimeout.current) clearTimeout(backgroundTimeout.current);
          backgroundPromise.current?.reject(new Error('Socket error occurred during background execution.'));
          activeBackgroundId.current = null;
          backgroundBuffer.current = '';
          backgroundPromise.current = null;
        }
      },
      onClose: (code) => {
        setConnectionState(code === 1000 ? 'disconnected' : 'error');
        if (activeBackgroundId.current) {
          if (backgroundTimeout.current) clearTimeout(backgroundTimeout.current);
          backgroundPromise.current?.reject(new Error('Socket closed during background execution.'));
          activeBackgroundId.current = null;
          backgroundBuffer.current = '';
          backgroundPromise.current = null;
        }
        if (code !== 1000) {
          setIsReconnecting(true);
        } else {
          setIsReconnecting(false);
        }
      },
    });
  }, []);

  const sendCommand = useCallback((command: string) => {
    const trimmed = command.trim();
    if (trimmed === 'clear') {
      setOutputLines([]);
      lastSentCommandRef.current = 'clear';
      terminalSocket.send(command + '\r');
      return;
    }

    lastSentCommandRef.current = trimmed;

    setOutputLines((prev) => {
      if (prev.length === 0) {
        return [{
          id: `local-cmd-${Date.now()}-${Math.random()}`,
          type: 'command',
          content: `$ ${command}`,
          timestamp: Date.now(),
        }];
      }

      const copy = [...prev];
      const lastIndex = copy.length - 1;
      const lastItem = copy[lastIndex];
      const isPrompt = (lastItem.content.trim().endsWith('$') || lastItem.content.trim().endsWith('#')) && lastItem.content.includes('@');

      if (isPrompt) {
        copy[lastIndex] = {
          id: `local-cmd-${Date.now()}-${Math.random()}`,
          type: 'command',
          content: `${lastItem.content.trim()} ${command}`,
          timestamp: Date.now(),
        };
      } else {
        copy.push({
          id: `local-cmd-${Date.now()}-${Math.random()}`,
          type: 'command',
          content: `$ ${command}`,
          timestamp: Date.now(),
        });
      }

      return copy.length > 500 ? copy.slice(-500) : copy;
    });

    terminalSocket.send(command + '\r');
  }, []);

  const sendRawKey = useCallback((ansiSequence: string) => {
    if (ansiSequence === '\x0c') {
      setOutputLines([]);
    }
    terminalSocket.send(ansiSequence);
  }, []);

  const pingServer = useCallback(async (config: ServerConfig): Promise<PingResult> => {
    return servicePingServer(config.ip, config.port);
  }, []);

  const executeBackgroundCommand = useCallback((command: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (connectionState !== 'connected') {
        reject(new Error('Terminal is not connected.'));
        return;
      }

      if (activeBackgroundId.current) {
        reject(new Error('A background command is already executing.'));
        return;
      }

      const id = `BG_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      activeBackgroundId.current = id;
      backgroundBuffer.current = '';
      backgroundPromise.current = { resolve, reject };

      backgroundTimeout.current = setTimeout(() => {
        if (activeBackgroundId.current === id) {
          const bufferContent = backgroundBuffer.current ? ` (Buffer: ${backgroundBuffer.current})` : '';
          reject(new Error(`Background command execution timed out${bufferContent}.`));
          activeBackgroundId.current = null;
          backgroundBuffer.current = '';
          backgroundPromise.current = null;
        }
      }, 15000);

      // Check if command is multi-line
      const isMultiLine = command.includes('\n') || command.includes('\r');
      let wrapped = '';
      if (isMultiLine) {
        const cleanCommand = command.replace(/\r?\n/g, '\r');
        wrapped = `echo 'START'_"${id}"\r${cleanCommand}\recho 'END'_"${id}"\r`;
      } else {
        wrapped = `echo 'START'_"${id}" ; ${command} ; echo 'END'_"${id}"\r`;
      }
      terminalSocket.send(wrapped);
    });
  }, [connectionState]);

  const clearOutput = useCallback(() => {
    setOutputLines([]);
  }, []);

  // Auto-connect on startup when user & config are available, or disconnect on logout
  useEffect(() => {
    if (user && serverConfig.ip) {
      const isNewConfig = !configRef.current || 
        configRef.current.ip !== serverConfig.ip || 
        configRef.current.port !== serverConfig.port || 
        configRef.current.sshUser !== serverConfig.sshUser;
      
      const isDisconnectedState = connectionState === 'offline' || 
        connectionState === 'disconnected' || 
        connectionState === 'error';

      if (isDisconnectedState || isNewConfig) {
        connect(serverConfig, user.uid);
      }
    } else if (!user && connectionState !== 'offline' && connectionState !== 'disconnected') {
      disconnect();
    }
  }, [connect, disconnect, serverConfig, user, connectionState]);

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
        executeBackgroundCommand,
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
