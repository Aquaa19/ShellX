# Implementation Plan — SSH Socket Connection Layer & Diagnostic Engine

Build the WebSocket-based remote SSH terminal gateway bridge, TCP/WebSocket ping probe connectivity diagnostic service, input schema validation rules, and context state management for active console connection sessions.

## Proposed Changes

### Domain Typing Primitives

#### [NEW] [terminal.ts](file:///c:/Users/aquaa/Docs/APP/NP/ShellX/src/types/terminal.ts)
* Define types representing terminal data models:
  * `TerminalLineType`: `'command' | 'output' | 'error' | 'system'`
  * `TerminalLine`: id, type, content, optional timestamp
  * `ConnectionState`: `'connected' | 'connecting' | 'disconnected' | 'error' | 'offline'`
  * `VimMode`: `'NORMAL' | 'INSERT' | 'VISUAL' | 'COMMAND'`
  * `ServerConfig`: ip, port, sshUser
  * `PingResult`: reachable, latencyMs, error

#### [NEW] [lessons.ts](file:///c:/Users/aquaa/Docs/APP/NP/ShellX/src/types/lessons.ts)
* Define types representing module lesson data structures:
  * `LessonState`: `'complete' | 'inProgress' | 'locked'`
  * `LessonData`: id, moduleId, title, description, commandCount, estimatedMinutes, state, progress, validationCommand, validationExpected, instructions, order
  * `LessonModule`: id, title, order, lessons

#### [NEW] [filesystem.ts](file:///c:/Users/aquaa/Docs/APP/NP/ShellX/src/types/filesystem.ts)
* Define types representing remote directories and file tree structure:
  * `FileNodeType`: `'file' | 'directory' | 'symlink'`
  * `FileTreeNode`: name, path, type, size, extension, children, isLoading, isExpanded

#### [NEW] [index.ts](file:///c:/Users/aquaa/Docs/APP/NP/ShellX/src/types/index.ts)
* Single barrel export for all types in `src/types`.

---

### Terminal & Ping Service Layer

#### [NEW] [TerminalSocket.ts](file:///c:/Users/aquaa/Docs/APP/NP/ShellX/src/services/terminal/TerminalSocket.ts)
* Build the `TerminalSocketClient` singleton managing connection events to the remote node-pty websocket bridge:
  * Connect using wss gateway URL: `wss://{ip}:{wsPort}/terminal?user={sshUser}&uid={firebaseUID}&sshPort={port}`
  * Handle event listeners (`onOpen`, `onMessage`, `onError`, `onClose`) with reconnect exponential backoff retry caps using `AppEnv.ws` parameters.
  * Disconnect explicitly when logging out or clearing state.

#### [NEW] [PingService.ts](file:///c:/Users/aquaa/Docs/APP/NP/ShellX/src/services/terminal/PingService.ts)
* Build a one-shot WebSocket connection probe to measure latency between `onopen` handshakes, resolving reachability stats securely to setting signals.

#### [NEW] [AnsiSequences.ts](file:///c:/Users/aquaa/Docs/APP/NP/ShellX/src/services/terminal/AnsiSequences.ts)
* Map constants for ANSI escape sequences (`ARROW_UP`, `ESC`, `CTRL_C`, etc.) used by custom keyboard actions.

#### [NEW] [TerminalOutputParser.ts](file:///c:/Users/aquaa/Docs/APP/NP/ShellX/src/services/terminal/TerminalOutputParser.ts)
* Implement output handlers to:
  * Strip VT100 / ANSI color styles (`stripAnsiCodes`).
  * Classify shell errors, system welcome signs, commands, or regular outputs (`classifyOutputLine`).
  * Parse raw incoming byte strings into individual `TerminalLine` nodes.

#### [NEW] [index.ts](file:///c:/Users/aquaa/Docs/APP/NP/ShellX/src/services/terminal/index.ts)
* Barrel exports for all terminal services.

---

### React Connection Context

#### [NEW] [TerminalConnectionContext.tsx](file:///c:/Users/aquaa/Docs/APP/NP/ShellX/src/context/TerminalConnectionContext.tsx)
* Create `TerminalConnectionContext` to manage connection, latency, and line stream states:
  * Optimistically echo typed inputs into local command history lines.
  * Cap screen console line buffer history strictly at 500 lines to preserve low-end memory footprints.
  * Auto-subscribe and clean up sockets correctly.

#### [MODIFY] [index.ts](file:///c:/Users/aquaa/Docs/APP/NP/ShellX/src/context/index.ts)
* Export connection context hooks.

#### [MODIFY] [App.tsx](file:///c:/Users/aquaa/Docs/APP/NP/ShellX/src/App.tsx)
* Integrate `TerminalConnectionContextProvider` wrapping `AppBackground` and `RootNavigator`.

---

### UI Settings Component Wireframe

#### [MODIFY] [ServerStatusSignal.tsx](file:///c:/Users/aquaa/Docs/APP/NP/ShellX/src/components/settings/ServerStatusSignal.tsx)
* Wire dynamic state props (`state`, `latencyMs`, `onTest`, `isTesting`) to reflect in-flight loading spinners, ping latency displays, and correct disabled touches.

#### [MODIFY] [SettingsScreen.tsx](file:///c:/Users/aquaa/Docs/APP/NP/ShellX/src/screens/SettingsScreen.tsx)
* Integrate dynamic validation checks for inputs (IP, Port) on test, run the diagnostic engine ping test, and handle saving server preferences cleanly.

---

## Verification Plan

### Automated Tests
* Run `npx tsc --noEmit` to verify type safety across all screens, contexts, and typings.

### Manual Verification
1. **Settings Form Error Handlers:** Type an invalid IP (e.g. `999.999.999`) or bad port, verify validation errors show in config cards instead of sending requests.
2. **Ping Probe Check:** Tap `"Test Connection"`. Verify the loading spinner spins during the request, and returns either connection success with ping latency (e.g., `42ms`) or connection failure message.
3. **Socket Lifecycle Verify:** Enable socket bridge, confirm state badge displays correct connection statuses (`connecting`, `connected`, `disconnected`, `error`).
4. **Buffer Limit Safety:** Generate heavy text output (greater than 500 lines) and verify that the line buffer slice slices old lines off from memory, preventing memory leaks on low-end devices.
