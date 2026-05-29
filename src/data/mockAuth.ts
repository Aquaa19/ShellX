import type { SyntaxRole } from '../atoms';

export interface OutputLine {
  text: string;
  role?: SyntaxRole;
}

export const MOCK_AUTH_TERMINAL_OUTPUT: OutputLine[] = [
  { text: 'Initializing secure container...', role: 'comment' },
  { text: 'Loading kernel modules        [ OK ]', role: 'string' },
  { text: 'Mounting virtual filesystem   [ OK ]', role: 'string' },
  { text: 'Starting authentication daemon...', role: 'default' },
  { text: 'Awaiting user verification...', role: 'keyword' },
];