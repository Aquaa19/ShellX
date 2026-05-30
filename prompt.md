# Coder AI Prompt — Generate Roadmap 2 (Dynamic & Live CUI ShellX Client)

Act as an elite Mobile System Architect and Lead React Native Developer. Your task is to generate **Roadmap2.md** — a masterclass-tier, highly granular, production-ready implementation roadmap to transform the static ShellX React Native prototype into a fully dynamic, backend-connected Linux Lab simulator app.

This roadmap will serve as the uncompromised source of truth for our local Antigravity verification system and the coder AI agent to build out the backend integrations step-by-step.

Since you are running in a fresh workspace context, **below is the complete design system glossary, legend, project tree, and formatting templates** to ensure 100% alignment with our existing codebase.

---

### ⚠️ IMPORTANT: STRICT RULE ON EXTERNAL CONTEXT
You do not have direct access to our local files. **DO NOT guess, assume, or hallucinate the contents, exports, or types of any existing project files.**
* If you need to see the exact implementation of any existing file (such as a token definition, custom text atom, component, or static screen structure) to write your code correctly, **you must explicitly stop and ask the user to provide that file.**
* Do not make assumptions about sibling files or dependency structures.

---

## 📂 Existing Project Tree Structure

```
/src
├── App.tsx
├── atoms
│   ├── index.ts
│   ├── badges
│   │   ├── ConnectionBadge.tsx
│   │   ├── index.ts
│   │   ├── LessonStateBadge.tsx
│   │   ├── StatusDot.tsx
│   │   ├── StatusIndicatorBadge.tsx
│   │   └── TrafficLightDots.tsx
│   ├── buttons
│   │   ├── IconButton.tsx
│   │   ├── index.ts
│   │   ├── NavButton.tsx
│   │   ├── PrimaryActionButton.tsx
│   │   ├── SecondaryActionButton.tsx
│   │   └── TerminalKeyButton.tsx
│   ├── containers
│   │   ├── BorderedSurface.tsx
│   │   ├── Divider.tsx
│   │   ├── index.ts
│   │   ├── ProgressTrack.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── Surface.tsx
│   │   └── TerminalPanel.tsx
│   ├── icons
│   │   ├── FileTypeIcon.tsx
│   │   ├── FolderIcon.tsx
│   │   ├── index.ts
│   │   ├── MaterialIcon.tsx
│   │   └── TerminalIcon.tsx
│   ├── inputs
│   │   ├── ConfigInputField.tsx
│   │   ├── IconTextInput.tsx
│   │   ├── index.ts
│   │   └── TerminalTextInput.tsx
│   └── text
│       ├── BodyText.tsx
│       ├── HeadlineText.tsx
│       ├── index.ts
│       ├── LabelCapsText.tsx
│       ├── MonoText.tsx
│       ├── SafeText.tsx
│       ├── SyntaxText.tsx
│       └── TerminalText.tsx
├── components
│   ├── index.ts
│   ├── auth
│   │   ├── AuthBrandPanel.tsx
│   │   ├── AuthTerminalHeader.tsx
│   │   ├── AuthTerminalOutput.tsx
│   │   ├── AuthTerminalWindow.tsx
│   │   ├── GoogleSignInButton.tsx
│   │   └── index.ts
│   ├── filesystem
│   │   ├── FileRow.tsx
│   │   ├── FileSystemTree.tsx
│   │   ├── FileTreeBranch.tsx
│   │   ├── FileTreeRow.tsx
│   │   ├── FolderRow.tsx
│   │   ├── index.ts
│   │   ├── SelectedFileRow.tsx
│   │   └── TreeIndentGuide.tsx
│   ├── lessons
│   │   ├── AsciiProgressText.tsx
│   │   ├── index.ts
│   │   ├── LessonCard.tsx
│   │   ├── LessonCardGrid.tsx
│   │   ├── LessonCardHeader.tsx
│   │   ├── LessonModuleSection.tsx
│   │   ├── LessonProgressBar.tsx
│   │   ├── LessonProgressMeta.tsx
│   │   ├── LessonsHeader.tsx
│   │   └── LessonStatusIcon.tsx
│   ├── navigation
│   │   ├── BottomTabBar.tsx
│   │   ├── BottomTabItem.tsx
│   │   ├── DesktopSideNav.tsx
│   │   ├── FocusedHeader.tsx
│   │   ├── index.ts
│   │   ├── SideNavItem.tsx
│   │   └── SideNavProfileHeader.tsx
│   ├── settings
│   │   ├── index.ts
│   │   ├── ProfileAvatarBlock.tsx
│   │   ├── SaveConfigurationButton.tsx
│   │   ├── ServerConfigInput.tsx
│   │   ├── ServerStatusSignal.tsx
│   │   └── SettingsConfigCard.tsx
│   ├── shell
│   │   ├── AppBackground.tsx
│   │   ├── AppHeader.tsx
│   │   ├── DottedGridOverlay.tsx
│   │   ├── index.ts
│   │   ├── ScanlineOverlay.tsx
│   │   ├── ShellXBrandMark.tsx
│   │   ├── ShellXLogoText.tsx
│   │   └── TrueDarkCanvas.tsx
│   └── terminal
│       ├── DeveloperKeyboardBar.tsx
│       ├── DeveloperKeyboardRow.tsx
│       ├── index.ts
│       ├── KeyboardDivider.tsx
│       ├── LessonContextHeader.tsx
│       ├── TaskBottomSheet.tsx
│       ├── TaskSheetActions.tsx
│       ├── TaskSheetHeader.tsx
│       ├── TerminalCodeLine.tsx
│       ├── TerminalCursor.tsx
│       ├── TerminalEditor.tsx
│       ├── TerminalPromptLine.tsx
│       ├── TerminalSyntaxText.tsx
│       ├── TerminalWorkspace.tsx
│       ├── TopMetricsBar.tsx
│       └── VimStatusStrip.tsx
├── data
│   ├── index.ts
│   ├── mockAuth.ts
│   ├── mockFileTree.ts
│   ├── mockLessons.ts
│   └── mockTerminalLines.ts
├── navigation
│   ├── index.ts
│   ├── MainTabNavigator.tsx
│   └── RootNavigator.tsx
├── screens
│   ├── AuthScreen.tsx
│   ├── FileSystemScreen.tsx
│   ├── index.ts
│   ├── LessonsScreen.tsx
│   ├── SettingsScreen.tsx
│   ├── SplashScreen.tsx
│   └── TerminalScreen.tsx
└── tokens
    ├── borders.ts
    ├── colors.ts
    ├── index.ts
    ├── layout.ts
    ├── shadows.ts
    ├── spacing.ts
    ├── theme.ts
    ├── typography.ts
    └── zIndex.ts
```

