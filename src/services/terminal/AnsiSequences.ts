export const ANSI = {
  // Navigation
  ARROW_UP:    '\x1b[A',
  ARROW_DOWN:  '\x1b[B',
  ARROW_RIGHT: '\x1b[C',
  ARROW_LEFT:  '\x1b[D',
  // Control
  ESC:         '\x1b',
  TAB:         '\t',
  CTRL_C:      '\x03',
  CTRL_D:      '\x04',
  CTRL_Z:      '\x1a',
  CTRL_L:      '\x0c',   // Clear screen
  CTRL_A:      '\x01',   // Go to line start
  CTRL_E:      '\x05',   // Go to line end
  CTRL_U:      '\x15',   // Clear to line start
  CTRL_K:      '\x0b',   // Clear to line end
  CTRL_W:      '\x17',   // Delete word backwards
  CTRL_R:      '\x12',   // Reverse history search
  // Edit
  BACKSPACE:   '\x7f',
  DELETE:      '\x1b[3~',
  HOME:        '\x1b[H',
  END:         '\x1b[F',
  PAGE_UP:     '\x1b[5~',
  PAGE_DOWN:   '\x1b[6~',
  // Special characters
  PIPE:        '|',
  TILDE:       '~',
  FSLASH:      '/',
  BSLASH:      '\\',
  AMPERSAND:   '&',
  SEMICOLON:   ';',
  SPACE:       ' ',
} as const;

export type AnsiKey = keyof typeof ANSI;
