# Coder AI Prompt — Phase 1.3: Part 2 (Terminal & Lessons Components)

Please implement the components for **Phase 1.3: Modular App Shell & Navigation Scaffolding** (specifically Sub-Phases 1.3.D and 1.3.E).

All files must follow the strict design guidelines:
- **OLED True Dark:** Backgrounds must be pure `#000000` (e.g., `Theme.colors.background.floor`).
- **No Elevation or Shadows:** Use `...Theme.noShadow`.
- **Typographic & Layout Integrity:** Use standard token values from `Theme` in `../../tokens`.
- **TypeScript Type Safety:** Export all component props interfaces and use `StyleProp<ViewStyle>` or `StyleProp<TextStyle>` where applicable.
- **Accessibility:** Ensure all interactive elements (`TouchableOpacity`, `TextInput`) have `accessibilityLabel` and `accessibilityRole` defined, and all decorative elements have `accessible={false}` and `importantForAccessibility="no-hide-descendants"`.

---

### ⚠️ IMPORTANT: STRICT RULE ON EXTERNAL CONTEXT
You do not have direct access to our local files. **DO NOT guess, assume, or hallucinate the contents, exports, or types of any existing project files.**
* If you need to see the exact implementation of any existing file (such as a token definition, a custom text atom, or a shell component) to write your code correctly, **you must explicitly stop and ask the user to provide that file.**
* Do not make assumptions about sibling files or dependency structures.

As context, we already have:
* Standard typography, spacing, layout, border, and design tokens exported from `Theme` in `../../tokens`.
* Atoms (like `SafeText`, `MonoText`, `LabelCapsText`, `HeadlineText`, `BodyText`, `TerminalText`, `SyntaxText`, `StatusDot`, `TrafficLightDots`, `StatusIndicatorBadge`, `ConnectionBadge`, `LessonStateBadge`, `PrimaryActionButton`, `SecondaryActionButton`, `IconButton`, `NavButton`, `TerminalKeyButton`, `TerminalTextInput`, `IconTextInput`, `ConfigInputField`, `MaterialIcon`, `TerminalIcon`, `FolderIcon`, `FileTypeIcon`, `Surface`, `BorderedSurface`, `TerminalPanel`, `SectionHeader`, `Divider`, `ProgressTrack`) in `../../atoms`.
* Shell and Auth components (like `TrueDarkCanvas`, `AppBackground`, `ScanlineOverlay`, `DottedGridOverlay`, `AppHeader`, `ShellXBrandMark`, `ShellXLogoText`, `AuthTerminalWindow`, `AuthTerminalHeader`, `AuthBrandPanel`, `GoogleSignInButton`, `AuthTerminalOutput`) in `../shell/` and `../auth/`.

---

## 📂 Files to Generate

Please provide complete, production-ready code blocks for the following files:

### 1. Terminal Workspace Components (`/src/components/terminal/`)
* `/src/components/terminal/TerminalWorkspace.tsx`
  - Wrapper: `<View>` column (`flex: 1`) + `TopMetricsBar` + `TerminalEditor` + `VimStatusStrip` + `DeveloperKeyboardBar`.
  - Master container for the terminal editor workspace.
* `/src/components/terminal/TopMetricsBar.tsx`
  - Wrapper: `<View>` row. Height: 40dp (`Theme.layout.topMetricsBarHeight`). Displays filepath (left) and `ConnectionBadge` (right). Background: `Theme.colors.background.elevated`.
* `/src/components/terminal/TerminalEditor.tsx`
  - Wrapper: React Native `<ScrollView>` (vertical) + array of `TerminalCodeLine` + `TerminalPromptLine`.
  - Handles scrolling to bottom on input changes.
* `/src/components/terminal/TerminalCodeLine.tsx`
  - Wrapper: `<View>` row + optional line number + text content. Custom coloring based on type (`command` uses prompt prefix `$`, `error` uses red text, etc.).
* `/src/components/terminal/TerminalPromptLine.tsx`
  - Wrapper: `<View>` row + prompt prefix `MonoText` (`$ `) + `TerminalTextInput` + `TerminalCursor`.
* `/src/components/terminal/TerminalCursor.tsx`
  - Wrapper: `Animated.View`. Loop animation toggling block cursor opacity (0 to 1) on a 500ms loop. Width: 8dp, Height: 18dp.
* `/src/components/terminal/TerminalSyntaxText.tsx`
  - Wrapper: React Native `<Text>` with nested `SyntaxText` spans to allow inline syntax highlighting.
  - Accepts a token array: `tokens: Array<{ text: string; role: SyntaxRole }>` and renders nested elements.
* `/src/components/terminal/VimStatusStrip.tsx`
  - Status bar showing vim mode (NORMAL/INSERT/VISUAL), filename, and cursor position. Height: 32dp (`Theme.layout.vimStatusStripHeight`).
* `/src/components/terminal/DeveloperKeyboardBar.tsx`
  - Wrapper: `<View>` column + `KeyboardDivider` + `DeveloperKeyboardRow`. Height: 56dp (`Theme.layout.developerKeyboardBarHeight`). Sitting inside a `KeyboardAvoidingView` parent in screens.
* `/src/components/terminal/DeveloperKeyboardRow.tsx`
  - Wrapper: `<ScrollView>` horizontal + list of `TerminalKeyButton` components.
  - Keys: `['ESC', 'TAB', 'CTRL', 'ALT', '|', '/', '\\', '-', '~', 'UP', 'DOWN', 'LEFT', 'RIGHT']`.
* `/src/components/terminal/KeyboardDivider.tsx`
  - 1px divider separation line.
* `/src/components/terminal/LessonContextHeader.tsx`
  - Header block above editor showing current lesson title and progress bar (`ProgressTrack`).
* `/src/components/terminal/TaskBottomSheet.tsx`
  - Wrapper: `Animated.View` + `TaskSheetHeader` + content + `TaskSheetActions`. Slides up from the bottom of workspace (height up to 60% of screen).
* `/src/components/terminal/TaskSheetHeader.tsx`
  - Drag handle + title + close `IconButton` (back navigation style).
* `/src/components/terminal/TaskSheetActions.tsx`
  - Outlined and filled buttons for checking tasks and toggling hints.
* `/src/components/terminal/index.ts`
  - Barrel export for all terminal components.

### 2. Lessons Components (`/src/components/lessons/`)
* `/src/components/lessons/LessonsHeader.tsx`
  - Section showing lesson module statistics and summary stats.
* `/src/components/lessons/LessonModuleSection.tsx`
  - Section listing module header and lesson card grid.
* `/src/components/lessons/LessonCardGrid.tsx`
  - FlatList (or View wrapping cards) to display lessons in a 2-column layout.
* `/src/components/lessons/LessonCard.tsx`
  - Touchable lesson block displaying state (complete, in-progress, locked) using correct semantic borders.
* `/src/components/lessons/LessonCardHeader.tsx`
  - Title and state icon wrapper.
* `/src/components/lessons/LessonStatusIcon.tsx`
  - Resolves correct MaterialIcon for each state (`complete` -> `check_circle`, `inProgress` -> `radio_button_checked`, `locked` -> `lock`).
* `/src/components/lessons/LessonProgressMeta.tsx`
  - Badge stats: command count and estimated time.
* `/src/components/lessons/LessonProgressBar.tsx`
  - Wrapper for `ProgressTrack` styled with state-specific progress color.
* `/src/components/lessons/AsciiProgressText.tsx`
  - Simulated ASCII text progress bar row (e.g. `[████░░░░] 50%`) using `MonoText`.
* `/src/components/lessons/index.ts`
  - Barrel export for all lessons components.