---

## 🎨 Existing Design System Glossary (`src/tokens/`)

Your implementation plan must references these exact tokens:

1. **Colors (`colors.ts`):**
   - `Theme.colors.background.floor`: `#000000` (True OLED Black)
   - `Theme.colors.background.elevated`: `#0D0D0D`
   - `Theme.colors.background.input`: `#000000`
   - `Theme.colors.border.subtle` / `Theme.colors.border.default`: `#1F2937`
   - `Theme.colors.border.focus`: `#3B82F6`
   - `Theme.colors.primary.default`: `#3B82F6`
   - `Theme.colors.primary.dim`: `#1D4ED8`
   - `Theme.colors.primary.glow`: `rgba(59, 130, 246, 0.12)`
   - `Theme.colors.primary.muted`: `rgba(59, 130, 246, 0.20)`
   - `Theme.colors.text.primary`: `#F9FAFB`
   - `Theme.colors.text.secondary`: `#9CA3AF`
   - `Theme.colors.text.tertiary`: `#6B7280`
   - `Theme.colors.semantic.success`: `#4FDF94`
   - `Theme.colors.semantic.warning`: `#F59E0B`
   - `Theme.colors.semantic.error`: `#EF4444`

2. **Typography (`typography.ts`):**
   - Font Family Sans (`Theme.fontFamily.sans`): `Inter-Regular` / `Inter-Medium` / `Inter-Bold`
   - Font Family Mono (`Theme.fontFamily.mono`): `JetBrainsMono-Regular` / `JetBrainsMono-Medium` / `JetBrainsMono-Bold`
   - Sizes (`Theme.fontSize`): `headlineLG` (30), `headlineMD` (24), `titleLG` (18), `titleMD` (16), `bodyLG` (16), `bodyMD` (15), `bodySM` (14), `labelLG` (13), `labelMD` (12), `labelSM` (11), `labelXS` (10), `codeBase` (14).

