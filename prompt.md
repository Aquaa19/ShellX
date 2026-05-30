# Coder AI Prompt — Phase 2.3: SSH Socket Connection Layer & Diagnostic Engine

Act as an elite Mobile System Architect and Lead React Native Developer. Your task is to implement the changes and new files required for **Phase 2.3** of the ShellX application.

This phase focuses on:
1. Creating the `TerminalSocket.ts` service singleton to manage the secure WebSocket tunnel connection.
2. Creating the `PingService.ts` to perform lightweight TCP/WebSocket server status diagnostics.
3. Defining Ansi Escape sequences and parsers to strip color codes and classify terminal outputs.
4. Setting up shared TypeScript types for the terminal, lesson structures, and filesystem trees.
5. Creating the reactive `TerminalConnectionContext` to manage connection states, latency, and a capped 500-line rolling buffer of command feeds.
6. Wiring the live "Test Connection" ping trigger and status signals inside `SettingsScreen.tsx` and `ServerStatusSignal.tsx`.

---

### ⚠️ IMPORTANT: ANTI-HALLUCINATION & FILE INTEGRITY RULES
1. **DO NOT guess, assume, or hallucinate** the contents, exports, or types of any existing project files.
2. If you need to see the exact implementation of any existing token, atom, or component to resolve dependencies, **stop and ask the user to provide that file.**
3. Adhere strictly to the design system tokens:
   - OLED True Dark background: `#000000` (`Theme.colors.background.floor`).
   - Zero-shadow rule (`Theme.noShadow`).
   - 1px borders (`Theme.borderWidth.hairline`).
   - Interactive elements must satisfy the minimum 44×44dp touch target constraint.
   - Monospace typography constraints (`Theme.fontFamily.mono`) for code/terminal elements.

---

### 📂 Phase 2.3 Targets

Here are the precise specifications for the files to create and modify:

#### 1. [NEW] `/src/services/terminal/TerminalSocket.ts`
Implement a singleton WebSocket tunnel manager:
- Gateway URL: `wss://{ip}:{wsPort}/terminal?user={sshUser}&uid={firebaseUID}&sshPort={port}` where `wsPort` comes from `AppEnv.ws.port` (defaults to `8080`).
- Reconnection logic: Exponential backoff with delay `AppEnv.ws.reconnectDelayMs * (2 ** attempts)` capped at 30000ms. Max attempts is `AppEnv.ws.maxReconnectAttempts` (defaults to 5).
- Socket functions: `connect(ip, port, sshUser, uid, callbacks)`, `disconnect()`, `send(data)`, `sendRaw(bytes)`.
- Export a single instance: `export const terminalSocket = new TerminalSocketClient();`.

#### 2. [NEW] `/src/services/terminal/PingService.ts`
Implement a one-shot WebSocket ping client (always resolves, never rejects):
```typescript
import { AppEnv } from '../../config/env';

export interface PingResult {
  reachable: boolean;
  latencyMs: number | null;
  error: string | null;
}

export async function pingServer(
  ip: string,
  port: string,
  timeoutMs: number = AppEnv.ws.pingTimeoutMs,
): Promise<PingResult> {
  const startTime = Date.now();
  return new Promise((resolve) => {
    const probeUrl = `${AppEnv.ws.scheme}://${ip}:${AppEnv.ws.port}/ping`;
    let settled = false;

    const settle = (result: PingResult) => {
      if (settled) return;
      settled = true;
      try { ws.close(1000); } catch {}
      resolve(result);
    };

    const timer = setTimeout(() => settle({
      reachable: false, latencyMs: null, error: 'Connection timed out.',
    }), timeoutMs);

    const ws = new WebSocket(probeUrl);
    ws.onopen = () => settle({ reachable: true, latencyMs: Date.now() - startTime, error: null });
    ws.onerror = () => settle({ reachable: false, latencyMs: null, error: 'Host unreachable.' });
    ws.onclose = (e) => {
      if (!settled && e.code !== 1000) {
        settle({ reachable: false, latencyMs: null, error: `Connection closed (code ${e.code}).` });
      }
      clearTimeout(timer);
    };
  });
}
```

#### 3. [NEW] `/src/services/terminal/AnsiSequences.ts`
Define standard ANSI escape characters:
```typescript
export const ANSI = {
  ARROW_UP:    '\x1b[A',
  ARROW_DOWN:  '\x1b[B',
  ARROW_RIGHT: '\x1b[C',
  ARROW_LEFT:  '\x1b[D',
  ESC:         '\x1b',
  TAB:         '\t',
  CTRL_C:      '\x03',
  CTRL_D:      '\x04',
  CTRL_Z:      '\x1a',
  CTRL_L:      '\x0c',
  CTRL_A:      '\x01',
  CTRL_E:      '\x05',
  CTRL_U:      '\x15',
  CTRL_K:      '\x0b',
  CTRL_W:      '\x17',
  CTRL_R:      '\x12',
  BACKSPACE:   '\x7f',
  DELETE:      '\x1b[3~',
  HOME:        '\x1b[H',
  END:         '\x1b[F',
  PAGE_UP:     '\x1b[5~',
  PAGE_DOWN:   '\x1b[6~',
  PIPE:        '|',
  TILDE:       '~',
  FSLASH:      '/',
  BSLASH:      '\\',
  AMPERSAND:   '&',
  SEMICOLON:   ';',
  SPACE:       ' ',
} as const;

