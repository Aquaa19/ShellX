# Coder AI Prompt — Generate Roadmap 2 (Dynamic & Live CUI ShellX Client)

Act as an elite Mobile System Architect and Lead React Native Developer. Your task is to generate **Roadmap2.md** — a masterclass-tier, highly granular, production-ready implementation roadmap to transform the static ShellX React Native prototype into a fully dynamic, backend-connected Linux Lab simulator app.

This roadmap will serve as the uncompromised source of truth for our local Antigravity verification system and the coder AI agent to build out the backend integrations step-by-step.

---

### ⚠️ IMPORTANT: STRICT RULE ON EXTERNAL CONTEXT
You do not have direct access to our local files. **DO NOT guess, assume, or hallucinate the contents, exports, or types of any existing project files.**
* If you need to see the exact implementation of any existing file (such as a token definition, custom text atom, component, or static screen structure) to write your code correctly, **you must explicitly stop and ask the user to provide that file.**
* Do not make assumptions about sibling files or dependency structures.

---

## 📂 Existing Project Tree Structure

Here is the exact layout of the codebase you will build on top of:

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

## 🎨 Roadmap 2 Formatting Requirements

Transform these specifications into a detailed markdown document named `Roadmap2.md` using the exact layout style of `Roadmap1.md`:
1. Include a clear **Suggested Build Order (Macro)** diagram showing the flow of phases.
2. Group tasks under sub-phase directories (e.g., Sub-Phase 2.1.A, 2.1.B).
3. Under each sub-phase, provide a meticulous checklist of checkboxes `[ ]` listing exactly what to modify/create, file by file, specifying explicit, mandatory paths.
4. For every file, explicitly state the exact logic layout, state structures, UI connections, dependency imports, and safety checks required.
5. End with a **PRODUCTION-READY DYNAMIC VERIFICATION CHECKLIST** detailing testing on 5-inch devices, soft-keyboard overlays, Firebase lifecycle hooks, SSH socket latency testing, terminal command output wrapping, and filesystem recursion limits.

Name the output file "Roadmap2.md" and place it in the same structure.
