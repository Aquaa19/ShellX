import React, { useEffect, useState, useRef } from 'react';
import { Terminal } from 'lucide-react';
import { MonoText, LabelCapsText } from '../atoms';
import type { CommandLog } from '../../types';
import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const INITIAL_LOGS: CommandLog[] = [
  { id: '1', username: 'john_doe@shellx', command: 'ls -la', exitCode: 0, timestamp: '13:14:02', lessonTitle: 'Directory Traversal' },
  { id: '2', username: 'sarah_k@shellx', command: 'cd /home/student/workspace', exitCode: 0, timestamp: '13:14:15', lessonTitle: 'File Management' },
  { id: '3', username: 'mike_p@shellx', command: 'cat secret.txt', exitCode: 1, timestamp: '13:14:28', lessonTitle: 'Read Permissions' },
  { id: '4', username: 'alex_r@shellx', command: 'mkdir -p project/src', exitCode: 0, timestamp: '13:14:40', lessonTitle: 'Create Directories' },
  { id: '5', username: 'john_doe@shellx', command: 'rm -rf /', exitCode: 127, timestamp: '13:14:55', lessonTitle: 'Dangerous Operations' },
];

const RANDOM_COMMANDS = [
  { username: 'david_w@shellx', command: 'gcc -o main main.c', exitCode: 0, lessonTitle: 'C Compiling' },
  { username: 'sarah_k@shellx', command: 'git commit -m "add index"', exitCode: 0, lessonTitle: 'Git Basics' },
  { username: 'mike_p@shellx', command: 'chmod 400 private_key.pem', exitCode: 0, lessonTitle: 'Permissions and Credentials' },
  { username: 'alex_r@shellx', command: 'grep -rn "TODO" .', exitCode: 0, lessonTitle: 'Ripgrep Navigation' },
  { username: 'lucas_t@shellx', command: 'cat /etc/passwd', exitCode: 1, lessonTitle: 'Linux Structure' },
  { username: 'john_doe@shellx', command: 'nano hello.py', exitCode: 0, lessonTitle: 'Command-Line Editors' },
];

