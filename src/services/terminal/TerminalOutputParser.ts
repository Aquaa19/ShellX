import { TerminalLine, TerminalLineType } from '../../types';

export function stripAnsiCodes(raw: string): string {
  // Strips color codes and common terminal escape parameters
  return raw.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '');
}

export function classifyOutputLine(line: string): TerminalLineType {
  const trimmed = line.trim();
  
  // Classify common shell syntax errors
  if (
    trimmed.startsWith('bash:') ||
    trimmed.startsWith('-bash:') ||
    trimmed.includes('command not found') ||
    trimmed.toLowerCase().startsWith('error:') ||
    trimmed.toLowerCase().includes('permission denied')
  ) {
    return 'error';
  }

  // Classify login greetings/system stats
  if (
    trimmed.includes('Welcome to') ||
    trimmed.includes('Last login:') ||
    trimmed.startsWith('Linux ') ||
    trimmed.includes('System information')
  ) {
    return 'system';
  }

  return 'output';
}

export function parseTerminalOutput(raw: string, currentPrompt: string): TerminalLine[] {
  // Split by CRLF or LF
  const lines = raw.split(/\r\n|\n/);
  const result: TerminalLine[] = [];

  lines.forEach((line, index) => {
    const cleanContent = stripAnsiCodes(line);
    
    // Ignore completely empty lines to save vertical viewport clutter
    if (cleanContent === '') {
      return;
    }

    let type: TerminalLineType = classifyOutputLine(cleanContent);
    
    // If it mirrors the active typed prompt, classify it as user command line echo
    if (currentPrompt && cleanContent.startsWith(currentPrompt)) {
      type = 'command';
    }

    result.push({
      id: `${Date.now()}-${index}-${Math.random()}`,
      type,
      content: cleanContent,
      timestamp: Date.now(),
    });
  });

  return result;
}
