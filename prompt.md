# Coder AI Prompt — Phase 1.3: Part 3 (FileSystem & Settings Components, plus Barrel Update)

Please implement the final set of components for **Phase 1.3: Modular App Shell & Navigation Scaffolding** (specifically Sub-Phases 1.3.F, 1.3.G, and 1.3.H).

All files must follow the strict design guidelines:
- **OLED True Dark:** Backgrounds must be pure `#000000` (e.g., `Theme.colors.background.floor`).
- **No Elevation or Shadows:** Use `...Theme.noShadow`.
- **Typographic & Layout Integrity:** Use standard token values from `Theme` in `../../tokens`.
- **TypeScript Type Safety:** Export all component props interfaces and use `StyleProp<ViewStyle>` or `StyleProp<TextStyle>` where applicable.
- **Accessibility:** Ensure all interactive elements (`TouchableOpacity`, `TextInput`) have `accessibilityLabel` and `accessibilityRole` defined, and all decorative elements have `accessible={false}` and `importantForAccessibility="no-hide-descendants"`.

---

### ⚠️ IMPORTANT: STRICT RULE ON EXTERNAL CONTEXT
You do not have direct access to our local files. **DO NOT guess, assume, or hallucinate the contents, exports, or types of any existing project files.**
* If you need to see the exact implementation of any existing file (such as a token definition, a custom text atom, or another component) to write your code correctly, **you must explicitly stop and ask the user to provide that file.**
* Do not make assumptions about sibling files or dependency structures.

As context, we already have:
* Standard typography, spacing, layout, border, and design tokens exported from `Theme` in `../../tokens`.
* Atoms (like `SafeText`, `MonoText`, `LabelCapsText`, `HeadlineText`, `BodyText`, `TerminalText`, `SyntaxText`, `StatusDot`, `TrafficLightDots`, `StatusIndicatorBadge`, `ConnectionBadge`, `LessonStateBadge`, `PrimaryActionButton`, `SecondaryActionButton`, `IconButton`, `NavButton`, `TerminalKeyButton`, `TerminalTextInput`, `IconTextInput`, `ConfigInputField`, `MaterialIcon`, `TerminalIcon`, `FolderIcon`, `FileTypeIcon`, `Surface`, `BorderedSurface`, `TerminalPanel`, `SectionHeader`, `Divider`, `ProgressTrack`) in `../../atoms`.
* Barrel components in `../../components/shell/`, `../../components/navigation/`, and `../../components/auth/`.

---

## 📂 Files to Generate

Please provide complete, production-ready code blocks for the following files:

### 1. FileSystem Components (`/src/components/filesystem/`)
* `/src/components/filesystem/FileSystemTree.tsx`
  - Wrapper: `<ScrollView>` vertical + `<ScrollView>` horizontal (inner) + array of `FileTreeBranch`.
  - Double scrolling structure to accommodate deep tree hierarchies.
* `/src/components/filesystem/FileTreeBranch.tsx`
  - Wrapper: `<View>` column + `FolderRow` + conditionally rendered children (recursively rendering folders/files).
* `/src/components/filesystem/FileTreeRow.tsx`
  - Wrapper: `<TouchableOpacity>` row. Min height: 44dp (`Theme.layout.minTouchTarget`). Uses left padding: `depth * Theme.spacing.md` to show nesting hierarchy.
* `/src/components/filesystem/FolderRow.tsx`
  - Wrapper: `FileTreeRow` + `FolderIcon` + `MonoText` filename.
* `/src/components/filesystem/FileRow.tsx`
  - Wrapper: `FileTreeRow` + `FileTypeIcon` + `MonoText` filename.
* `/src/components/filesystem/SelectedFileRow.tsx`
  - Wrapper: Sibling of `FileRow` with forced active styling (e.g. `Theme.colors.primary.muted` background or active border).
* `/src/components/filesystem/TreeIndentGuide.tsx`
  - Wrapper: `<View>` (1dp vertical guide line) placed at the exact indentation margin representing depth structure.
* `/src/components/filesystem/index.ts`
  - Barrel export for all FileSystem components.

### 2. Settings Components (`/src/components/settings/`)
* `/src/components/settings/ProfileAvatarBlock.tsx`
  - Wrapper: `<View>` column + `<Image>` (avatar) + `HeadlineText` (name) + `BodyText` (email).
  - Avatar image size: 72dp (`Theme.layout.profileAvatarSizeLG`) with full border radius and standard border.
* `/src/components/settings/SettingsConfigCard.tsx`
  - Wrapper: `BorderedSurface` + `SectionHeader` + child content. Standard container card for settings configs.
* `/src/components/settings/ServerConfigInput.tsx`
  - Wrapper: `<View>` column + `ConfigInputField` (IP address) + `ConfigInputField` (Port number).
  - Keyboard Types: IP address text field uses `keyboardType='numeric'`, and Port field uses `keyboardType='number-pad'`.
* `/src/components/settings/SaveConfigurationButton.tsx`
  - Wrapper: `PrimaryActionButton`. Custom save label with Vim save command aesthetic (`":w"`) or standard uppercase command `"SAVE CONFIGURATION"`.
* `/src/components/settings/ServerStatusSignal.tsx`
  - Wrapper: `<View>` row + `StatusDot` + `MonoText` (ping/latency info) + test button.
  - Active button has a minimum 44dp touch target.
* `/src/components/settings/index.ts`
  - Barrel export for all settings components.

### 3. Unified Components Barrel Update (`/src/components/index.ts`)
* `/src/components/index.ts`
  - Export all component domains:
    ```typescript
    export * from './shell';
    export * from './navigation';
    export * from './auth';
    export * from './terminal';
    export * from './lessons';
    export * from './filesystem';
    export * from './settings';
    ```