export const PTYCommandLogFeed: React.FC = () => {
  const [logs, setLogs] = useState<CommandLog[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when new logs arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  // Connect to Live WebSockets Feed
  useEffect(() => {
    const wsUrl = import.meta.env.VITE_PTY_WS_URL || (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host;
    let socket: WebSocket;
    
    try {
      const wsBase = wsUrl.replace(/\/$/, '');
      socket = new WebSocket(`${wsBase}/audit`);
      
      socket.onopen = () => {
        setIsConnected(true);
        const date = new Date();
        const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
        setLogs([
          {
            id: 'sys-init',
            username: 'system',
            command: 'WebSocket stream active. Awaiting live sandbox terminal activity...',
            exitCode: 0,
            timestamp: timeStr,
            lessonTitle: 'System'
          }
        ]);
        console.log('[PTY Feed] WebSockets audit stream connected.');
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as {
            username?: string;
            command?: string;
            exitCode?: number;
            lessonTitle?: string;
          };
          const date = new Date();
          const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
          
          const cmd = data.command || '';
          const email = data.username || 'student@shellx.com';

          // Sentinel filter for suspicious security actions
          const isSuspicious = 
            cmd.includes('sudo') || 
            cmd.includes('su') || 
            cmd.includes('rm -rf') || 
            cmd.includes('/etc/passwd') ||
            cmd.includes('/etc/shadow');

          if (isSuspicious) {
            addDoc(collection(db, 'securityAlerts'), {
              command: cmd,
              studentEmail: email,
              flagType: cmd.includes('sudo') || cmd.includes('su') ? 'sudo' : 'file_access',
              level: cmd.includes('rm -rf') ? 'critical' : 'warn',
              timestamp: serverTimestamp(),
            }).catch(err => console.error('[Sentinel] Failed to log security alert:', err));
          }

          const newLog: CommandLog = {
            id: (Date.now() + Math.random()).toString(),
            username: data.username || 'student',
            command: cmd,
            exitCode: data.exitCode !== undefined ? data.exitCode : 0,
            timestamp: timeStr,
            lessonTitle: data.lessonTitle || 'Terminal Challenge',
          };
          setLogs((prev) => {
            const next = [...prev, newLog];
            return next.length > 50 ? next.slice(-50) : next;
          });
        } catch (err) {
          console.error('[PTY Feed] Parse error:', err);
        }
      };

      socket.onclose = () => {
        setIsConnected(false);
        console.log('[PTY Feed] WebSockets audit stream closed.');
      };

      socket.onerror = () => {
        setIsConnected(false);
      };
    } catch (e) {
      console.warn('[PTY Feed] Failed to initialize WebSocket connection:', e);
    }

    return () => {
      if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
        socket.close();
      }
    };
  }, []);

  // Fallback Simulator if WebSocket is disconnected
  useEffect(() => {
    if (isConnected) return;

    const interval = setInterval(() => {
      const randomCmd = RANDOM_COMMANDS[Math.floor(Math.random() * RANDOM_COMMANDS.length)];
      const date = new Date();
      const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
      
      const newLog: CommandLog = {
        id: Date.now().toString(),
        username: randomCmd.username,
        command: randomCmd.command,
        exitCode: randomCmd.exitCode,
        timestamp: timeStr,
        lessonTitle: randomCmd.lessonTitle,
      };

      setLogs((prev) => {
        const next = [...prev, newLog];
        return next.length > 50 ? next.slice(-50) : next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-background-elevated)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-sm)',
    flex: 2,
    minWidth: '350px',
  };

  const feedBoxStyle: React.CSSProperties = {
    backgroundColor: '#000000',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: 'var(--radius-default)',
    padding: '12px',
    height: '240px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const logLineStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--spacing-xs)',
    borderBottom: '1px dashed rgba(255,255,255,0.02)',
    paddingBottom: '6px',
    alignItems: 'center',
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={16} color="var(--color-semantic-success)" />
          <LabelCapsText size="11px" color="var(--color-text-secondary)">
            PTY Command Audit Feed (Live)
          </LabelCapsText>
        </div>
        <LabelCapsText 
          size="9px" 
          color={isConnected ? 'var(--color-semantic-success)' : 'var(--color-text-tertiary)'}
          style={{
            border: `1px solid ${isConnected ? 'var(--color-border-success)' : 'var(--color-border-subtle)'}`,
            padding: '2px 6px',
            borderRadius: '4px',
            backgroundColor: isConnected ? 'rgba(79, 223, 148, 0.05)' : 'rgba(255,255,255,0.02)'
          }}
        >
          {isConnected ? 'WebSocket Active' : 'Offline (Simulated)'}
        </LabelCapsText>
      </div>

      <div ref={containerRef} style={feedBoxStyle}>
        {logs.map((log) => {
          if (log.username === 'system') {
            return (
              <div key={log.id} style={logLineStyle}>
                <MonoText size="11px" color="var(--color-text-tertiary)">
                  [{log.timestamp}]
                </MonoText>
                <MonoText size="11px" color="var(--color-syntax-orange)">
                  [ SYSTEM: {log.command} ]
                </MonoText>
              </div>
            );
          }
          const isError = log.exitCode !== 0;
          return (
            <div key={log.id} style={logLineStyle}>
              <MonoText size="11px" color="var(--color-text-tertiary)">
                [{log.timestamp}]
              </MonoText>
              <MonoText size="11px" color="var(--color-syntax-blue)" weight="bold">
                {log.username}
              </MonoText>
              <MonoText size="11px" color="var(--color-text-primary)">
                ➜
              </MonoText>
              <MonoText 
                size="11px" 
                color={isError ? 'var(--color-semantic-error)' : 'var(--color-syntax-green)'}
                weight="bold"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  padding: '2px 6px',
                  borderRadius: '2px'
                }}
              >
                {log.command}
              </MonoText>
              <span style={{ flex: 1 }} />
              <LabelCapsText size="9px" color="var(--color-text-tertiary)" style={{ marginRight: '8px' }}>
                {log.lessonTitle}
              </LabelCapsText>
              <MonoText size="10px" color={isError ? 'var(--color-semantic-error)' : 'var(--color-semantic-success)'}>
                (exit: {log.exitCode})
              </MonoText>
            </div>
          );
        })}
      </div>
    </div>
  );
};