export type AnsiKey = keyof typeof ANSI;
```

#### 4. [NEW] `/src/services/terminal/TerminalOutputParser.ts`
Implement ANSI text processing and type classification logic:
- `stripAnsiCodes(raw: string): string` ➔ strips `\x1b[...m` colors and cursor sequences using `/\x1b\[[0-9;]*[a-zA-Z]/g`.
- `classifyOutputLine(line: string): 'command' | 'output' | 'error' | 'system'` ➔ returns `'error'` if line begins with common bash error strings (e.g. `bash:`, `command not found`, `Error:`).
- `parseTerminalOutput(raw: string): TerminalLine[]` ➔ splits text by `\r\n` and `\n`, generating objects with unique IDs and stripped content.

#### 5. [NEW] `/src/services/terminal/index.ts`
Re-export all socket, ping, ANSI, and parser definitions.

#### 6. [NEW] Shared Types (`/src/types/`)
Create three files defining standard data schemas across the app:
* `/src/types/terminal.ts` (defines `TerminalLineType`, `TerminalLine`, `ConnectionState`, `VimMode`, `ServerConfig`)
* `/src/types/lessons.ts` (defines `LessonState`, `LessonData`, `LessonModule`)
* `/src/types/filesystem.ts` (defines `FileNodeType`, `FileTreeNode`)
* `/src/types/index.ts` (clean re-export of all files)

#### 7. [NEW] `/src/context/TerminalConnectionContext.tsx`
Orchestrate active socket flows and output states:
- Subscribes to `terminalSocket` callbacks on mount.
- Connection States: `'connected' | 'connecting' | 'disconnected' | 'error' | 'offline'`.
- Rolling Buffer: Caches received command feeds inside `outputLines: TerminalLine[]`, keeping a maximum cap of **500 lines** (evicts older lines from array slice when new ones arrive).
- Actions: `connect()`, `disconnect()`, `sendCommand()` (appends a command line optimistically and writes `command + '\n'`), `sendRawKey()` (writes ANSI code).

#### 8. [MODIFY] `/src/context/index.ts`
Export context hook:
```typescript
export * from './AppContext';
export * from './NetworkBanner';
export * from './AuthContext';
export * from './TerminalConnectionContext';
```

#### 9. [MODIFY] `/src/App.tsx`
Add Provider to context wrapper hierarchy:
```typescript
<AppContextProvider>
  <AuthContextProvider>
    <TerminalConnectionContextProvider>
      <AppBackground>
        {...}
      </AppBackground>
    </TerminalConnectionContextProvider>
  </AuthContextProvider>
</AppContextProvider>
```

#### 10. [MODIFY] `/src/components/settings/ServerStatusSignal.tsx`
Bind settings loader and status indicators:
- Props support: `state: ConnectionState`, `latencyMs: number | null`, `onTest: () => Promise<void>`, `isTesting: boolean`.
- When `isTesting === true`, replace `StatusDot` with an animated rotating refresh `MaterialIcon`.
- Render `MonoText` with latency offset if connected.

#### 11. [MODIFY] `/src/screens/SettingsScreen.tsx`
- Import `pingServer` and bind "Test Connection" button click.
- Capture testing status loaders, mapping errors, and status dot variations.

---

Provide clean, production-ready TypeScript files without truncated lines or placeholders. Ensure all imports are accurate.