3. **Radii & Borders (`borders.ts`):**
   - Radii: `none` (0), `sm` (2), `default` / `md` (4), `lg` (8), `xl` (12), `xxl` (16), `full` (9999).
   - Widths: `none` (0), `hairline` (1), `medium` (2).
   - Zero-Shadow Rule: `Theme.noShadow` completely clears elevation, shadowColor, and shadowRadius to satisfy true dark borders.

4. **Spacing (`spacing.ts`):**
   - `Theme.spacing`: `px` (1), `xxs` (2), `xs` (4), `sm` (8), `md` (16), `lg` (24), `xl` (32), `xxl` (40), `xxxl` (48), `huge` (64).

5. **Layout (`layout.ts`):**
   - `Theme.layout`: `topAppBarHeight` (56), `bottomNavHeight` (56), `developerKeyboardBarHeight` (56), `vimStatusStripHeight` (32), `progressBarHeight` (4), `minTouchTarget` (44), `comfortTouchTarget` (48).

---

## 🔌 Target Dependency Stack & Integration Architecture

To avoid hallucinations of deprecated or non-existent React Native wrappers, Roadmap 2 must enforce this exact technology stack:

1. **State & Storage:**
   - **Local Storage:** `@react-native-async-storage/async-storage` for caching remote configuration settings.
   - **Global Reactive State:** React Context API (e.g., `AppContext` or `TerminalConnectionContext`) to share connection states, ping diagnostics, and active session credentials across sibling screens (Terminal, FileSystem, and Settings).
   - **Network Uptime Tracking:** `@react-native-community/netinfo` to toggle offline mode banners when cellular/WiFi drops.

2. **Authentication Infrastructure:**
   - **Firebase App & Core:** `@react-native-firebase/app`
   - **Firebase Authentication:** `@react-native-firebase/auth`
   - **Google Authentication Client:** `@react-native-google-signin/google-signin`
   - **Firebase Firestore (Progress Sync):** `@react-native-firebase/firestore`

3. **Remote SSH Command Execution (PTY Wrapper):**
   - **Connection Architecture:** Client establishes a secure WebSocket tunnel connection to an instance-side or gateway terminal server (e.g., a node-pty / xterm.js socket gateway running on AWS/Cloud VM). This is the recommended lightweight, highly responsive mobile approach, avoiding direct native SSH sockets.
   - Alternatively, detail how client-side socket wrappers (like `react-native-tcp-socket` or `react-native-ssh-wrapper`) will be scaffolded, including proper socket closure and clean-up in the React Native lifecycle.

4. **Persisted Shell Session Feed:**
   - When entering insert mode or running vim, screen inputs must forward characters directly to the shell socket stream.
   - The shell response parser must handle standard formatting, output wrapping, and error output lines.

5. **Environment Configuration Security:**
   - Use `react-native-config` or similar to handle staging/production keys, client IDs, and secret tokens safely outside of version-controlled code.

---

## ⚙️ Suggested Build Order & Phases to Define in Roadmap 2

The implementation must be broken down into chronological, logical phases:

### Phase 2.1: Local Persistence & Initial Routing Flow
- **Objectives:**
  - Setup local client caching using `@react-native-async-storage/async-storage` for remote server settings (IP, Port, and SSH credentials).
  - Convert the static `SplashScreen` loader into a real initialization progress flow: simulates progress bar filling (0% to 100% in 1.5 seconds) while checking for an active auth session, then auto-routes to either `AuthScreen` or `TerminalScreen` (Main Navigator).
  - Setup settings persistence so the server configuration is stored, loaded on settings boot, and updated reactively.

### Phase 2.2: Live Authentication Integration (Firebase Auth & Google OAuth)
- **Objectives:**
  - Add standard firebase dependencies: `@react-native-firebase/app`, `@react-native-firebase/auth`, and `@react-native-google-signin/google-signin`.
  - Replace the mock Google sign-in wrapper inside `AuthScreen.tsx` with a fully functional Firebase sign-in-with-credential flow.
  - Wire up a complete Sign Out handler inside `SettingsScreen.tsx` that clears authentication tokens, wipes local caches, and resets navigation back to the `AuthScreen` stack.

