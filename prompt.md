# Coder AI Prompt — Remaining Phase 1.3 Part 1 Components

Please generate the complete, production-ready code blocks for the remaining **16 files** of Phase 1.3 (Sub-Phases 1.3.A, 1.3.B, and 1.3.C) that were not covered in the corrections.

All files must follow the strict design guidelines:
- **OLED True Dark:** Backgrounds must be pure `#000000` (e.g., `Theme.colors.background.floor`).
- **No Elevation or Shadows:** Use `...Theme.noShadow`.
- **Typographic & Layout Integrity:** Use standard token values from `Theme` in `../../tokens`.
- **TypeScript Type Safety:** Export all component props interfaces and use `StyleProp<ViewStyle>` or `StyleProp<TextStyle>` where applicable.

---

### ⚠️ IMPORTANT: STRICT RULE ON EXTERNAL CONTEXT
You do not have direct access to our local files. **DO NOT guess, assume, or hallucinate the contents, exports, or types of any existing project files.**
* If you need to see the exact implementation of any existing file (such as a token definition, a custom text atom, or an icon component) to write your code correctly, **you must explicitly stop and ask the user to provide that file.**
* Do not make assumptions about sibling files or dependency structures.

As context, we already have standard typography, spacing, layout, border, and design tokens exported from `Theme` in `../../tokens`, and atoms (like `SafeText`, `MonoText`, `LabelCapsText`, `HeadlineText`, `BodyText`, `TerminalText`, `SyntaxText`, `StatusDot`, `TrafficLightDots`, `StatusIndicatorBadge`, `ConnectionBadge`, `LessonStateBadge`, `PrimaryActionButton`, `SecondaryActionButton`, `IconButton`, `NavButton`, `TerminalKeyButton`, `TerminalTextInput`, `IconTextInput`, `ConfigInputField`, `MaterialIcon`, `TerminalIcon`, `FolderIcon`, `FileTypeIcon`, `Surface`, `BorderedSurface`, `TerminalPanel`, `SectionHeader`, `Divider`, `ProgressTrack`) in `../../atoms`.

---

## 📂 Files to Generate

Please provide complete, production-ready code blocks for the following files:

### 1. App Shell Components (`/src/components/shell/`)
* `/src/components/shell/TrueDarkCanvas.tsx`
  - Wrapper: React Native `<View>` with `flex: 1`. Background: `Theme.colors.background.floor` (`#000000`). No shadow.
* `/src/components/shell/AppBackground.tsx`
  - Wrapper: `TrueDarkCanvas` + React Native `<StatusBar>` set to `barStyle: 'light-content'`, `backgroundColor: '#000000'`, `translucent: true`.
* `/src/components/shell/AppHeader.tsx`
  - Wrapper: `<View>` row + optional left slot + title center + optional right slot.
  - Height: `Theme.layout.topAppBarHeight` (56dp). Applies `paddingTop: Theme.layout.statusBarHeight` correctly. Pure black background, 1px bottom border (`Theme.colors.border.subtle`). Title uses `HeadlineText` (size `Theme.fontSize.titleMD`, weight semi-bold).
* `/src/components/shell/ShellXBrandMark.tsx`
  - Wrapper: `<View>` column + `MonoText` (the `$_` symbol) + `Animated.View` (blinking cursor block).
  - Loop animation toggling cursor block opacity (0 to 1) on a 500ms sequence loop when `animated={true}`.
* `/src/components/shell/ShellXLogoText.tsx`
  - Wrapper: `<View>` row. Renders `"Shell"` in `Theme.colors.text.primary` and `"X"` in `Theme.colors.primary.default`.
* `/src/components/shell/index.ts`
  - Barrel export file for: `TrueDarkCanvas`, `AppBackground`, `ScanlineOverlay`, `DottedGridOverlay`, `AppHeader`, `ShellXBrandMark`, `ShellXLogoText`.

### 2. Navigation Components (`/src/components/navigation/`)
* `/src/components/navigation/BottomTabBar.tsx`
  - Wrapper: React Native `<View>` + `<SafeAreaView>` (bottom safe area) + array of `NavButton`.
  - Height: `Theme.layout.bottomNavHeight` (56dp) + bottom safe area inset. Background: `#000000`. 1px top border.
* `/src/components/navigation/BottomTabItem.tsx`
  - Wrapper: `NavButton` + active top indicator bar (16dp wide x 2dp height top bar using `Theme.colors.primary.default`).
* `/src/components/navigation/DesktopSideNav.tsx`
  - Persistent side navigation panel for tablets. Width: `Theme.layout.sideNavWidth` (256dp).
* `/src/components/navigation/SideNavProfileHeader.tsx`
  - Profile header inside side nav (avatar, name, email).
* `/src/components/navigation/FocusedHeader.tsx`
  - Variant of `AppHeader` featuring a back navigation chevron (`IconButton`).
* `/src/components/navigation/index.ts`
  - Barrel export file for: `BottomTabBar`, `BottomTabItem`, `DesktopSideNav`, `SideNavProfileHeader`, `SideNavItem`, `FocusedHeader`.

### 3. Auth Components (`/src/components/auth/`)
* `/src/components/auth/AuthTerminalWindow.tsx`
  - Wrapper: `BorderedSurface` + `AuthTerminalHeader` + content. Simulates OS terminal frame. Border radius: `Theme.borderRadius.xl` (12dp).
* `/src/components/auth/AuthTerminalHeader.tsx`
  - Title bar inside auth card showing decorative traffic light dots on the left and a filename (e.g., `"auth_session.sh"`) centered.
* `/src/components/auth/AuthBrandPanel.tsx`
  - Branding zone inside auth window. Displays `ShellXBrandMark` (large) and tagline.
* `/src/components/auth/index.ts`
  - Barrel export file for: `AuthTerminalWindow`, `AuthTerminalHeader`, `AuthBrandPanel`, `GoogleSignInButton`, `AuthTerminalOutput`.
