export interface TerminalLine {
  text: string;
  type: 'command' | 'output' | 'error';
  lineNumber?: number;
}

export const MOCK_TERMINAL_LINES: TerminalLine[] = [
  { text: 'whoami', type: 'command', lineNumber: 1 },
  { text: 'student', type: 'output', lineNumber: 2 },
  { text: 'ls -la', type: 'command', lineNumber: 3 },
  { text: 'drwxr-xr-x 4 student student 4096 May 29 09:00 .', type: 'output', lineNumber: 4 },
  { text: 'drwxr-xr-x 3 root    root    4096 May 28 14:00 ..', type: 'output', lineNumber: 5 },
  { text: '-rw-r--r-- 1 student student   21 May 29 09:10 hello.sh', type: 'output', lineNumber: 6 },
  { text: 'cat missing_file.txt', type: 'command', lineNumber: 7 },
  { text: 'cat: missing_file.txt: No such file or directory', type: 'error', lineNumber: 8 },
];