### Phase 2.3: SSH Socket Connection Layer & Connection Diagnostic Engine
- **Objectives:**
  - Implement a remote Linux instance verification layer using direct TCP socket probes or a WebSocket terminal bridge (representing an SSH shell session client).
  - Create input validation schemas (such as IP validation regex and port limits) for the settings fields in `SettingsScreen.tsx`.
  - Wire the `ServerStatusSignal` connection test callback: triggers a ping probe to verify target server uptime, displays latency in milliseconds, and updates the status indicator badge to success (green) or offline (red) accordingly.

### Phase 2.4: Interactive Terminal Shell PTY Integration
- **Objectives:**
  - Replace `MOCK_TERMINAL_LINES` with a dynamic reactive array in state.
  - Integrate terminal input execution: typing in `TerminalTextInput` and submitting sends commands to the remote server shell stream, appending results dynamically to the scrollable editor screen.
  - Map `DeveloperKeyboardBar` keys (ESC, TAB, Control keys, navigation arrows) to inject terminal ANSI escape sequences into the active stream.
  - Align auto-scrolling to bottom inside the custom `TerminalEditor` scroll component and synchronize Vim Status Strip insertion-mode and cursor-location metrics dynamically.

### Phase 2.5: Dynamic Lesson Engine & Progress Synchronization
- **Objectives:**
  - Retrieve lesson metadata, instructions, and checking criteria dynamically from Firebase Firestore.
  - Connect lesson card grid items to active states (completed, locked, and in-progress). Selecting an unlocked card loads the lesson details into the terminal context and opens the `TaskBottomSheet`.
  - Implement the "Run Check" script validator: executes a validation command on the remote Linux terminal. If it passes, updates user progress, unlocks the subsequent lesson card, and synchronizes the complete state to Firebase Firestore.

### Phase 2.6: Active FileSystem Explorer Sync
- **Objectives:**
  - Replace `MOCK_FILE_TREE` with a dynamic traversal layer: runs a command (e.g. recursive listing or individual directory inspections) to fetch folder details.
  - Toggle folder nodes dynamically to fetch and insert nested child arrays in tree branches.
  - Enable file tap events to inspect file sizes or load files inside the active command prompt workspace.

---

## 🎨 Document Header, Formatting & Legend Template (Roadmap 2)

Roadmap 2 must match the formatting style and metadata details of Roadmap 1. Please incorporate the exact layout below at the top of your response:

```markdown
# ShellX — Roadmap 2: Dynamic Backend & SSH Integration
## Masterclass-Tier Production Build Plan
### Target: Android CUI Linux Student Learning App (React Native CLI + TypeScript)

---

> **Document Authority:** This file is the singular, uncompromised source of truth for the Antigravity static verification system and the coder AI agent. Every checkbox below represents one discrete, mandatory, atomic build action. No file may be created without a corresponding checked box. No checkbox may be skipped. Build order is strictly chronological within each phase.

---

## ⚙️ Suggested Build Order (Macro)

```
Phase 2.1 → Phase 2.2 → Phase 2.3 → Phase 2.4 → Phase 2.5 → Phase 2.6
   ↓              ↓            ↓             ↓             ↓             ↓
Persistence    Firebase      SSH Socket    PTY Shell     Firestore     FileSystem
& Routing      Auth Auth     Diagnostics   Execution     Sync          Sync
```

---

## 🔖 Legend

| Symbol | Meaning |
|--------|---------|
| `[ ]` | Not started |
| `[x]` | Completed |
| `⚡` | Critical path item — blocking downstream files |
| `🔒` | Do not modify after initial creation without full phase re-verification |
| `📐` | Must pass 44×44dp touch target check |
| `📱` | Must be tested on 5-inch 720×1280 device profile |
| `⌨️` | Must account for soft keyboard layout shift (KeyboardAvoidingView) |
| `🌑` | Must render pure #000000 background — no off-black substitution |
| `🔌` | Requires native dependency linking check |
```

For every file you specify to modify/create under the sub-phases:
1. State the exact path inside a clean list structure.
2. Outline the necessary logic, state hooks, callbacks, and import guidelines.
3. Finish the roadmap with a **PRODUCTION-READY DYNAMIC VERIFICATION CHECKLIST** detailing low-end device CPU load profiles, soft-keyboard heights, authentication session lifecycle flows, WebSocket retry backoff timers, and connection latency limits.

Name the output file "Roadmap2.md" and place it in the same structure.
