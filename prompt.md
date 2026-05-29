# Coder AI Prompt — Phase 1.4: Part 1 (Mock Data, SplashScreen, & AuthScreen)

Please implement the data layer and initial screens for **Phase 1.4 — Screen View Frame Assembly & State Layout Stubs** (specifically Sub-Phases 1.4.A, 1.4.B, and 1.4.C).

All files must follow the strict design guidelines:
- **OLED True Dark:** Backgrounds must be pure `#000000` (e.g., `Theme.colors.background.floor`).
- **No Elevation or Shadows:** Use `...Theme.noShadow`.
- **Typographic & Layout Integrity:** Use standard token values from `Theme` in `../../tokens`.
- **TypeScript Type Safety:** Export all interfaces and use `StyleProp<ViewStyle>` or `StyleProp<TextStyle>` where applicable.
- **Accessibility:** Ensure all interactive elements (`TouchableOpacity`, `TextInput`) have `accessibilityLabel` and `accessibilityRole` defined, and all decorative elements have `accessible={false}` and `importantForAccessibility="no-hide-descendants"`.

---

### ⚠️ IMPORTANT: STRICT RULE ON EXTERNAL CONTEXT
You do not have direct access to our local files. **DO NOT guess, assume, or hallucinate the contents, exports, or types of any existing project files.**
* If you need to see the exact implementation of any existing file (such as a token definition, custom text atom, or component) to write your code correctly, **you must explicitly stop and ask the user to provide that file.**
* Do not make assumptions about sibling files or dependency structures.

As context, we already have:
* Standard typography, spacing, layout, border, and design tokens exported from `Theme` in `../../tokens`.
* Atoms (like `SafeText`, `MonoText`, `LabelCapsText`, `HeadlineText`, `BodyText`, `TerminalText`, `SyntaxText`, `StatusDot`, `TrafficLightDots`, `StatusIndicatorBadge`, `ConnectionBadge`, `LessonStateBadge`, `PrimaryActionButton`, `SecondaryActionButton`, `IconButton`, `NavButton`, `TerminalKeyButton`, `TerminalTextInput`, `IconTextInput`, `ConfigInputField`, `MaterialIcon`, `TerminalIcon`, `FolderIcon`, `FileTypeIcon`, `Surface`, `BorderedSurface`, `TerminalPanel`, `SectionHeader`, `Divider`, `ProgressTrack`) in `../../atoms`.
* Shell, Navigation, and Auth components (like `TrueDarkCanvas`, `AppBackground`, `ScanlineOverlay`, `DottedGridOverlay`, `AppHeader`, `ShellXBrandMark`, `ShellXLogoText`, `AuthTerminalWindow`, `AuthTerminalHeader`, `AuthBrandPanel`, `GoogleSignInButton`, `AuthTerminalOutput`) in `../../components/`.

---

## 📂 TypeScript Schemas to Use

For the mock data generation, please define and use the following exact schemas:

### 1. `LessonData`
```typescript
import { LessonState } from '../components/lessons/LessonStatusIcon';

export interface LessonData {
  id: string;
  title: string;
  commandCount: number;
  estimatedMinutes: number;
  state: LessonState;
  progress: number; // 0 to 1
  moduleIcon?: string;
}
```

### 2. `FileTreeNode`
```typescript
export interface FileTreeNode {
  name: string;
  type: 'file' | 'directory';
  path: string;
  extension: string; // If directory, use empty string ''
  children?: FileTreeNode[];
}
```

### 3. `TerminalLine`
```typescript
export interface TerminalLine {
  text: string;
  type: 'command' | 'output' | 'error';
  lineNumber?: number;
}
```

### 4. `OutputLine`
(Already defined in `AuthTerminalOutput.tsx`):
```typescript
import { SyntaxRole } from '../atoms';

export interface OutputLine {
  text: string;
  role?: SyntaxRole;
}
```

---

## 📂 Files to Generate

Please provide complete, production-ready code blocks for the following files:

### 1. Static Mock Data Layer (`/src/data/`)
* `/src/data/mockLessons.ts`
  - Export `MOCK_LESSONS` of type `LessonData[]`. Provide at least 8 lesson items across 2 modules ("Shell Basics" and "File Operations") featuring complete, inProgress, and locked states.
* `/src/data/mockFileTree.ts`
  - Export `MOCK_FILE_TREE` tree nodes of type `FileTreeNode[]` (nesting depth 3 levels deep from root `/home/student` -> `projects` -> `hello.sh`).
* `/src/data/mockTerminalLines.ts`
  - Export `MOCK_TERMINAL_LINES` of type `TerminalLine[]`. Mix of command, output, and error lines.
* `/src/data/mockAuth.ts`
  - Export `MOCK_AUTH_TERMINAL_OUTPUT` of type `OutputLine[]` simulating boot log lines.
* `/src/data/index.ts`
  - Barrel export for all mock data modules.

### 2. SplashScreen (`/src/screens/SplashScreen.tsx`)
* `/src/screens/SplashScreen.tsx`
  - Wrapper: `AppBackground` + `ScanlineOverlay` + `<SafeAreaView>` + centered content wrapper.
  - Layout Zones:
    1. **Center Brand:** `ShellXBrandMark` (large) with `animated={true}`.
    2. **Boot Progress:** Column of 4–6 monospace lines simulating boot log progress (e.g., `"[  OK  ] Started kernel..."`). Use `SyntaxText` with success green coloring for `[  OK  ]` tag.
    3. **Loading Progress Bar:** `ProgressTrack` (width: 180dp) centered with ASCII percentage output `"72%"` below it.
    4. **Footer:** `LabelCapsText` `"SHELLX v1.0.0"` in `Theme.colors.text.tertiary` at bottom of screen.
  - Static State: `const [progress] = useState(0.72)`.

### 3. AuthScreen (`/src/screens/AuthScreen.tsx`)
* `/src/screens/AuthScreen.tsx`
  - Wrapper: `AppBackground` + `DottedGridOverlay` + absolute centered radial atmospheric blue glow blob (`Theme.colors.primary.glow`) placed behind card + `KeyboardAvoidingView` + `ScrollView`.
  - Layout Zones:
    1. **Auth Card:** `AuthTerminalWindow` container containing `AuthTerminalHeader` (`"auth_session.sh"`), `AuthBrandPanel`, `Divider`, `GoogleSignInButton` (disabled={false}), and `AuthTerminalOutput` (rendered with `MOCK_AUTH_TERMINAL_OUTPUT`).
    2. **Footer Text:** Below the auth card, render `"Secure isolated sandbox environment"` using `MonoText` in `Theme.colors.text.tertiary` size `Theme.fontSize.labelXS`.
