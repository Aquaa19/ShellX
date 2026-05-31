# Implementation Plan — Phase 2.4 Interactive Terminal Shell PTY Integration

Build the interactive shell view engine. Bind the terminal view to live socket stream data, implement scroll virtualizations (FlatList) with custom auto-scroll capabilities, map keyboard inputs to standard ANSI sequence key codes, and dynamically detect editor states (Vim modes).

## Proposed Changes

### 1. Terminal Screen Controller
#### [MODIFY] [TerminalScreen.tsx](file:///home/aquaax19/Workspace/Projects/ShellX/src/screens/TerminalScreen.tsx)
* Replace static layout status and input hooks with real context data from `useTerminalConnection`, `useAuthContext`, and `useAppContext`.
* Initiate connections dynamically on mount.
* Bind command submissions to `sendCommand()` and keyboard actions to `sendRawKey()`.
* Implement a `useEffect` observer watching `outputLines` stream updates to reactively detect active Vim insert/visual/command modes.

---

### 2. Output Renderer (TerminalEditor)
#### [MODIFY] [TerminalEditor.tsx](file:///home/aquaax19/Workspace/Projects/ShellX/src/components/terminal/TerminalEditor.tsx)
* Replace the current mapping `ScrollView` layout with a high-performance virtualized `FlatList` component.
* Bind a `flatListRef` hook with `useEffect` triggers to auto-scroll viewport selections to the end of the line buffer on new stream events.
* Implement `maintainVisibleContentPosition` to preserve scroll points when scrolling back to review previous inputs.
* Wrap item renderers with `React.memo` to optimize layout update overhead.

#### [MODIFY] [TerminalCodeLine.tsx](file:///home/aquaax19/Workspace/Projects/ShellX/src/components/terminal/TerminalCodeLine.tsx)
* Adapt component props to accept a single unified `TerminalLine` type.
* Wrap the component in a custom `React.memo` memoization hook comparing `prev.line.id === next.line.id` for performance optimization.

---

### 3. Keyboard Input Integration
#### [MODIFY] [DeveloperKeyboardBar.tsx](file:///home/aquaax19/Workspace/Projects/ShellX/src/components/terminal/DeveloperKeyboardBar.tsx)
* Define the structured `KeyDef` interface to support sequences.
* Implement the static `DEFAULT_KEYS` mapping table containing ANSI control escape characters (ESC, TAB, Ctrl+C, Arrow keys, etc.) imported from `AnsiSequences.ts`.
* Bind raw click signals to return active escape key definitions.

#### [MODIFY] [DeveloperKeyboardRow.tsx](file:///home/aquaax19/Workspace/Projects/ShellX/src/components/terminal/DeveloperKeyboardRow.tsx)
* Update props to receive the structured `KeyDef` array and map over it to render `TerminalKeyButton` components.

---

### 4. Status Strip & Workspace Composers
#### [MODIFY] [VimStatusStrip.tsx](file:///home/aquaax19/Workspace/Projects/ShellX/src/components/terminal/VimStatusStrip.tsx)
* Refactor parameters to receive strongly typed `VimMode`, `cursorLine`, `cursorCol`, and `lineCount` values.
* Render the cursor details and the total lines inside the right status drawer.
* Map mode background colors using theme colors: NORMAL (raised surface), INSERT (action blue), VISUAL (warning orange), and COMMAND (info blue).

#### [MODIFY] [TerminalWorkspace.tsx](file:///home/aquaax19/Workspace/Projects/ShellX/src/components/terminal/TerminalWorkspace.tsx)
* Re-route and pipe all interactive inputs, mode properties, cursor configurations, and scroll streams from the screen controller straight down to children.

---

## Verification Plan

### Automated Tests
* Run `npx tsc --noEmit` to verify full compile-time type-safety and ensure no broken imports or type assignments.

### Manual Verification
1. **Interactive Shell Flow**: Type standard shell commands (e.g. `ls -la`) and press submit. Verify they echo immediately in the console and the terminal updates with PTY output.
2. **Auto-Scroll Behavior**: Execute commands that print long outputs (e.g. `cat` or `dmesg`). Check that the flat list scrolls automatically to the end.
3. **Viewport Lock (Scroll-up Check)**: Scroll up manually while a command is outputting. Verify that the view does not violently snap back to the bottom, allowing you to read history comfortably.
4. **ANSI Keyboard Bar**: Click keys like `TAB` (for tab-completion), `↑` (for command history retrieval), and `CTRL+C` (for process termination) to verify that proper raw sequences are injected and processed correctly by the remote shell.
5. **Vim Mode Dynamic Sync**: Launch `vim` in the terminal. Verify the status strip updates to `INSERT` mode when pressing `i`, `VISUAL` mode when pressing `v`, and back to `NORMAL` mode on `ESC`.
