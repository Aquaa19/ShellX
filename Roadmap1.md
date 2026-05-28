# ShellX — Roadmap 1: Initial Static Project Roadmap
## Masterclass-Tier Production Build Plan
### Target: Android CUI Linux Student Learning App (React Native CLI + TypeScript)

---

> **Document Authority:** This file is the singular, uncompromised source of truth for the Antigravity static verification system and the coder AI agent. Every checkbox below represents one discrete, mandatory, atomic build action. No file may be created without a corresponding checked box. No checkbox may be skipped. Build order is strictly chronological within each phase.

---

## ⚙️ Suggested Build Order (Macro)

```
Phase 1.1 → Phase 1.2 → Phase 1.3 → Phase 1.4 → Verification Pass
   ↓              ↓            ↓             ↓
Tokens &       Atoms &      Shells &      Screens &
Theme          Units        Nav           State Stubs
```

> **Rule:** Never import from a phase not yet completed. Atoms import only from `tokens/`. Components import from `atoms/` and `tokens/`. Screens import from `components/`, `atoms/`, and `tokens/`. No cross-screen imports.

---

## 🔖 Legend

| Symbol | Meaning |
|--------|---------|
| `[ ]` | Not started |
| `[x]` | Completed |
| `⚡` | Critical path item — blocking downstream files |
| `🔒` | Do not modify after initial creation without full phase re-verification |
| `📐` | Must pass 44×44dp touch target check |
| `📱` | Must be tested on 5-inch 720×1280 low-end device profile |
| `⌨️` | Must account for soft keyboard layout shift (KeyboardAvoidingView) |
| `🌑` | Must render pure #000000 background — no off-black substitution |

---

---

# PHASE 1.1 — Design Tokens & Styling Scaffolding

> **Goal:** Establish the complete, immutable design system foundation. Every color, spacing unit, typography rule, layout constant, and border definition must originate exclusively from these token files. No hardcoded values are permitted in any downstream file.

---

## Sub-Phase 1.1.A — Directory Bootstrap & TypeScript Configuration

- [ ] ⚡ 🔒 Create `/src/tokens/` directory entry file `index.ts`
  - **Structure:** Single barrel re-export file. Re-exports all named exports from `colors.ts`, `typography.ts`, `spacing.ts`, `layout.ts`, `borders.ts`, `shadows.ts`, `zIndex.ts`.
  - **Code Layout:**
    ```typescript
    export * from './colors';
    export * from './typography';
    export * from './spacing';
    export * from './layout';
    export * from './borders';
    export * from './shadows';
    export * from './zIndex';
    ```
  - **Constraint:** This file must never contain any logic, only re-exports.

- [ ] ⚡ 🔒 Create `/src/atoms/` directory entry file `index.ts`
  - **Structure:** Barrel re-export for all atom modules. Initially empty stubs; populated in Phase 1.2.
  - **Constraint:** Must compile without error at Phase 1.1 completion even if downstream files are empty.

- [ ] ⚡ 🔒 Create `/src/components/` directory entry file `index.ts`
  - **Structure:** Barrel re-export for all component modules. Initially empty stubs; populated in Phase 1.3.

- [ ] ⚡ 🔒 Create `/src/screens/` directory entry file `index.ts`
  - **Structure:** Barrel re-export for all screen modules. Initially empty stubs; populated in Phase 1.4.

---

## Sub-Phase 1.1.B — Color System Tokens

- [ ] ⚡ 🔒 🌑 Create `/src/tokens/colors.ts`
  - **Structure:** A single exported `const Colors` object. Organized into semantic groups as nested objects. Must use `as const` assertion for full TypeScript literal type inference.
  - **Required Top-Level Groups:** `background`, `surface`, `border`, `primary`, `semantic`, `syntax`, `text`, `overlay`.
  - **Complete Token Definitions:**
    ```typescript
    export const Colors = {
      background: {
        floor:    '#000000', // Level 0 — primary screen bg, true OLED black
        elevated: '#0D0D0D', // Level 1 — card/container bg
        overlay:  '#050505', // Modal/sheet underlays
        input:    '#000000', // Terminal input fields — never lifted
      },
      surface: {
        default:  '#0D0D0D', // Standard card surface
        raised:   '#111111', // Slightly elevated panels
        sunken:   '#000000', // Inset/recessed areas
        active:   '#141414', // Pressed/focused surface state
      },
      border: {
        subtle:   '#1F2937', // Primary structural 1px borders (default)
        default:  '#1F2937', // Alias — standard element boundary
        strong:   '#374151', // Emphasized dividers and separators
        focus:    '#3B82F6', // Active/focused input ring
        error:    '#EF4444', // Error-state borders
        success:  '#4FDF94', // Success-state borders
      },
      primary: {
        default:  '#3B82F6', // Primary action blue — buttons, accents
        dim:      '#1D4ED8', // Dimmed/pressed primary
        glow:     'rgba(59, 130, 246, 0.12)', // Atmospheric glow fill
        muted:    'rgba(59, 130, 246, 0.20)', // Badge/chip fills
      },
      semantic: {
        success:   '#4FDF94', // Progress OK states
        successDim:'rgba(79, 223, 148, 0.15)',
        warning:   '#F59E0B', // Booting/warning states
        warningDim:'rgba(245, 158, 11, 0.15)',
        error:     '#EF4444', // Error/offline states
        errorDim:  'rgba(239, 68, 68, 0.15)',
        info:      '#3B82F6', // Informational states
      },
      syntax: {
        blue:   '#ADC6FF', // Keywords, types
        green:  '#6FFBBE', // Strings, success output
        orange: '#FFDDB8', // Variables, parameters
        red:    '#FF8A80', // Errors, deletion markers
        purple: '#D0B0FF', // Built-ins, special keywords
        gray:   '#6B7280', // Comments
        white:  '#E5E7EB', // Default terminal output text
      },
      text: {
        primary:    '#F9FAFB', // Primary readable text
        secondary:  '#9CA3AF', // Secondary/muted labels
        tertiary:   '#6B7280', // Disabled/placeholder text
        inverse:    '#000000', // Text on light surfaces
        accent:     '#3B82F6', // Linked/highlighted inline text
        code:       '#E5E7EB', // Code and terminal output
        placeholder:'#4B5563', // Input placeholder color
      },
      trafficLights: {
        red:    '#FF5F57', // Close/error
        yellow: '#FEBC2E', // Warning/minimize
        green:  '#28C840', // Success/maximize
      },
      overlay: {
        scrim:    'rgba(0, 0, 0, 0.72)', // Modal background scrims
        scanline: 'rgba(0, 0, 0, 0.04)', // CRT scanline stripe tint
        glow:     'rgba(59, 130, 246, 0.06)', // Auth screen ambient glow
      },
    } as const;

    export type ColorToken = typeof Colors;
    ```
  - **Constraints:** Zero hardcoded colors anywhere in the codebase except this file. `#000000` must never be approximated with `#010101` or `#0a0a0a` unless in a named token.

---

## Sub-Phase 1.1.C — Typography System Tokens

- [ ] ⚡ 🔒 Create `/src/tokens/typography.ts`
  - **Structure:** Exported `FontFamily`, `FontSize`, `FontWeight`, `LineHeight`, `LetterSpacing` constants. All React Native `TextStyle` fragments composed here for downstream atom consumption.
  - **Complete Token Definitions:**
    ```typescript
    import { Platform } from 'react-native';

    export const FontFamily = {
      // UI Sans — Inter family
      sans: Platform.select({
        android: 'Inter-Regular',
        ios:     'Inter-Regular',
        default: 'Inter-Regular',
      }),
      sansMedium: Platform.select({
        android: 'Inter-Medium',
        default: 'Inter-Medium',
      }),
      sansSemiBold: Platform.select({
        android: 'Inter-SemiBold',
        default: 'Inter-SemiBold',
      }),
      sansBold: Platform.select({
        android: 'Inter-Bold',
        default: 'Inter-Bold',
      }),
      // Code Mono — JetBrains Mono family
      mono: Platform.select({
        android: 'JetBrainsMono-Regular',
        default: 'JetBrainsMono-Regular',
      }),
      monoMedium: Platform.select({
        android: 'JetBrainsMono-Medium',
        default: 'JetBrainsMono-Medium',
      }),
      monoBold: Platform.select({
        android: 'JetBrainsMono-Bold',
        default: 'JetBrainsMono-Bold',
      }),
    } as const;

    // Pixel sizes (dp on Android = px in RN StyleSheet)
    export const FontSize = {
      // UI Scale
      headlineLG:  30, // Max mobile headline
      headlineMD:  24,
      headlineSM:  20,
      titleLG:     18,
      titleMD:     16,
      titleSM:     15,
      bodyLG:      16,
      bodyMD:      15,
      bodySM:      14,
      labelLG:     13,
      labelMD:     12,
      labelSM:     11,
      labelXS:     10, // Compact metadata
      // Code Scale
      codeBase:    14, // Terminal editor base
      codeSM:      13,
      codeXS:      12,
    } as const;

    export const FontWeight = {
      regular:  '400' as const,
      medium:   '500' as const,
      semiBold: '600' as const,
      bold:     '700' as const,
    } as const;

    export const LineHeight = {
      // UI line heights (multiply factor × fontSize)
      tight:   1.2,
      normal:  1.4,
      relaxed: 1.6,
      // Absolute terminal line heights
      terminal: 22, // Fixed 22dp for terminal text rows — critical for mono grid
      terminalSM: 20,
      code:    22,
    } as const;

    export const LetterSpacing = {
      tighter: -0.5,
      tight:   -0.25,
      normal:   0,
      wide:     0.5,
      wider:    1.0,
      caps:     1.5,   // Uppercase technical labels
      ultraCaps:2.0,
    } as const;
    ```
  - **Constraints:** `FontSize.headlineLG` must never exceed 30. `FontSize.codeBase` is fixed at 14. No `fontSize` values outside this scale allowed downstream.

---

## Sub-Phase 1.1.D — Spacing & Layout Tokens

- [ ] ⚡ 🔒 Create `/src/tokens/spacing.ts`
  - **Structure:** Exported `Spacing` object. Strict 4dp increment scale. All spacing values (margin, padding, gap) downstream must resolve to this scale.
  - **Complete Token Definitions:**
    ```typescript
    export const Spacing = {
      px:   1,   // 1dp — thin separator lines only
      xxs:  2,   // 2dp
      xs:   4,   // 4dp — minimum meaningful padding
      sm:   8,   // 8dp
      md:  16,   // 16dp — standard component padding
      lg:  24,   // 24dp
      xl:  32,   // 32dp
      xxl: 40,   // 40dp
      xxxl:48,   // 48dp
      huge: 64,  // 64dp
    } as const;

    export type SpacingToken = keyof typeof Spacing;
    ```
  - **Constraint:** No arbitrary numeric margin/padding values in any downstream file. Every spacing value must map to a `Spacing.*` token.

- [ ] ⚡ 🔒 Create `/src/tokens/layout.ts`
  - **Structure:** Exported `Layout` constants for all fixed structural heights, widths, and dimensional rules used across the layout system.
  - **Complete Token Definitions:**
    ```typescript
    import { Dimensions, Platform, StatusBar } from 'react-native';

    const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

    export const Layout = {
      // Screen dimensions (dynamic — re-evaluate on orientation if needed)
      screenWidth:  SCREEN_WIDTH,
      screenHeight: SCREEN_HEIGHT,

      // App chrome heights
      topAppBarHeight:            56, // Standard compact header
      topAppBarHeightExpanded:    64, // Expanded/prominent header
      bottomNavHeight:            56, // Bottom tab navigation bar
      bottomNavHeightSafe:        64, // With extra safe area padding

      // Terminal-specific heights
      developerKeyboardBarHeight: 56, // Dev key row above soft keyboard
      vimStatusStripHeight:       32, // Vim mode/status strip at terminal bottom
      topMetricsBarHeight:        40, // Top metrics row in workspace
      taskBottomSheetPeek:        80, // Collapsed task sheet peek height
      taskBottomSheetExpanded:    0,  // Calculated: screenHeight * 0.6

      // Atomic dimensions
      progressBarHeight:          4,
      terminalCursorWidth:        8,
      terminalCursorHeight:       18, // Matches terminal line-height
      trafficLightDotSize:        12,
      trafficLightDotSpacing:     8,
      statusDotSize:              8,
      connectionBadgeHeight:      20,
      dividerThickness:           1,  // All dividers: 1px solid, no shadow
      focusRingWidth:             1,  // Input focused border width

      // Touch targets (Android Material minimum)
      minTouchTarget:             44, // 44×44dp minimum — NEVER go below this
      comfortTouchTarget:         48, // Comfortable touch target

      // Card and container dimensions
      lessonCardMinHeight:        100,
      settingsRowHeight:          56,
      profileAvatarSize:          56,
      profileAvatarSizeLG:        72,

      // Sidebar / side nav
      sideNavWidth:               256,
      sideNavItemHeight:          48,

      // Platform-aware status bar offset
      statusBarHeight: Platform.OS === 'android'
        ? (StatusBar.currentHeight ?? 24)
        : 0,
    } as const;

    export type LayoutToken = typeof Layout;
    ```
  - **Constraints:** `minTouchTarget: 44` is a hard constraint. Any interactive element that cannot accommodate 44dp must receive invisible padding to meet this minimum. `developerKeyboardBarHeight: 56` is fixed and must not be overridden.

---

## Sub-Phase 1.1.E — Border, Radius & Z-Index Tokens

- [ ] ⚡ 🔒 Create `/src/tokens/borders.ts`
  - **Structure:** Exported `BorderRadius` and `BorderWidth` constants. All `StyleSheet` border declarations downstream must use these values. No `elevation`, `shadowColor`, `shadowOffset`, `shadowOpacity`, or `shadowRadius` properties are permitted anywhere in the codebase — strict 1px border-only aesthetic.
  - **Complete Token Definitions:**
    ```typescript
    export const BorderRadius = {
      none:    0,
      sm:      2,  // Subtle rounding — key chips, tiny badges
      default: 4,  // Standard element rounding — inputs, buttons
      md:      4,  // Alias
      lg:      8,  // Cards, panels, larger containers
      xl:      12, // Bottom sheets, modals
      xxl:     16, // Large card rounding
      full:    9999, // Pills, status dots, circular elements
    } as const;

    export const BorderWidth = {
      none:    0,
      hairline:1, // Standard 1px structural border — the only border weight
      medium:  2, // Focus ring, active selection borders
    } as const;

    // RULE: NO elevation, NO box shadows anywhere in this project.
    // Depth and separation are achieved exclusively via:
    //   1. 1px solid borders using Colors.border.* tokens
    //   2. Background color contrast (surface vs floor)
    //   3. Opacity layering
    export const NoShadow = {
      elevation:     0,
      shadowColor:   'transparent',
      shadowOffset:  { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius:  0,
    } as const;
    ```

- [ ] ⚡ 🔒 Create `/src/tokens/shadows.ts`
  - **Structure:** Intentionally minimal. Exports a `Shadows` object containing only `none`. This file exists as an explicit design constraint reminder that all shadow properties must be zeroed out.
  - **Code Layout:**
    ```typescript
    // ShellX Design Constraint: TRUE DARK / OLED TERMINAL AESTHETIC
    // No shadows, no elevation, no blur effects.
    // Separation is achieved via 1px solid borders and background contrast only.
    export const Shadows = {
      none: {
        elevation:     0,
        shadowColor:   'transparent' as const,
        shadowOffset:  { width: 0, height: 0 } as const,
        shadowOpacity: 0 as const,
        shadowRadius:  0 as const,
      },
    } as const;
    ```

- [ ] ⚡ 🔒 Create `/src/tokens/zIndex.ts`
  - **Structure:** Z-index stacking context definitions for all layers. Must be used exclusively to manage overlapping elements.
  - **Complete Token Definitions:**
    ```typescript
    export const ZIndex = {
      floor:       0,
      base:        1,   // Standard content
      raised:     10,   // Cards, floating rows
      overlay:    20,   // Tooltip, mini-popover
      dropdown:   30,   // Dropdown menus
      sticky:     40,   // Sticky headers, vim status strip
      navigation: 50,   // Bottom tab bar, side nav
      modal:      60,   // Modal sheets, bottom sheets
      taskSheet:  70,   // Task overlay panel
      toast:      80,   // Toast notifications
      splash:    100,   // Splash screen — topmost
    } as const;

    export type ZIndexToken = keyof typeof ZIndex;
    ```

---

## Sub-Phase 1.1.F — Unified Theme Composer

- [ ] ⚡ 🔒 Create `/src/tokens/theme.ts`
  - **Structure:** Composes all token files into a single exported `Theme` object. Also exports a `ThemeType` TypeScript type for downstream prop typing. This is the single object consumers should import when they need the full design system.
  - **Code Layout:**
    ```typescript
    import { Colors }       from './colors';
    import { FontFamily, FontSize, FontWeight, LineHeight, LetterSpacing } from './typography';
    import { Spacing }      from './spacing';
    import { Layout }       from './layout';
    import { BorderRadius, BorderWidth, NoShadow } from './borders';
    import { Shadows }      from './shadows';
    import { ZIndex }       from './zIndex';

    export const Theme = {
      colors:       Colors,
      fontFamily:   FontFamily,
      fontSize:     FontSize,
      fontWeight:   FontWeight,
      lineHeight:   LineHeight,
      letterSpacing:LetterSpacing,
      spacing:      Spacing,
      layout:       Layout,
      borderRadius: BorderRadius,
      borderWidth:  BorderWidth,
      noShadow:     NoShadow,
      shadows:      Shadows,
      zIndex:       ZIndex,
    } as const;

    export type ThemeType = typeof Theme;
    ```
  - **Update** `/src/tokens/index.ts` to add `export * from './theme';`

---

---

# PHASE 1.2 — Low-Level Atomic Component Creation

> **Goal:** Build every primitive UI unit. These are the lowest-level building blocks — they have zero business logic, accept only display props, and are composable without side effects. Every atom must import exclusively from `/src/tokens/`.

---

## Sub-Phase 1.2.A — Text Atoms (`/src/atoms/text/`)

- [ ] ⚡ Create `/src/atoms/text/SafeText.tsx`
  - **Wrapper:** React Native `<Text>`
  - **Purpose:** Base text primitive. Enforces color inheritance prevention — always renders with an explicit color prop defaulting to `Colors.text.primary`. Prevents transparent text bugs on OLED.
  - **Props Interface:**
    ```typescript
    interface SafeTextProps {
      children: React.ReactNode;
      style?: TextStyle;
      color?: string;
      numberOfLines?: number;
      selectable?: boolean;
      testID?: string;
    }
    ```
  - **Styling Constraints:** `color` defaults to `Colors.text.primary`. `fontFamily` defaults to `FontFamily.sans`. Must spread `style` prop last to allow overrides.
  - **No shadow, no elevation.**

- [ ] ⚡ Create `/src/atoms/text/MonoText.tsx`
  - **Wrapper:** `SafeText` (composes, never raw `<Text>`)
  - **Purpose:** JetBrains Mono text primitive for all terminal, code, and CUI output text.
  - **Props Interface:**
    ```typescript
    interface MonoTextProps {
      children: React.ReactNode;
      size?: number;         // defaults to FontSize.codeBase (14)
      weight?: 'regular' | 'medium' | 'bold';
      color?: string;        // defaults to Colors.text.code
      lineHeight?: number;   // defaults to Layout.terminalLineHeight (22)
      style?: TextStyle;
    }
    ```
  - **Critical Styling:** `fontFamily: FontFamily.mono`, `fontSize: FontSize.codeBase`, `lineHeight: 22`, `color: Colors.text.code`. Must never use a sans-serif font.

- [ ] Create `/src/atoms/text/LabelCapsText.tsx`
  - **Wrapper:** `SafeText`
  - **Purpose:** Uppercase technical label text. Used for status indicators, section headers, metric labels.
  - **Props Interface:** `children`, `size?` (defaults `FontSize.labelSM`), `color?`, `style?`
  - **Styling Constraints:** `textTransform: 'uppercase'`, `letterSpacing: LetterSpacing.caps` (1.5), `fontFamily: FontFamily.sansSemiBold`, `fontSize: FontSize.labelSM`.

- [ ] Create `/src/atoms/text/HeadlineText.tsx`
  - **Wrapper:** `SafeText`
  - **Purpose:** Top-level display and section headline text.
  - **Props Interface:** `children`, `size?` (defaults `FontSize.headlineSM`), `weight?` (defaults `'bold'`), `color?`, `style?`
  - **Styling Constraints:** `fontFamily: FontFamily.sansBold`, max `fontSize` must never exceed `FontSize.headlineLG` (30). Use `adjustsFontSizeToFit` with `minimumFontScale={0.8}` for narrow screens.

- [ ] Create `/src/atoms/text/BodyText.tsx`
  - **Wrapper:** `SafeText`
  - **Purpose:** Standard paragraph and UI body text.
  - **Props Interface:** `children`, `size?` (defaults `FontSize.bodySM`), `weight?`, `color?`, `style?`
  - **Styling Constraints:** `fontFamily: FontFamily.sans`, `lineHeight` = `fontSize * LineHeight.normal`.

- [ ] Create `/src/atoms/text/TerminalText.tsx`
  - **Wrapper:** `MonoText`
  - **Purpose:** Standard terminal output line text. Renders shell output, file paths, command history.
  - **Props Interface:** `children`, `color?` (defaults `Colors.text.code`), `dimmed?: boolean` (applies `Colors.text.secondary`), `style?`
  - **Styling Constraints:** Must inherit all `MonoText` constraints. `selectable={true}` by default.

- [ ] Create `/src/atoms/text/SyntaxText.tsx`
  - **Wrapper:** `MonoText`
  - **Purpose:** Syntax-highlighted code fragments. Accepts a `syntaxRole` prop to apply the correct color token.
  - **Props Interface:**
    ```typescript
    type SyntaxRole = 'keyword' | 'string' | 'variable' | 'comment' | 'error' | 'builtin' | 'default';
    interface SyntaxTextProps {
      children: React.ReactNode;
      role: SyntaxRole;
      style?: TextStyle;
    }
    ```
  - **Color Map:** `keyword → Colors.syntax.blue`, `string → Colors.syntax.green`, `variable → Colors.syntax.orange`, `comment → Colors.syntax.gray`, `error → Colors.syntax.red`, `builtin → Colors.syntax.purple`, `default → Colors.syntax.white`.

- [ ] Create `/src/atoms/text/index.ts`
  - **Structure:** Barrel re-export of all text atoms.
  - **Exports:** `SafeText`, `MonoText`, `LabelCapsText`, `HeadlineText`, `BodyText`, `TerminalText`, `SyntaxText`.

---

## Sub-Phase 1.2.B — Badge & Indicator Atoms (`/src/atoms/badges/`)

- [ ] 📐 Create `/src/atoms/badges/StatusDot.tsx`
  - **Wrapper:** React Native `<View>`
  - **Purpose:** Single 8dp circular dot indicator for connection states and status signals.
  - **Props Interface:**
    ```typescript
    type DotVariant = 'success' | 'warning' | 'error' | 'inactive' | 'primary';
    interface StatusDotProps {
      variant: DotVariant;
      size?: number;   // defaults to Layout.statusDotSize (8)
      style?: ViewStyle;
    }
    ```
  - **Styling:** `width: size`, `height: size`, `borderRadius: BorderRadius.full`, `backgroundColor` resolved from variant → `Colors.semantic.*`. No border, no shadow. Min touch target wrapper: 44×44 invisible `<View>` if used as interactive element.

- [ ] 📐 Create `/src/atoms/badges/TrafficLightDots.tsx`
  - **Wrapper:** React Native `<View>` (horizontal `flexDirection: 'row'`)
  - **Purpose:** macOS-style red/yellow/green traffic light row for terminal window title bars.
  - **Props Interface:** `activeState?: 'none' | 'alert'`, `style?: ViewStyle`
  - **Styling:** Three `<View>` circles of size `Layout.trafficLightDotSize` (12dp). Colors: `Colors.trafficLights.red`, `.yellow`, `.green`. Gap between dots: `Layout.trafficLightDotSpacing` (8dp). `borderRadius: BorderRadius.full`. Static decorative element — non-interactive.

- [ ] 📐 Create `/src/atoms/badges/StatusIndicatorBadge.tsx`
  - **Wrapper:** `<View>` row with `<StatusDot>` + `<LabelCapsText>`
  - **Purpose:** Compound status badge with dot and text label. Used in metrics bars and settings panels.
  - **Props Interface:** `label: string`, `variant: DotVariant`, `style?: ViewStyle`
  - **Styling:** `flexDirection: 'row'`, `alignItems: 'center'`, gap `Spacing.xs` (4dp). `backgroundColor: Colors.surface.raised`, `borderRadius: BorderRadius.default`, `paddingHorizontal: Spacing.sm`, `paddingVertical: Spacing.xxs`, `borderWidth: BorderWidth.hairline`, `borderColor: Colors.border.subtle`.

- [ ] 📐 Create `/src/atoms/badges/ConnectionBadge.tsx`
  - **Wrapper:** `StatusIndicatorBadge`
  - **Purpose:** Specialized badge exclusively for SSH/server connection state. Renders "CONNECTED", "OFFLINE", "CONNECTING" with appropriate variant.
  - **Props Interface:**
    ```typescript
    type ConnectionState = 'connected' | 'offline' | 'connecting' | 'error';
    interface ConnectionBadgeProps {
      state: ConnectionState;
      style?: ViewStyle;
    }
    ```
  - **State Map:** `connected → success`, `offline → error`, `connecting → warning`, `error → error`. Label text from state string, uppercased via `LabelCapsText`.

- [ ] 📐 Create `/src/atoms/badges/LessonStateBadge.tsx`
  - **Wrapper:** `<View>` with `<LabelCapsText>`
  - **Purpose:** Lesson card state chip: "COMPLETE", "IN PROGRESS", "LOCKED".
  - **Props Interface:**
    ```typescript
    type LessonState = 'complete' | 'inProgress' | 'locked';
    interface LessonStateBadgeProps {
      state: LessonState;
      style?: ViewStyle;
    }
    ```
  - **Styling:** `borderRadius: BorderRadius.sm`, `paddingHorizontal: Spacing.xs`, height `Layout.connectionBadgeHeight` (20dp). Background: `success → Colors.semantic.successDim`, `inProgress → Colors.primary.muted`, `locked → Colors.surface.raised`. Text color matches semantic color for state.

- [ ] Create `/src/atoms/badges/index.ts`
  - **Exports:** `StatusDot`, `TrafficLightDots`, `StatusIndicatorBadge`, `ConnectionBadge`, `LessonStateBadge`.

---

## Sub-Phase 1.2.C — Button Atoms (`/src/atoms/buttons/`)

- [ ] ⚡ 📐 Create `/src/atoms/buttons/PrimaryActionButton.tsx`
  - **Wrapper:** React Native `<TouchableOpacity>` + `<View>` + `BodyText`
  - **Purpose:** Primary CTA button. Solid primary blue fill.
  - **Props Interface:**
    ```typescript
    interface PrimaryActionButtonProps {
      label: string;
      onPress: () => void;
      disabled?: boolean;
      loading?: boolean;
      fullWidth?: boolean;
      leftIcon?: React.ReactNode;
      style?: ViewStyle;
      testID?: string;
    }
    ```
  - **Styling Constraints:** Min height `Layout.minTouchTarget` (44dp). `backgroundColor: Colors.primary.default`. `borderRadius: BorderRadius.default` (4dp). `paddingHorizontal: Spacing.md`. `borderWidth: 0`. Active state: `opacity: 0.8`. Disabled state: `opacity: 0.4`. No shadow. Label: `FontFamily.sansSemiBold`, `FontSize.bodySM`, `Colors.text.inverse` (#000000 — white text on blue).

- [ ] 📐 Create `/src/atoms/buttons/SecondaryActionButton.tsx`
  - **Wrapper:** `<TouchableOpacity>` + `<View>` + `BodyText`
  - **Purpose:** Secondary outlined button. Transparent fill, subtle border.
  - **Props Interface:** Same as `PrimaryActionButton` minus `loading`.
  - **Styling Constraints:** Min height 44dp. `backgroundColor: Colors.surface.default`. `borderWidth: BorderWidth.hairline`, `borderColor: Colors.border.subtle`. `borderRadius: BorderRadius.default`. Text: `Colors.text.primary`. Active state: `borderColor: Colors.border.strong`, `backgroundColor: Colors.surface.active`.

- [ ] ⚡ 📐 Create `/src/atoms/buttons/IconButton.tsx`
  - **Wrapper:** `<TouchableOpacity>` with centered `<View>`
  - **Purpose:** Square icon-only button. Used in header actions, toolbar items.
  - **Props Interface:**
    ```typescript
    interface IconButtonProps {
      icon: React.ReactNode;
      onPress: () => void;
      size?: number;   // defaults to Layout.minTouchTarget (44)
      variant?: 'ghost' | 'outlined' | 'filled';
      active?: boolean;
      disabled?: boolean;
      style?: ViewStyle;
      testID?: string;
    }
    ```
  - **Styling Constraints:** `width` and `height` both `size` (minimum 44dp). `borderRadius: BorderRadius.default`. Ghost: transparent bg, no border. Outlined: `borderWidth: 1`, `borderColor: Colors.border.subtle`. Filled: `backgroundColor: Colors.surface.raised`. Active state for all variants: `borderColor: Colors.primary.default`. No shadow.

- [ ] 📐 Create `/src/atoms/buttons/NavButton.tsx`
  - **Wrapper:** `<TouchableOpacity>` with `<View>` column layout
  - **Purpose:** Bottom tab navigation item button (icon + label).
  - **Props Interface:**
    ```typescript
    interface NavButtonProps {
      icon: React.ReactNode;
      label: string;
      active: boolean;
      onPress: () => void;
      badgeCount?: number;
      style?: ViewStyle;
    }
    ```
  - **Styling Constraints:** Min height `Layout.bottomNavHeight`. `alignItems: 'center'`, `justifyContent: 'center'`. Active state: icon and label color → `Colors.primary.default`. Inactive: `Colors.text.tertiary`. Label: `FontSize.labelXS` (10dp), `FontFamily.sansMedium`.

- [ ] ⚡ 📐 Create `/src/atoms/buttons/TerminalKeyButton.tsx`
  - **Wrapper:** `<TouchableOpacity>` + `<View>` + `MonoText`
  - **Purpose:** Developer keyboard bar key. Compact terminal-style key chip that injects key sequences.
  - **Props Interface:**
    ```typescript
    interface TerminalKeyButtonProps {
      label: string;           // Key label (e.g. 'ESC', 'TAB', 'CTRL')
      onPress: () => void;
      wide?: boolean;          // Wider key (e.g. SPACE bar)
      special?: boolean;       // Colored modifier keys
      style?: ViewStyle;
    }
    ```
  - **Styling Constraints:** Height `Layout.developerKeyboardBarHeight - 12` = ~44dp (fits in 56dp bar with 6dp vertical inset). Min width: 44dp. `borderRadius: BorderRadius.sm` (2dp — sharp terminal aesthetic). `backgroundColor: Colors.surface.raised`. `borderWidth: BorderWidth.hairline`, `borderColor: Colors.border.subtle`. Label: `MonoText`, `FontSize.labelSM` (11dp). Active/pressed: `backgroundColor: Colors.primary.dim`, `borderColor: Colors.primary.default`. Special keys: `backgroundColor: Colors.primary.muted`.

- [ ] Create `/src/atoms/buttons/index.ts`
  - **Exports:** `PrimaryActionButton`, `SecondaryActionButton`, `IconButton`, `NavButton`, `TerminalKeyButton`.

---

## Sub-Phase 1.2.D — Input Atoms (`/src/atoms/inputs/`)

- [ ] ⚡ ⌨️ 📐 Create `/src/atoms/inputs/TerminalTextInput.tsx`
  - **Wrappers:** React Native `<TextInput>`
  - **Purpose:** Primary command-line text input. The main text field inside the terminal workspace. Must handle blinking cursor aesthetics via controlled state.
  - **Props Interface:**
    ```typescript
    interface TerminalTextInputProps {
      value: string;
      onChangeText: (text: string) => void;
      onSubmitEditing?: (event: any) => void;
      placeholder?: string;
      autoFocus?: boolean;
      editable?: boolean;
      multiline?: boolean;
      style?: TextStyle;
      testID?: string;
    }
    ```
  - **Styling Constraints:** `backgroundColor: Colors.background.input` (#000000). `fontFamily: FontFamily.mono`. `fontSize: FontSize.codeBase` (14dp). `color: Colors.text.code`. `borderWidth: 0` (no border on raw input — border is on the parent container). `caretHidden={false}` (show OS cursor). `selectionColor: Colors.primary.default`. `placeholderTextColor: Colors.text.placeholder`. No shadow.

- [ ] ⌨️ 📐 Create `/src/atoms/inputs/IconTextInput.tsx`
  - **Wrappers:** `<View>` row + optional left icon `<View>` + `<TextInput>` + optional right icon `<View>`
  - **Purpose:** Standard labeled text input with optional leading/trailing icon. Used in Settings screen for IP/port fields.
  - **Props Interface:**
    ```typescript
    interface IconTextInputProps {
      value: string;
      onChangeText: (text: string) => void;
      placeholder?: string;
      leftIcon?: React.ReactNode;
      rightIcon?: React.ReactNode;
      focused?: boolean;
      error?: boolean;
      disabled?: boolean;
      keyboardType?: KeyboardTypeOptions;
      style?: ViewStyle;
      inputStyle?: TextStyle;
      testID?: string;
    }
    ```
  - **Styling Constraints:** Container height: min 44dp. `backgroundColor: Colors.background.input`. `borderWidth: BorderWidth.hairline`. Default border: `Colors.border.subtle`. Focused border: `Colors.border.focus` (primary blue). Error border: `Colors.border.error`. `borderRadius: BorderRadius.default`. `paddingHorizontal: Spacing.sm`. Font: `FontFamily.mono`, `FontSize.bodySM`. No shadow.

- [ ] ⌨️ 📐 Create `/src/atoms/inputs/ConfigInputField.tsx`
  - **Wrapper:** `<View>` column + `<LabelCapsText>` label + `<IconTextInput>`
  - **Purpose:** Labeled configuration field for Settings screen. Stacks a caps label above an input.
  - **Props Interface:** `label: string`, `value: string`, `onChangeText: (t: string) => void`, `placeholder?: string`, `hint?: string`, `error?: string`, `keyboardType?`, `style?`
  - **Styling Constraints:** Label: `FontSize.labelXS`, `Colors.text.secondary`, `letterSpacing: LetterSpacing.caps`. Gap between label and input: `Spacing.xs` (4dp). Error text below input: `FontSize.labelSM`, `Colors.semantic.error`.

- [ ] Create `/src/atoms/inputs/index.ts`
  - **Exports:** `TerminalTextInput`, `IconTextInput`, `ConfigInputField`.

---

## Sub-Phase 1.2.E — Icon Atoms (`/src/atoms/icons/`)

- [ ] ⚡ Create `/src/atoms/icons/MaterialIcon.tsx`
  - **Wrapper:** `<Text>` using the `MaterialSymbolsOutlined` (or `MaterialCommunityIcons` from `react-native-vector-icons`) font.
  - **Purpose:** Standardized Material Symbol Outlined icon wrapper. Enforces sizing to the three defined icon scales.
  - **Props Interface:**
    ```typescript
    type IconSize = 'sm' | 'md' | 'lg';  // 16 | 18 | 24
    interface MaterialIconProps {
      name: string;
      size?: IconSize | number;  // number allows exact override
      color?: string;
      style?: TextStyle;
    }
    ```
  - **Size Map:** `sm → 16`, `md → 18`, `lg → 24`. Default: `md` (18dp). Color defaults to `Colors.text.secondary`.

- [ ] Create `/src/atoms/icons/TerminalIcon.tsx`
  - **Wrapper:** `MaterialIcon`
  - **Purpose:** Pre-configured icon for terminal-related actions. Defaults to terminal icon name with primary color.
  - **Props:** `size?`, `color?` (defaults `Colors.primary.default`).

- [ ] Create `/src/atoms/icons/FolderIcon.tsx`
  - **Wrapper:** `MaterialIcon`
  - **Purpose:** Folder tree icon. Accepts `open: boolean` to switch between open/closed folder icon names.
  - **Props:** `open?: boolean`, `size?`, `color?` (defaults `Colors.syntax.orange`).

- [ ] Create `/src/atoms/icons/FileTypeIcon.tsx`
  - **Wrapper:** `MaterialIcon`
  - **Purpose:** File type icon resolver. Maps file extension strings to appropriate Material icon names.
  - **Props:** `extension: string`, `size?`, `color?` (defaults `Colors.text.secondary`).
  - **Extension Map:** `.sh → 'terminal'`, `.txt → 'article'`, `.md → 'description'`, `.py → 'code'`, `.js/.ts → 'javascript'`, default → `'insert_drive_file'`.

- [ ] Create `/src/atoms/icons/index.ts`
  - **Exports:** `MaterialIcon`, `TerminalIcon`, `FolderIcon`, `FileTypeIcon`.

---

## Sub-Phase 1.2.F — Container Atoms (`/src/atoms/containers/`)

- [ ] ⚡ 🌑 Create `/src/atoms/containers/Surface.tsx`
  - **Wrapper:** React Native `<View>`
  - **Purpose:** Standard elevated surface container. OLED-safe dark fill. Accepts `level` prop to select surface depth.
  - **Props Interface:**
    ```typescript
    type SurfaceLevel = 'floor' | 'default' | 'raised';
    interface SurfaceProps {
      children?: React.ReactNode;
      level?: SurfaceLevel;
      style?: ViewStyle;
      testID?: string;
    }
    ```
  - **Styling:** Background from `Colors.background.*` keyed by level. `...Shadows.none`. No border. `borderRadius` defaults to 0 (consumers add their own).

- [ ] ⚡ Create `/src/atoms/containers/BorderedSurface.tsx`
  - **Wrapper:** `Surface`
  - **Purpose:** Surface with a mandatory 1px structural border. The foundational panel building block for all cards and containers.
  - **Props Interface:**
    ```typescript
    interface BorderedSurfaceProps {
      children?: React.ReactNode;
      level?: SurfaceLevel;
      borderColor?: string;       // defaults to Colors.border.subtle
      borderRadius?: number;      // defaults to BorderRadius.lg (8)
      focused?: boolean;          // true → borderColor becomes Colors.border.focus
      style?: ViewStyle;
      testID?: string;
    }
    ```
  - **Styling Constraints:** `borderWidth: BorderWidth.hairline` (1dp). `borderColor` defaults to `Colors.border.subtle`. When `focused`, border becomes `Colors.border.focus`. `...Shadows.none` — absolutely no elevation or shadow.

- [ ] Create `/src/atoms/containers/TerminalPanel.tsx`
  - **Wrapper:** `BorderedSurface`
  - **Purpose:** The base container for all terminal-style content panels. Forces `borderRadius: BorderRadius.lg` and `level: 'default'`.
  - **Props Interface:** `children`, `fullWidth?: boolean`, `style?`
  - **Extra Styling:** `overflow: 'hidden'` to clip terminal content within border.

- [ ] Create `/src/atoms/containers/SectionHeader.tsx`
  - **Wrapper:** `<View>` row + `LabelCapsText` + optional right `<View>` slot
  - **Purpose:** Standard section divider header with uppercase label and optional trailing action slot.
  - **Props Interface:** `title: string`, `rightSlot?: React.ReactNode`, `style?`
  - **Styling:** `paddingHorizontal: Spacing.md`, `paddingVertical: Spacing.sm`. `borderBottomWidth: BorderWidth.hairline`, `borderBottomColor: Colors.border.subtle`.

- [ ] Create `/src/atoms/containers/Divider.tsx`
  - **Wrapper:** `<View>`
  - **Purpose:** 1px horizontal or vertical separator line.
  - **Props Interface:** `orientation?: 'horizontal' | 'vertical'`, `color?` (defaults `Colors.border.subtle`), `style?`
  - **Styling:** Horizontal: `height: Layout.dividerThickness (1)`, `width: '100%'`. Vertical: `width: 1`, `alignSelf: 'stretch'`. `backgroundColor: color`.

- [ ] Create `/src/atoms/containers/ProgressTrack.tsx`
  - **Wrapper:** `<View>` (track) + `<View>` (fill, animated via `Animated.View`)
  - **Purpose:** 4dp height progress bar rail.
  - **Props Interface:** `progress: number` (0–1), `color?` (defaults `Colors.semantic.success`), `trackColor?` (defaults `Colors.border.subtle`), `style?`
  - **Styling:** `height: Layout.progressBarHeight` (4dp). `borderRadius: BorderRadius.full`. Track: `backgroundColor: trackColor`. Fill: `backgroundColor: color`, `width: ${progress * 100}%`. No shadow.

- [ ] Create `/src/atoms/containers/index.ts`
  - **Exports:** `Surface`, `BorderedSurface`, `TerminalPanel`, `SectionHeader`, `Divider`, `ProgressTrack`.

---

## Sub-Phase 1.2.G — Atom Barrel Update

- [ ] Update `/src/atoms/index.ts` with final barrel re-exports:
  - **Code Layout:**
    ```typescript
    export * from './text';
    export * from './badges';
    export * from './buttons';
    export * from './inputs';
    export * from './icons';
    export * from './containers';
    ```

---

---

# PHASE 1.3 — Modular App Shell & Navigation Scaffolding

> **Goal:** Build all composite components that form the structural skeleton of the app — the chrome, navigation systems, overlays, and reusable feature-specific panels. Components may import from `atoms/` and `tokens/` only.

---

## Sub-Phase 1.3.A — App Shell Components (`/src/components/shell/`)

- [ ] ⚡ 🌑 Create `/src/components/shell/TrueDarkCanvas.tsx`
  - **Wrappers:** React Native `<View>` with `flex: 1`
  - **Purpose:** The root full-screen OLED-black canvas. Every screen must be wrapped in this component. Ensures the system status bar area and full screen are pitch-black (#000000).
  - **Props Interface:** `children: React.ReactNode`, `style?: ViewStyle`
  - **Styling Constraints:** `flex: 1`, `backgroundColor: Colors.background.floor` (#000000). Must use `StyleSheet.absoluteFillObject` internally for positioning safety. Explicit `...Shadows.none`.

- [ ] 🌑 Create `/src/components/shell/AppBackground.tsx`
  - **Wrappers:** `TrueDarkCanvas` + React Native `<StatusBar>` (set to `barStyle: 'light-content'`, `backgroundColor: '#000000'`, `translucent: true`)
  - **Purpose:** Full application background provider. Sets system status bar style globally. All screens are wrapped here.
  - **Props Interface:** `children: React.ReactNode`
  - **Constraints:** Status bar background is always `#000000`. Never use `default` bar style.

- [ ] Create `/src/components/shell/ScanlineOverlay.tsx`
  - **Wrappers:** React Native `<View>` with `StyleSheet.absoluteFillObject` + `pointerEvents="none"`
  - **Purpose:** Decorative CRT scanline illusion overlay layer. Sits above content but does not intercept touches. Uses repeating thin horizontal stripes via background pattern or SVG.
  - **Props Interface:** `opacity?: number` (defaults `0.04`), `style?: ViewStyle`
  - **Implementation:** Renders a `<View>` array of alternating 1dp/1dp transparent and tinted stripes (`Colors.overlay.scanline`). Or uses `<Canvas>` if `@shopify/react-native-skia` is available. `pointerEvents='none'`. `zIndex: ZIndex.overlay`.
  - **Styling:** Full screen absolute position. Must not affect layout. `opacity` prop controls visual intensity.

- [ ] Create `/src/components/shell/DottedGridOverlay.tsx`
  - **Wrappers:** `<View>` with `StyleSheet.absoluteFillObject` + `pointerEvents="none"`
  - **Purpose:** Subtle dotted grid background pattern for the Auth screen. Creates terminal-paper aesthetic.
  - **Props Interface:** `dotColor?: string` (defaults `Colors.border.subtle`), `spacing?: number` (defaults 24), `opacity?: number` (defaults 0.4)
  - **Implementation:** SVG-based repeating dot grid using `react-native-svg` `<Defs>` + `<Pattern>` + `<Rect>`. If SVG unavailable, use repeated `<View>` grid layout with small circular dots. `pointerEvents='none'`.

- [ ] Create `/src/components/shell/AppHeader.tsx`
  - **Wrappers:** `<View>` row + optional left slot + title center + optional right slot
  - **Purpose:** Reusable top application header / navigation bar. Used on Lessons, FileSystem, Settings screens.
  - **Props Interface:**
    ```typescript
    interface AppHeaderProps {
      title?: string;
      leftSlot?: React.ReactNode;
      rightSlot?: React.ReactNode;
      showBorder?: boolean;        // defaults true
      style?: ViewStyle;
    }
    ```
  - **Styling Constraints:** Height: `Layout.topAppBarHeight` (56dp). `backgroundColor: Colors.background.floor`. `paddingHorizontal: Spacing.md`. `borderBottomWidth: BorderWidth.hairline`. `borderBottomColor: Colors.border.subtle`. `flexDirection: 'row'`, `alignItems: 'center'`. Title: `HeadlineText` `FontSize.titleMD`, `FontFamily.sansSemiBold`. No shadow. Must account for `Layout.statusBarHeight` with `paddingTop`.

- [ ] Create `/src/components/shell/ShellXBrandMark.tsx`
  - **Wrappers:** `<View>` column + `MonoText` (the `$_` symbol) + `Animated.View` (blinking cursor block)
  - **Purpose:** The central terminal logo mark shown on SplashScreen and Auth headers. Renders `$ _` with a blinking block cursor.
  - **Props Interface:** `size?: 'sm' | 'md' | 'lg'`, `showCursor?: boolean`, `animated?: boolean`, `style?: ViewStyle`
  - **Animation:** `Animated.loop(Animated.sequence([...]))` toggling cursor opacity 0↔1 every 500ms. Only animates when `animated={true}`. Cursor block: `width: Layout.terminalCursorWidth` (8dp), `height: 18dp`, `backgroundColor: Colors.primary.default`.
  - **Styling:** `MonoText` for `$_` in `Colors.primary.default`. `FontSize.headlineMD` for `md` size.

- [ ] Create `/src/components/shell/ShellXLogoText.tsx`
  - **Wrapper:** `<View>` row
  - **Purpose:** The "ShellX" wordmark logotype. Renders "Shell" in `Colors.text.primary` and "X" in `Colors.primary.default`.
  - **Props Interface:** `size?: number` (defaults `FontSize.titleLG`), `style?: ViewStyle`

- [ ] Create `/src/components/shell/index.ts`
  - **Exports:** `TrueDarkCanvas`, `AppBackground`, `ScanlineOverlay`, `DottedGridOverlay`, `AppHeader`, `ShellXBrandMark`, `ShellXLogoText`.

---

## Sub-Phase 1.3.B — Navigation Components (`/src/components/navigation/`)

- [ ] ⚡ 📐 📱 Create `/src/components/navigation/BottomTabBar.tsx`
  - **Wrappers:** React Native `<View>` + `<SafeAreaView>` (bottom safe area) + array of `NavButton`
  - **Purpose:** Primary bottom tab navigation bar. Renders 4–5 nav items. Handles safe area insets for notch/gesture navigation devices.
  - **Props Interface:**
    ```typescript
    interface TabItem {
      key: string;
      label: string;
      icon: (active: boolean) => React.ReactNode;
      badge?: number;
    }
    interface BottomTabBarProps {
      items: TabItem[];
      activeKey: string;
      onTabPress: (key: string) => void;
      style?: ViewStyle;
    }
    ```
  - **Styling Constraints:** `height: Layout.bottomNavHeight` (56dp) + safe area bottom inset. `backgroundColor: Colors.background.floor`. `borderTopWidth: BorderWidth.hairline`, `borderTopColor: Colors.border.subtle`. `flexDirection: 'row'`. Each `NavButton` gets `flex: 1`. `...Shadows.none`. Tab items must be minimum 44dp touch target.

- [ ] 📐 Create `/src/components/navigation/BottomTabItem.tsx`
  - **Wrapper:** `NavButton` with additional active indicator
  - **Purpose:** Individual bottom tab item with active indicator line at top.
  - **Props Interface:** `icon: React.ReactNode`, `label: string`, `active: boolean`, `onPress: () => void`, `badge?: number`
  - **Active Indicator:** 2dp wide × 16dp tall centered line above icon using `Colors.primary.default`. Or: 16dp wide × 2dp height top bar with `borderRadius: BorderRadius.full`.

- [ ] 📐 Create `/src/components/navigation/DesktopSideNav.tsx`
  - **Wrappers:** `<View>` column + `SideNavProfileHeader` + `FlatList` of `SideNavItem`
  - **Purpose:** Persistent side navigation panel for tablets/larger screens. Fixed `width: Layout.sideNavWidth` (256dp).
  - **Props Interface:** `items: NavItem[]`, `activeKey: string`, `onItemPress: (key: string) => void`, `profileData?: ProfileData`, `style?: ViewStyle`
  - **Styling:** `width: 256dp`. `backgroundColor: Colors.background.elevated`. `borderRightWidth: BorderWidth.hairline`, `borderRightColor: Colors.border.subtle`. No shadow.

- [ ] Create `/src/components/navigation/SideNavProfileHeader.tsx`
  - **Wrapper:** `<View>` row
  - **Purpose:** User profile mini-header at the top of the side nav.
  - **Props Interface:** `avatarUri?: string`, `displayName: string`, `email: string`, `style?: ViewStyle`
  - **Styling:** Height min 72dp. `paddingHorizontal: Spacing.md`. Avatar: 36dp circle. Name: `BodyText` bold. Email: `LabelCapsText` `Colors.text.secondary`.

- [ ] Create `/src/components/navigation/SideNavItem.tsx`
  - **Wrapper:** `<TouchableOpacity>` row
  - **Purpose:** Individual side nav list item.
  - **Props Interface:** `icon: React.ReactNode`, `label: string`, `active: boolean`, `onPress: () => void`
  - **Styling:** Height `Layout.sideNavItemHeight` (48dp). `paddingHorizontal: Spacing.md`. Active: `backgroundColor: Colors.primary.muted`, left `borderLeftWidth: 2`, `borderLeftColor: Colors.primary.default`. Inactive: transparent bg. Label: `BodyText`, `FontSize.bodySM`.

- [ ] Create `/src/components/navigation/FocusedHeader.tsx`
  - **Wrapper:** `AppHeader` variant with back button
  - **Purpose:** Navigation header for non-root screens with a back chevron.
  - **Props Interface:** `title: string`, `onBack: () => void`, `rightSlot?: React.ReactNode`
  - **Back Button:** `IconButton` with left chevron icon, 44×44dp.

- [ ] Create `/src/components/navigation/index.ts`
  - **Exports:** `BottomTabBar`, `BottomTabItem`, `DesktopSideNav`, `SideNavProfileHeader`, `SideNavItem`, `FocusedHeader`.

---

## Sub-Phase 1.3.C — Auth Components (`/src/components/auth/`)

- [ ] Create `/src/components/auth/AuthTerminalWindow.tsx`
  - **Wrappers:** `BorderedSurface` + `AuthTerminalHeader` + content slot
  - **Purpose:** The mock terminal window container for the Auth screen. Simulates an OS terminal window frame.
  - **Props Interface:** `children: React.ReactNode`, `style?: ViewStyle`
  - **Styling:** `borderRadius: BorderRadius.xl` (12dp). `borderColor: Colors.border.default`. `backgroundColor: Colors.surface.default`. Min width: `Layout.screenWidth * 0.85`. Max width: 400dp.

- [ ] Create `/src/components/auth/AuthTerminalHeader.tsx`
  - **Wrapper:** `<View>` row
  - **Purpose:** Terminal window title bar inside the auth container. Shows `TrafficLightDots` + filename label.
  - **Props Interface:** `filename?: string` (defaults `'auth_session.sh'`), `style?: ViewStyle`
  - **Styling:** Height 36dp. `backgroundColor: Colors.surface.raised`. `borderTopLeftRadius: BorderRadius.xl`, `borderTopRightRadius: BorderRadius.xl`. `borderBottomWidth: BorderWidth.hairline`, `borderBottomColor: Colors.border.subtle`. `paddingHorizontal: Spacing.sm`. `TrafficLightDots` on left. Filename: `MonoText` `FontSize.labelSM` `Colors.text.secondary` centered.

- [ ] Create `/src/components/auth/AuthBrandPanel.tsx`
  - **Wrapper:** `<View>` column
  - **Purpose:** Top branding section inside the auth terminal window. Shows `ShellXBrandMark` + tagline text.
  - **Props Interface:** `style?: ViewStyle`
  - **Styling:** `alignItems: 'center'`, `paddingVertical: Spacing.lg`. `ShellXBrandMark` at `'lg'` size with `animated={true}`. Tagline: `MonoText` `FontSize.labelSM` `Colors.text.secondary` below mark.

- [ ] 📐 Create `/src/components/auth/GoogleSignInButton.tsx`
  - **Wrapper:** `<TouchableOpacity>` row + Google SVG icon + `BodyText`
  - **Purpose:** Mock "Sign in with Google" button. Static (no real OAuth in Roadmap 1).
  - **Props Interface:** `onPress: () => void`, `loading?: boolean`, `style?: ViewStyle`
  - **Styling Constraints:** Height min 48dp. Full width of parent container. `backgroundColor: Colors.surface.raised`. `borderWidth: BorderWidth.hairline`, `borderColor: Colors.border.default`. `borderRadius: BorderRadius.default`. Google "G" icon: 18dp, SVG or asset. Label: `BodyText` `FontFamily.sansSemiBold` `Colors.text.primary`. Gap between icon and text: `Spacing.sm`. Active/pressed: `backgroundColor: Colors.surface.active`. No shadow.

- [ ] Create `/src/components/auth/AuthTerminalOutput.tsx`
  - **Wrapper:** `<View>` column + array of `TerminalText` lines
  - **Purpose:** Simulated terminal output text block at bottom of auth window. Shows decorative boot/init messages.
  - **Props Interface:**
    ```typescript
    interface OutputLine {
      text: string;
      role?: SyntaxRole;  // optional syntax coloring
    }
    interface AuthTerminalOutputProps {
      lines: OutputLine[];
      style?: ViewStyle;
    }
    ```
  - **Styling:** `paddingHorizontal: Spacing.md`, `paddingVertical: Spacing.sm`. Each line: `TerminalText` with optional `SyntaxText` coloring. Lines separated by line-height only.

- [ ] Create `/src/components/auth/index.ts`
  - **Exports:** `AuthTerminalWindow`, `AuthTerminalHeader`, `AuthBrandPanel`, `GoogleSignInButton`, `AuthTerminalOutput`.

---

## Sub-Phase 1.3.D — Terminal Workspace Components (`/src/components/terminal/`)

- [ ] ⚡ Create `/src/components/terminal/TerminalWorkspace.tsx`
  - **Wrappers:** `<View>` column (`flex: 1`) + `TopMetricsBar` + `TerminalEditor` + `VimStatusStrip` + `DeveloperKeyboardBar`
  - **Purpose:** The complete assembled terminal workspace layout. Top-down column composition. This is the master container for all terminal workspace sub-components.
  - **Props Interface:** `style?: ViewStyle`
  - **Layout Stack (top to bottom):**
    1. `TopMetricsBar` — fixed height `Layout.topMetricsBarHeight` (40dp)
    2. `TerminalEditor` — `flex: 1` (fills remaining vertical space)
    3. `VimStatusStrip` — fixed height `Layout.vimStatusStripHeight` (32dp)
    4. `DeveloperKeyboardBar` — fixed height `Layout.developerKeyboardBarHeight` (56dp)

- [ ] Create `/src/components/terminal/TopMetricsBar.tsx`
  - **Wrapper:** `<View>` row
  - **Purpose:** Top status bar in the terminal workspace. Shows file path, connection badge, and vim mode indicator.
  - **Props Interface:** `filePath?: string`, `connectionState?: ConnectionState`, `vimMode?: string`, `style?: ViewStyle`
  - **Styling:** Height `40dp`. `backgroundColor: Colors.background.elevated`. `borderBottomWidth: 1`, `borderBottomColor: Colors.border.subtle`. `paddingHorizontal: Spacing.sm`. `flexDirection: 'row'`, `alignItems: 'center'`, `justifyContent: 'space-between'`. File path: `MonoText` `FontSize.codeXS` `Colors.text.secondary`. Right slot: `ConnectionBadge`.

- [ ] ⚡ Create `/src/components/terminal/TerminalEditor.tsx`
  - **Wrappers:** React Native `<ScrollView>` (vertical) + array of `TerminalCodeLine` + `TerminalPromptLine`
  - **Purpose:** The scrollable terminal content area. Renders the history of code lines plus the active prompt.
  - **Props Interface:**
    ```typescript
    interface TerminalEditorProps {
      lines: TerminalLine[];
      promptText: string;
      style?: ViewStyle;
    }
    ```
  - **Styling Constraints:** `flex: 1`. `backgroundColor: Colors.background.floor`. `padding: Spacing.sm`. `ScrollView` with `ref` for auto-scroll-to-bottom. `keyboardShouldPersistTaps='always'`. Each line minimum height: `Layout.terminalCursorHeight` (22dp from line-height).

- [ ] Create `/src/components/terminal/TerminalCodeLine.tsx`
  - **Wrapper:** `<View>` row + optional line number `MonoText` + content `TerminalText` / `SyntaxText`
  - **Purpose:** A single historical terminal line. Can render plain text or syntax-highlighted output.
  - **Props Interface:** `lineNumber?: number`, `content: string`, `type?: 'output' | 'command' | 'error' | 'system'`, `style?: ViewStyle`
  - **Styling:** Height: `Layout.terminalLineHeight` (22dp). `type: 'command'` → prefix `$` in `Colors.primary.default`. `type: 'error'` → text `Colors.semantic.error`. `type: 'system'` → text `Colors.text.secondary`.

- [ ] Create `/src/components/terminal/TerminalPromptLine.tsx`
  - **Wrapper:** `<View>` row + prompt prefix `MonoText` + `TerminalTextInput` + `TerminalCursor`
  - **Purpose:** The active input prompt line. Shows the shell `$` prefix, the text input, and a blinking cursor.
  - **Props Interface:** `promptPrefix?: string` (defaults `'$ '`), `value: string`, `onChangeText: (t: string) => void`, `onSubmit?: () => void`
  - **Styling:** `flexDirection: 'row'`, `alignItems: 'center'`. Prompt: `MonoText` `Colors.primary.default`.

- [ ] Create `/src/components/terminal/TerminalCursor.tsx`
  - **Wrapper:** `Animated.View`
  - **Purpose:** Blinking block cursor element. Animates opacity 1↔0 on 500ms loop.
  - **Props Interface:** `visible?: boolean`, `color?` (defaults `Colors.primary.default`), `style?: ViewStyle`
  - **Styling:** `width: Layout.terminalCursorWidth` (8dp), `height: Layout.terminalCursorHeight` (18dp), `backgroundColor: color`.

- [ ] Create `/src/components/terminal/TerminalSyntaxText.tsx`
  - **Wrapper:** `<Text>` with nested `SyntaxText` spans
  - **Purpose:** Multi-span syntax highlighted line renderer. Accepts a token array to render mixed-color code in a single `<Text>` (important: nested `<Text>` in RN can share a single line without layout breaks).
  - **Props Interface:**
    ```typescript
    interface SyntaxToken { text: string; role: SyntaxRole; }
    interface TerminalSyntaxTextProps { tokens: SyntaxToken[]; style?: TextStyle; }
    ```

- [ ] Create `/src/components/terminal/VimStatusStrip.tsx`
  - **Wrapper:** `<View>` row
  - **Purpose:** Vim-style status bar at the bottom of the terminal editor area. Shows mode (NORMAL/INSERT/VISUAL), filename, cursor position.
  - **Props Interface:** `mode?: string` (defaults `'NORMAL'`), `filename?: string`, `cursorPos?: { line: number; col: number }`, `style?: ViewStyle`
  - **Styling Constraints:** Height `Layout.vimStatusStripHeight` (32dp). `backgroundColor: Colors.primary.default` when mode is `INSERT`, `Colors.surface.raised` for `NORMAL`, `Colors.semantic.warning` for `VISUAL`. `paddingHorizontal: Spacing.sm`. All text: `MonoText` `FontSize.labelSM` `Colors.text.inverse` (or high-contrast text). `borderTopWidth: 1`, `borderTopColor: Colors.border.subtle`.

- [ ] ⚡ ⌨️ 📐 Create `/src/components/terminal/DeveloperKeyboardBar.tsx`
  - **Wrappers:** `<View>` column + `KeyboardDivider` + `DeveloperKeyboardRow`
  - **Purpose:** The custom developer keyboard accessory bar that sits above the system soft keyboard. Provides quick-access terminal key injection.
  - **Props Interface:** `onKeyPress: (key: string) => void`, `visible?: boolean`, `style?: ViewStyle`
  - **Styling Constraints:** Height `Layout.developerKeyboardBarHeight` (56dp). `backgroundColor: Colors.surface.default`. `borderTopWidth: BorderWidth.hairline`, `borderTopColor: Colors.border.strong`. This component must be rendered within a `KeyboardAvoidingView` parent. When `visible={false}`, it collapses gracefully.

- [ ] ⌨️ 📐 Create `/src/components/terminal/DeveloperKeyboardRow.tsx`
  - **Wrapper:** `<ScrollView>` horizontal + array of `TerminalKeyButton`
  - **Purpose:** Horizontally scrollable row of terminal key buttons.
  - **Props Interface:** `keys: KeyDef[]`, `onKeyPress: (key: string) => void`, `style?: ViewStyle`
  - **Default Keys:** `['ESC', 'TAB', 'CTRL', 'ALT', '|', '/', '\\', '-', '~', 'UP', 'DOWN', 'LEFT', 'RIGHT']`
  - **Styling:** `showsHorizontalScrollIndicator={false}`. `contentContainerStyle: { paddingHorizontal: Spacing.sm, gap: Spacing.xs, alignItems: 'center' }`. Each key min 44dp touch target.

- [ ] Create `/src/components/terminal/KeyboardDivider.tsx`
  - **Wrapper:** `Divider` with specific styling
  - **Purpose:** 1px separator between keyboard bar and keyboard row.

- [ ] Create `/src/components/terminal/LessonContextHeader.tsx`
  - **Wrapper:** `<View>` row
  - **Purpose:** Compact lesson context indicator at top of workspace. Shows current lesson title and progress.
  - **Props Interface:** `lessonTitle?: string`, `progress?: number` (0–1), `onExpand?: () => void`
  - **Styling:** `paddingHorizontal: Spacing.md`, `paddingVertical: Spacing.xs`. `borderBottomWidth: 1`. `ProgressTrack` full width below the title row.

- [ ] 📐 Create `/src/components/terminal/TaskBottomSheet.tsx`
  - **Wrappers:** `Animated.View` + `TaskSheetHeader` + scrollable content + `TaskSheetActions`
  - **Purpose:** The collapsible task overlay panel that slides up from the bottom of the terminal workspace. Shows task instructions, hints, and validation actions.
  - **Props Interface:** `visible: boolean`, `onDismiss: () => void`, `taskTitle?: string`, `taskContent?: string`, `style?: ViewStyle`
  - **Styling Constraints:** `position: 'absolute'`, `bottom: 0`, `left: 0`, `right: 0`. Max height `Layout.screenHeight * 0.6`. `borderTopLeftRadius: BorderRadius.xl`, `borderTopRightRadius: BorderRadius.xl`. `borderTopWidth: 1`, `borderTopColor: Colors.border.subtle`. `backgroundColor: Colors.surface.default`. `zIndex: ZIndex.taskSheet`.
  - **Animation:** `Animated.timing` on `translateY` 0↔(sheet height). Not gesture-driven in Roadmap 1 — toggle only.

- [ ] Create `/src/components/terminal/TaskSheetHeader.tsx`
  - **Wrapper:** `<View>` row + drag handle + title + close `IconButton`
  - **Props Interface:** `title: string`, `onClose: () => void`
  - **Drag Handle:** 32dp wide × 4dp tall centered pill, `backgroundColor: Colors.border.strong`, `borderRadius: BorderRadius.full`. Non-interactive in Roadmap 1.

- [ ] Create `/src/components/terminal/TaskSheetActions.tsx`
  - **Wrapper:** `<View>` row
  - **Purpose:** Action buttons at bottom of task sheet ("Run Check", "Show Hint").
  - **Props Interface:** `onRunCheck?: () => void`, `onShowHint?: () => void`
  - **Styling:** `paddingHorizontal: Spacing.md`, `paddingVertical: Spacing.sm`. `gap: Spacing.sm`. `borderTopWidth: 1`.

- [ ] Create `/src/components/terminal/index.ts`
  - **Exports:** `TerminalWorkspace`, `TopMetricsBar`, `TerminalEditor`, `TerminalCodeLine`, `TerminalPromptLine`, `TerminalSyntaxText`, `TerminalCursor`, `VimStatusStrip`, `DeveloperKeyboardBar`, `DeveloperKeyboardRow`, `KeyboardDivider`, `LessonContextHeader`, `TaskBottomSheet`, `TaskSheetHeader`, `TaskSheetActions`.

---

## Sub-Phase 1.3.E — Lessons Components (`/src/components/lessons/`)

- [ ] Create `/src/components/lessons/LessonsHeader.tsx`
  - **Wrapper:** `<View>` column
  - **Purpose:** Top header section of the Lessons screen with title and filter tabs.
  - **Props Interface:** `title?: string`, `subtitle?: string`, `style?: ViewStyle`

- [ ] Create `/src/components/lessons/LessonModuleSection.tsx`
  - **Wrapper:** `<View>` column + `SectionHeader` + `LessonCardGrid`
  - **Purpose:** A grouped module section within the lessons list.
  - **Props Interface:** `moduleTitle: string`, `lessons: LessonData[]`, `onLessonPress: (id: string) => void`

- [ ] 📐 Create `/src/components/lessons/LessonCardGrid.tsx`
  - **Wrapper:** React Native `<FlatList>` with `numColumns={2}` or `<View>` wrapped grid
  - **Purpose:** 2-column grid layout for lesson cards.
  - **Props Interface:** `lessons: LessonData[]`, `onLessonPress: (id: string) => void`, `style?: ViewStyle`
  - **Styling:** `gap: Spacing.sm`. Card width: `(Layout.screenWidth - Spacing.md * 2 - Spacing.sm) / 2`.

- [ ] 📐 Create `/src/components/lessons/LessonCard.tsx`
  - **Wrapper:** `<TouchableOpacity>` + `BorderedSurface` + `LessonCardHeader` + `LessonProgressMeta` + `LessonProgressBar`
  - **Purpose:** Individual lesson card tile. Three states: complete, in-progress, locked.
  - **Props Interface:**
    ```typescript
    interface LessonData {
      id: string;
      title: string;
      commandCount: number;
      estimatedMinutes: number;
      state: LessonState;
      progress: number;  // 0-1
      moduleIcon?: string;
    }
    interface LessonCardProps {
      data: LessonData;
      onPress: (id: string) => void;
    }
    ```
  - **Styling Constraints:** Min height `Layout.lessonCardMinHeight` (100dp). `borderRadius: BorderRadius.lg`. `borderColor` by state: complete → `Colors.border.success`, locked → `Colors.border.subtle`, inProgress → `Colors.border.focus`. `...Shadows.none`. Locked state: `opacity: 0.5`.

- [ ] Create `/src/components/lessons/LessonCardHeader.tsx`
  - **Wrapper:** `<View>` row + `LessonStatusIcon` + title
  - **Props Interface:** `title: string`, `state: LessonState`, `icon?: string`

- [ ] Create `/src/components/lessons/LessonStatusIcon.tsx`
  - **Wrapper:** `<View>` + `MaterialIcon`
  - **Purpose:** Resolves the correct icon for each lesson state.
  - **State Map:** `complete → 'check_circle'` (`Colors.semantic.success`), `inProgress → 'radio_button_checked'` (`Colors.primary.default`), `locked → 'lock'` (`Colors.text.tertiary`).

- [ ] Create `/src/components/lessons/LessonProgressMeta.tsx`
  - **Wrapper:** `<View>` row
  - **Purpose:** Metadata row: command count, time estimate.
  - **Props Interface:** `commandCount: number`, `estimatedMinutes: number`, `state: LessonState`

- [ ] Create `/src/components/lessons/LessonProgressBar.tsx`
  - **Wrapper:** `ProgressTrack`
  - **Purpose:** Lesson-specific progress bar. Wraps `ProgressTrack` with lesson-appropriate color.
  - **Props Interface:** `progress: number`, `state: LessonState`
  - **Color Resolution:** `complete → Colors.semantic.success`, `inProgress → Colors.primary.default`, `locked → Colors.border.subtle`.

- [ ] Create `/src/components/lessons/AsciiProgressText.tsx`
  - **Wrapper:** `MonoText`
  - **Purpose:** ASCII-style text progress bar e.g. `[████░░░░] 50%`.
  - **Props Interface:** `progress: number` (0–1), `width?: number` (number of characters, defaults 10), `style?: TextStyle`

- [ ] Create `/src/components/lessons/index.ts`
  - **Exports:** `LessonsHeader`, `LessonModuleSection`, `LessonCardGrid`, `LessonCard`, `LessonCardHeader`, `LessonStatusIcon`, `LessonProgressMeta`, `LessonProgressBar`, `AsciiProgressText`.

---

## Sub-Phase 1.3.F — FileSystem Components (`/src/components/filesystem/`)

- [ ] Create `/src/components/filesystem/FileSystemTree.tsx`
  - **Wrapper:** `<ScrollView>` vertical + `<ScrollView>` horizontal (inner) + array of `FileTreeBranch`
  - **Purpose:** Scrollable filesystem tree container. Horizontal scroll enables deep nesting.
  - **Props Interface:** `tree: FileTreeNode[]`, `onFileSelect: (path: string) => void`, `onFolderToggle: (path: string) => void`, `selectedPath?: string`, `style?: ViewStyle`

- [ ] Create `/src/components/filesystem/FileTreeBranch.tsx`
  - **Wrapper:** `<View>` column + `FolderRow` + conditionally rendered children (recursion)
  - **Purpose:** Recursive folder branch renderer.
  - **Props Interface:** `node: FileTreeNode`, `depth: number`, `onFileSelect: (path: string) => void`, `onFolderToggle: (path: string) => void`, `selectedPath?: string`

- [ ] 📐 Create `/src/components/filesystem/FileTreeRow.tsx`
  - **Wrapper:** `<TouchableOpacity>` row
  - **Purpose:** Base row component for all tree items. Handles indent guides and touch targets.
  - **Props Interface:** `depth: number`, `onPress: () => void`, `active?: boolean`, `children: React.ReactNode`, `style?: ViewStyle`
  - **Styling:** Height min 44dp. Indent: `depth * Spacing.md` (16dp per level). Active: `backgroundColor: Colors.primary.muted`.

- [ ] 📐 Create `/src/components/filesystem/FolderRow.tsx`
  - **Wrapper:** `FileTreeRow` + `FolderIcon` + `MonoText` + expand chevron
  - **Props Interface:** `name: string`, `depth: number`, `open: boolean`, `onToggle: () => void`

- [ ] 📐 Create `/src/components/filesystem/FileRow.tsx`
  - **Wrapper:** `FileTreeRow` + `FileTypeIcon` + `MonoText`
  - **Props Interface:** `name: string`, `depth: number`, `onSelect: () => void`, `selected?: boolean`

- [ ] Create `/src/components/filesystem/SelectedFileRow.tsx`
  - **Wrapper:** `FileRow` with forced `selected={true}` and highlight styling
  - **Purpose:** Variant of `FileRow` for the currently selected/open file.

- [ ] Create `/src/components/filesystem/TreeIndentGuide.tsx`
  - **Wrapper:** `<View>` (1dp vertical line)
  - **Purpose:** Visual indent guide line connecting folder to children.
  - **Props Interface:** `depth: number`, `style?: ViewStyle`
  - **Styling:** `width: 1`, `backgroundColor: Colors.border.subtle`, absolute positioned at `left: depth * Spacing.md + 6dp`.

- [ ] Create `/src/components/filesystem/index.ts`
  - **Exports:** `FileSystemTree`, `FileTreeBranch`, `FileTreeRow`, `FolderRow`, `FileRow`, `SelectedFileRow`, `TreeIndentGuide`.

---

## Sub-Phase 1.3.G — Settings Components (`/src/components/settings/`)

- [ ] Create `/src/components/settings/ProfileAvatarBlock.tsx`
  - **Wrapper:** `<View>` column + `<Image>` (avatar) + `HeadlineText` (name) + `BodyText` (email)
  - **Purpose:** User profile display block at top of settings screen.
  - **Props Interface:** `avatarUri?: string`, `displayName: string`, `email: string`, `style?: ViewStyle`
  - **Styling:** Avatar: `width/height: Layout.profileAvatarSizeLG` (72dp), `borderRadius: BorderRadius.full`, `borderWidth: 1`, `borderColor: Colors.border.default`. Centered column. Gap: `Spacing.sm`.

- [ ] Create `/src/components/settings/SettingsConfigCard.tsx`
  - **Wrapper:** `BorderedSurface` + `SectionHeader` + content slot
  - **Purpose:** Grouped settings card container with header and content padding.
  - **Props Interface:** `title: string`, `children: React.ReactNode`, `style?: ViewStyle`
  - **Styling:** `borderRadius: BorderRadius.lg`. `padding: Spacing.md`. `marginBottom: Spacing.md`.

- [ ] ⌨️ 📐 Create `/src/components/settings/ServerConfigInput.tsx`
  - **Wrapper:** `<View>` column + `ConfigInputField` (IP) + `ConfigInputField` (Port)
  - **Purpose:** SSH server configuration input group. IP address + port number.
  - **Props Interface:** `ipValue: string`, `portValue: string`, `onIpChange: (v: string) => void`, `onPortChange: (v: string) => void`, `ipError?: string`, `portError?: string`
  - **Keyboard Types:** IP field: `keyboardType='numeric'`. Port field: `keyboardType='number-pad'`.

- [ ] 📐 Create `/src/components/settings/SaveConfigurationButton.tsx`
  - **Wrapper:** `PrimaryActionButton`
  - **Purpose:** Settings-specific save action button with terminal save aesthetic.
  - **Props Interface:** `onPress: () => void`, `loading?: boolean`, `disabled?: boolean`
  - **Label:** `"SAVE CONFIGURATION"` — all caps, `MonoText` variant label.

- [ ] 📐 Create `/src/components/settings/ServerStatusSignal.tsx`
  - **Wrapper:** `<View>` row + `StatusDot` + `MonoText` (ping text) + optional latency badge
  - **Purpose:** Live server connection test signal display.
  - **Props Interface:** `state: ConnectionState`, `latencyMs?: number`, `onTest?: () => void`, `style?: ViewStyle`
  - **Styling:** Min touch target 44dp for `onTest` tap area. Latency: `MonoText` `FontSize.labelXS` `Colors.text.secondary`.

- [ ] Create `/src/components/settings/index.ts`
  - **Exports:** `ProfileAvatarBlock`, `SettingsConfigCard`, `ServerConfigInput`, `SaveConfigurationButton`, `ServerStatusSignal`.

---

## Sub-Phase 1.3.H — Component Barrel Update

- [ ] Update `/src/components/index.ts` with final barrel re-exports:
  - **Code Layout:**
    ```typescript
    export * from './shell';
    export * from './navigation';
    export * from './auth';
    export * from './terminal';
    export * from './lessons';
    export * from './filesystem';
    export * from './settings';
    ```

---

---

# PHASE 1.4 — Screen View Frame Assembly & State Layout Stubs

> **Goal:** Assemble all six screens using exclusively Phase 1.2 atoms and Phase 1.3 components. No business logic, no API calls, no state management beyond local `useState` for UI toggle behaviors. All data is static mock objects defined at the top of each screen file.

---

## Sub-Phase 1.4.A — Static Mock Data Layer (`/src/data/`)

- [ ] ⚡ Create `/src/data/mockLessons.ts`
  - **Structure:** Exported `MOCK_LESSONS` array matching `LessonData[]` interface. Minimum 8 lesson items across 2 modules. Includes items in all three states: `complete`, `inProgress`, `locked`.

- [ ] ⚡ Create `/src/data/mockFileTree.ts`
  - **Structure:** Exported `MOCK_FILE_TREE` tree structure matching `FileTreeNode[]`. Minimum 3 levels deep: root `/home/student/` → `projects/` → `hello.sh`. Includes both expanded and collapsed folder states.

- [ ] ⚡ Create `/src/data/mockTerminalLines.ts`
  - **Structure:** Exported `MOCK_TERMINAL_LINES` array of `TerminalLine[]`. Includes a mix of `command`, `output`, `error`, and `system` type lines that simulate a realistic shell session.

- [ ] ⚡ Create `/src/data/mockAuth.ts`
  - **Structure:** Exported `MOCK_AUTH_TERMINAL_OUTPUT` — an array of `OutputLine[]` for the `AuthTerminalOutput` component. Simulates init messages like `[OK] Loading session keys...`, `[OK] Checking environment...`.

- [ ] Create `/src/data/index.ts`
  - **Exports:** `MOCK_LESSONS`, `MOCK_FILE_TREE`, `MOCK_TERMINAL_LINES`, `MOCK_AUTH_TERMINAL_OUTPUT`.

---

## Sub-Phase 1.4.B — SplashScreen (`/src/screens/SplashScreen.tsx`)

- [ ] ⚡ 🌑 📱 Create `/src/screens/SplashScreen.tsx`
  - **Wrappers (top-down):**
    1. `AppBackground` (root OLED canvas)
    2. `ScanlineOverlay` (absolute, pointer-none)
    3. `<View>` flex column, `justifyContent: 'center'`, `alignItems: 'center'`
  - **Layout Zones:**
    - **Zone 1 — Center Brand:** `ShellXBrandMark` at `size='lg'` with `animated={true}`.
    - **Zone 2 — Boot Progress:** Vertical column of 4–6 `MonoText` lines simulating a boot log. Each line: `FontSize.labelSM`, `Colors.text.secondary`. Lines: `"[  OK  ] Started kernel..."`, `"[  OK  ] Mounting filesystems..."`, etc. Use `SyntaxText` for `[  OK  ]` in `Colors.semantic.success`.
    - **Zone 3 — Loading Bar:** `ProgressTrack` at `width: 180dp` centered. Below it: `MonoText` percentage stub `"72%"`.
    - **Zone 4 — Footer:** `LabelCapsText` `"SHELLX v1.0.0"` at bottom, `Colors.text.tertiary`.
  - **Static State:** `const [progress] = useState(0.72)` — no animation required in Roadmap 1.
  - **SafeAreaView:** Wrap content in `<SafeAreaView>` with `backgroundColor: '#000000'`.
  - **Status Bar:** `translucent`, `barStyle: 'light-content'`, `backgroundColor: '#000000'`.
  - **Styling Constraints:** Full screen `#000000`. No white. No gray background. All text mono. 0 elevation.

---

## Sub-Phase 1.4.C — AuthScreen (`/src/screens/AuthScreen.tsx`)

- [ ] 🌑 ⌨️ 📐 Create `/src/screens/AuthScreen.tsx`
  - **Wrappers (top-down):**
    1. `AppBackground`
    2. `DottedGridOverlay` (absolute, full-screen behind content)
    3. `<View>` with primary blue atmospheric glow: absolute centered radial blob using `Colors.primary.glow` behind the card. Implemented as a 300dp × 300dp `<View>` with `borderRadius: BorderRadius.full`, `backgroundColor: Colors.primary.glow`, `transform: [{scaleX: 2}]`, centered absolutely.
    4. `<KeyboardAvoidingView>` `behavior: Platform.OS === 'android' ? 'height' : 'padding'` `flex: 1`
    5. `<ScrollView>` `contentContainerStyle: {flexGrow: 1, justifyContent: 'center', alignItems: 'center'}` `keyboardShouldPersistTaps='handled'`
  - **Layout Zones:**
    - **Zone 1 — Auth Card:** `AuthTerminalWindow` containing:
      - `AuthTerminalHeader` (with traffic lights + `"auth_session.sh"`)
      - `AuthBrandPanel` (`ShellXBrandMark` + tagline)
      - `Divider`
      - `GoogleSignInButton` (static, `onPress` logs to console in Roadmap 1)
      - `AuthTerminalOutput` (rendered with `MOCK_AUTH_TERMINAL_OUTPUT`)
    - **Zone 2 — Footer Text:** Below card, `MonoText` `"Secure isolated sandbox environment"` in `Colors.text.tertiary` `FontSize.labelXS`.
  - **Static State:** `const [isLoading] = useState(false)`
  - **SafeAreaView:** Full screen safe area, `backgroundColor: '#000000'`.
  - **Constraints:** Auth card max width: 400dp. Must not scroll horizontally. Google button must be full card width minus `Spacing.md × 2` padding.

---

## Sub-Phase 1.4.D — TerminalScreen (`/src/screens/TerminalScreen.tsx`)

- [ ] ⚡ 🌑 ⌨️ 📐 📱 Create `/src/screens/TerminalScreen.tsx`
  - **Wrappers (top-down):**
    1. `AppBackground`
    2. `<SafeAreaView>` `flex: 1` `backgroundColor: '#000000'`
    3. `<KeyboardAvoidingView>` `flex: 1` `behavior: Platform.OS === 'android' ? 'height' : 'padding'`
    4. `<View>` `flex: 1` (inner layout container)
  - **Layout Zones (fixed column):**
    - **Zone 1 — App Header:** `AppHeader` with `ShellXLogoText` on left, `ConnectionBadge` + `IconButton` (menu) on right. Height: 56dp. `borderBottomWidth: 1`.
    - **Zone 2 — Lesson Context Bar:** `LessonContextHeader` — collapsible. Controlled by `showLessonContext` state boolean. `height: 48dp` when visible, `height: 0` when hidden (or Animated).
    - **Zone 3 — Terminal Workspace:** `TerminalWorkspace` `flex: 1`. Contains `TopMetricsBar`, `TerminalEditor` (loaded with `MOCK_TERMINAL_LINES`), `VimStatusStrip`, `DeveloperKeyboardBar`.
  - **Overlay:**
    - `TaskBottomSheet` absolutely positioned. Controlled by `isTaskSheetVisible` state boolean.
  - **Static State Stubs:**
    ```typescript
    const [inputText, setInputText] = useState('');
    const [vimMode, setVimMode] = useState<'NORMAL'|'INSERT'>('NORMAL');
    const [isTaskSheetVisible, setIsTaskSheetVisible] = useState(false);
    const [showLessonContext, setShowLessonContext] = useState(true);
    const [connectionState] = useState<ConnectionState>('offline');
    ```
  - **Keyboard Behavior:** `KeyboardAvoidingView` must push `DeveloperKeyboardBar` to sit directly above the system keyboard. Verify `developerKeyboardBarHeight: 56dp` is preserved when keyboard is open.
  - **Low-end Device Constraint:** `TerminalEditor` must render efficiently with virtualized `FlatList` (not `ScrollView` + map) for line rendering to prevent frame drops on 2GB RAM devices.

---

## Sub-Phase 1.4.E — LessonsScreen (`/src/screens/LessonsScreen.tsx`)

- [ ] 📐 📱 Create `/src/screens/LessonsScreen.tsx`
  - **Wrappers:**
    1. `AppBackground`
    2. `<SafeAreaView>` `flex: 1`
    3. `<FlatList>` (vertical, outer scrollable container — avoids nested ScrollView)
  - **Layout Zones:**
    - **Zone 1 — App Header:** `AppHeader` title `"Lessons"`, right slot: `IconButton` (search icon).
    - **Zone 2 — Lessons Header:** `LessonsHeader` with overall progress summary.
    - **Zone 3 — Module Sections:** Two `LessonModuleSection` components (Module 1: "Shell Basics", Module 2: "File Operations"), each containing a `LessonCardGrid` loaded with `MOCK_LESSONS`.
  - **Static State Stubs:**
    ```typescript
    const [activeFilter] = useState<'all'|'inProgress'|'complete'>('all');
    ```
  - **FlatList Configuration:** `ListHeaderComponent` renders header zones. `data` is `MOCK_LESSONS` grouped by module. `keyExtractor={(item) => item.id}`. `renderItem` renders a row of two `LessonCard` components (or use `numColumns={2}`). `showsVerticalScrollIndicator={false}`.

---

## Sub-Phase 1.4.F — FileSystemScreen (`/src/screens/FileSystemScreen.tsx`)

- [ ] 📐 Create `/src/screens/FileSystemScreen.tsx`
  - **Wrappers:**
    1. `AppBackground`
    2. `<SafeAreaView>` `flex: 1`
    3. `<View>` column `flex: 1`
  - **Layout Zones:**
    - **Zone 1 — Focused Header:** `FocusedHeader` title `"File System"`, `onBack` stub.
    - **Zone 2 — Selected File Breadcrumb:** `<View>` row. `MonoText` showing `selectedPath` or `"/home/student"`. `backgroundColor: Colors.surface.raised`. `paddingHorizontal: Spacing.md`. `height: 36dp`. `borderBottomWidth: 1`.
    - **Zone 3 — File Tree:** `FileSystemTree` `flex: 1` loaded with `MOCK_FILE_TREE`.
    - **Zone 4 — Bottom Action Bar:** `<View>` row. Two `SecondaryActionButton`: `"OPEN"` and `"COPY PATH"`. `height: 56dp`. `borderTopWidth: 1`.
  - **Static State Stubs:**
    ```typescript
    const [selectedPath, setSelectedPath] = useState<string>('/home/student');
    const [expandedPaths, setExpandedPaths] = useState<string[]>(['/home/student']);
    ```

---

## Sub-Phase 1.4.G — SettingsScreen (`/src/screens/SettingsScreen.tsx`)

- [ ] ⌨️ 📐 Create `/src/screens/SettingsScreen.tsx`
  - **Wrappers:**
    1. `AppBackground`
    2. `<SafeAreaView>` `flex: 1`
    3. `<KeyboardAvoidingView>` `flex: 1` behavior `'height'`
    4. `<ScrollView>` `keyboardShouldPersistTaps='handled'`
  - **Layout Zones:**
    - **Zone 1 — Focused Header:** `FocusedHeader` title `"Settings"`, with `onBack` stub.
    - **Zone 2 — Profile Block:** `ProfileAvatarBlock` (static mock data: name `"student@shellx"`, email `"student@local"`).
    - **Zone 3 — Server Config Card:** `SettingsConfigCard` title `"Remote Server"` containing:
      - `ServerConfigInput` (IP + Port fields)
      - `ServerStatusSignal` (static `state: 'offline'`)
      - `SaveConfigurationButton`
    - **Zone 4 — Preferences Card:** `SettingsConfigCard` title `"Preferences"` containing static rows (Font size row, Theme row — non-interactive stubs with `BodyText` labels and `LabelCapsText` values).
    - **Zone 5 — Danger Zone Card:** `SettingsConfigCard` title `"Account"` containing `SecondaryActionButton` `"SIGN OUT"` in `Colors.semantic.error` text color.
  - **Static State Stubs:**
    ```typescript
    const [ipValue, setIpValue] = useState('192.168.1.100');
    const [portValue, setPortValue] = useState('22');
    const [connectionState] = useState<ConnectionState>('offline');
    ```
  - **Keyboard Scroll Constraint:** When IP/Port inputs are focused on a 5-inch device, the `ScrollView` must scroll to bring the focused input above the keyboard. Use `scrollToFocusedInput` via `ref` or `KeyboardAwareScrollView` pattern.

---

## Sub-Phase 1.4.H — Screen Barrel Update

- [ ] Update `/src/screens/index.ts` with final barrel re-exports:
  - **Code Layout:**
    ```typescript
    export { default as SplashScreen }    from './SplashScreen';
    export { default as AuthScreen }       from './AuthScreen';
    export { default as TerminalScreen }   from './TerminalScreen';
    export { default as LessonsScreen }    from './LessonsScreen';
    export { default as FileSystemScreen } from './FileSystemScreen';
    export { default as SettingsScreen }   from './SettingsScreen';
    ```

---

## Sub-Phase 1.4.I — Navigation Root (`/src/navigation/`)

- [ ] ⚡ Create `/src/navigation/RootNavigator.tsx`
  - **Wrappers:** React Navigation `<NavigationContainer>` + `<Stack.Navigator>`
  - **Purpose:** Top-level navigation stack. Manages the screen transition sequence from Splash → Auth → Main.
  - **Stack Screens:** `Splash` (initial route), `Auth`, `Main` (renders `MainTabNavigator`).
  - **Screen Options:** `headerShown: false` for all screens. `animation: 'fade'` for Splash→Auth. `animation: 'slide_from_right'` for Auth→Main.
  - **Dependency:** Requires `@react-navigation/native` and `@react-navigation/native-stack`.

- [ ] ⚡ Create `/src/navigation/MainTabNavigator.tsx`
  - **Wrappers:** React Navigation `<Tab.Navigator>` with custom `tabBar` prop pointing to `BottomTabBar`
  - **Purpose:** Bottom tab navigation for the main app experience.
  - **Tab Screens:** `Terminal` → `TerminalScreen`, `Lessons` → `LessonsScreen`, `Files` → `FileSystemScreen`, `Settings` → `SettingsScreen`.
  - **Custom Tab Bar:** `tabBar={(props) => <BottomTabBar {...props} />}`. Tab bar `backgroundColor` must be `#000000`.

- [ ] Create `/src/navigation/index.ts`
  - **Exports:** `RootNavigator`, `MainTabNavigator`.

---

## Sub-Phase 1.4.J — Application Entry Point

- [ ] ⚡ Create `/src/App.tsx`
  - **Wrappers:** `<AppBackground>` + `<RootNavigator>`
  - **Purpose:** Root application component. Mounts the navigation tree inside the OLED canvas.
  - **Code Layout:**
    ```typescript
    import React from 'react';
    import { AppBackground } from './components/shell';
    import { RootNavigator }  from './navigation';

    const App = () => (
      <AppBackground>
        <RootNavigator />
      </AppBackground>
    );

    export default App;
    ```

- [ ] Verify `/index.js` (project root) registers `App` with `AppRegistry.registerComponent`.

---

---

# ✅ PRODUCTION-READY STATIC VERIFICATION CHECKLIST

> Run this checklist as the final gate before the Antigravity system marks Roadmap 1 as complete. Every item must be checked on a physical or emulated **5-inch 720×1280 Android device** (or equivalent low-end profile).

---

## 🔲 Section V1 — Token System Integrity

- [ ] All color values in the codebase trace back to a `Colors.*` token. Zero hardcoded hex values outside `/src/tokens/colors.ts`.
- [ ] All spacing values trace back to `Spacing.*`. Zero hardcoded numeric padding/margin values outside `/src/tokens/spacing.ts`.
- [ ] All font sizes trace back to `FontSize.*`. Zero hardcoded font sizes outside `/src/tokens/typography.ts`.
- [ ] All border widths are `BorderWidth.hairline` (1dp) or `BorderWidth.medium` (2dp). Zero `borderWidth: 3` or higher anywhere.
- [ ] Zero `elevation`, `shadowColor`, `shadowOpacity`, `shadowOffset`, `shadowRadius` non-zero values exist anywhere in the codebase.
- [ ] Background color `#000000` is rendered on all screens — confirmed with color picker on device screenshot.
- [ ] `FontFamily.mono` (`JetBrains Mono`) is applied to all terminal, code, and monospace elements. Confirmed with UI Automator screenshot.
- [ ] `FontFamily.sans` (`Inter`) is applied to all UI label, headline, and body elements.

---

## 🔲 Section V2 — Touch Target Compliance (44×44dp Minimum)

- [ ] `PrimaryActionButton`: Verified min height 44dp in all usage sites.
- [ ] `SecondaryActionButton`: Verified min height 44dp.
- [ ] `IconButton`: Verified `size` prop defaults to 44dp. No override below 44dp in any screen.
- [ ] `NavButton` / `BottomTabItem`: Verified overall tap area spans full bottom nav height (56dp).
- [ ] `TerminalKeyButton`: Verified min height 44dp (fits within 56dp bar with 6dp top/bottom inset).
- [ ] `FileTreeRow`: Verified min height 44dp for all file/folder rows.
- [ ] `SettingsConfigCard` rows: Verified row height 56dp.
- [ ] `GoogleSignInButton`: Verified min height 48dp.
- [ ] `SaveConfigurationButton`: Verified min height 44dp.
- [ ] `ServerStatusSignal` (when `onTest` is present): Verified tap region is 44×44dp minimum.
- [ ] `SideNavItem`: Verified height 48dp.
- [ ] `LessonCard`: Verified minimum height 100dp (well above touch minimum).
- [ ] Back button in `FocusedHeader`: Verified 44×44dp `IconButton`.
- [ ] `TaskSheetHeader` close button: Verified 44×44dp `IconButton`.

---

## 🔲 Section V3 — Layout Scaling on 5-inch 720×1280 Low-End Device

- [ ] `SplashScreen`: All elements visible without scrolling. Boot log lines do not overflow screen width. Progress bar centered without clipping.
- [ ] `AuthScreen`: `AuthTerminalWindow` card fits within screen width with `Spacing.md` (16dp) horizontal margins. Google button does not overflow card. Terminal output lines wrap correctly in `MonoText`.
- [ ] `TerminalScreen`: `TopMetricsBar` (40dp), `TerminalEditor` (flex:1), `VimStatusStrip` (32dp), `DeveloperKeyboardBar` (56dp) stack without overlap on 720×1280. Total chrome height: 40+32+56 = 128dp + `AppHeader` 56dp = 184dp. Remaining terminal height: 1280 - 56 (status) - 56 (header) - 184 (workspace chrome) = at minimum 984dp for terminal content — confirmed adequate.
- [ ] `LessonsScreen`: 2-column `LessonCardGrid` card width = `(720 - 32 - 8) / 2 = 340dp` — confirmed renders without overflow.
- [ ] `FileSystemScreen`: Deep nested file tree (3+ levels) renders without horizontal overflow beyond its `ScrollView`.
- [ ] `SettingsScreen`: IP and Port fields are fully visible above keyboard when focused. `ScrollView` scrolls to show focused field.
- [ ] `HeadlineText` with `FontSize.headlineLG` (30dp): Confirmed no text overflow on 720dp width.
- [ ] `MonoText` terminal lines at `FontSize.codeBase` (14dp) with `lineHeight: 22`: Confirmed readable and not clipped.
- [ ] `BottomTabBar`: 4 tab items at `flex: 1` each = 180dp per tab on 720dp screen — confirmed adequate.
- [ ] `DeveloperKeyboardRow`: Horizontal `ScrollView` confirmed operable — all keys accessible via scroll on narrow screen.

---

## 🔲 Section V4 — Notch & Safe Area Compliance

- [ ] `SafeAreaView` wraps screen content on all six screens, preventing overlap with status bar, notch, and gesture nav bar.
- [ ] `AppBackground` sets `StatusBar backgroundColor: '#000000'` and `barStyle: 'light-content'`. Confirmed no white status bar flash.
- [ ] `AppHeader` applies `paddingTop: Layout.statusBarHeight` correctly via `StatusBar.currentHeight` on notched Android devices.
- [ ] `BottomTabBar` accounts for bottom inset using `SafeAreaView` or `useSafeAreaInsets` from `react-native-safe-area-context`.
- [ ] `TaskBottomSheet` absolute position uses bottom inset — does not overlap system gesture bar on Android 10+ gesture navigation.
- [ ] `TerminalScreen`: `DeveloperKeyboardBar` sits above gesture navigation bar when keyboard is closed.
- [ ] Landscape orientation: All screens gracefully handle `Dimensions.get('window')` change via `useWindowDimensions()` hook (Roadmap 1 static orientation lock to portrait is acceptable — confirm `android:screenOrientation="portrait"` in `AndroidManifest.xml`).

---

## 🔲 Section V5 — Virtual Keyboard Layout Behavior

- [ ] `AuthScreen`: `KeyboardAvoidingView` moves `AuthTerminalWindow` up when keyboard opens on `GoogleSignInButton` press (no input, but layout shift is verified as non-breaking).
- [ ] `TerminalScreen`: `KeyboardAvoidingView` behavior verified — `DeveloperKeyboardBar` correctly repositions to sit above soft keyboard when `TerminalTextInput` is focused.
- [ ] `TerminalScreen`: When keyboard opens, `TerminalEditor` shrinks (not overlapped) — `flex: 1` correctly compresses between `TopMetricsBar` and `DeveloperKeyboardBar`.
- [ ] `SettingsScreen`: `KeyboardAvoidingView` with `ScrollView` — focused `ConfigInputField` (IP address) scrolls into view when keyboard opens.
- [ ] `SettingsScreen`: Focused `ConfigInputField` (Port) — same scroll-to-input behavior confirmed.
- [ ] All `TextInput` components: `returnKeyType` appropriate to field context (IP → `'done'`, Port → `'done'`, Terminal prompt → `'send'`).
- [ ] All `TextInput` components: `blurOnSubmit={false}` on the terminal prompt input — keyboard must not dismiss on submit.
- [ ] `keyboardShouldPersistTaps='always'` set on `TerminalEditor` scroll container.

---

## 🔲 Section V6 — OLED True Dark Aesthetic Verification

- [ ] Take screenshot of every screen. Confirm zero gray, off-black, or #0A0A0A backgrounds that are not explicitly defined tokens.
- [ ] `ScanlineOverlay` is visible at `opacity: 0.04` on SplashScreen and TerminalScreen — subtle but present.
- [ ] `DottedGridOverlay` visible on AuthScreen background — subtle grid pattern confirms aesthetic intent.
- [ ] Primary blue atmospheric glow (`Colors.primary.glow`) visible behind AuthTerminalWindow.
- [ ] All `BorderedSurface` components show a visible 1px `Colors.border.subtle` (#1F2937) border against `Colors.background.elevated` (#0D0D0D) background — contrast confirmed.
- [ ] `VimStatusStrip` in INSERT mode shows `Colors.primary.default` (#3B82F6) background — visual mode indicator functional.
- [ ] Syntax highlighting colors confirmed in `TerminalEditor`: `Colors.syntax.blue`, `.green`, `.orange` all visually distinct against `Colors.background.floor`.
- [ ] `TrafficLightDots` in `AuthTerminalHeader`: red, yellow, green dots visible and correctly colored.
- [ ] `ProgressTrack` fill: `Colors.semantic.success` (#4FDF94) confirmed against dark track background.

---

## 🔲 Section V7 — TypeScript Compilation & Static Analysis

- [ ] `tsc --noEmit` exits with 0 errors.
- [ ] ESLint passes with 0 errors on all files in `/src/`.
- [ ] No `any` type used without explicit `// eslint-disable` comment and justification.
- [ ] All component `Props` interfaces are exported from their file.
- [ ] `StyleSheet.create({})` used for all static styles — no inline object style creation inside `render` functions (performance constraint for low-end devices).
- [ ] `Animated.Value` objects initialized outside of render functions (in `useRef` or component constructor).
- [ ] No `console.log` or `console.warn` calls in any component file. Debug stubs acceptable in screen files during Roadmap 1.

---

## 🔲 Section V8 — Navigation Integrity

- [ ] `RootNavigator` renders without error with all screen imports resolved.
- [ ] `MainTabNavigator` custom `BottomTabBar` renders without error.
- [ ] Navigation from Splash → Auth works (or is wired to auto-advance via `setTimeout` in `SplashScreen`).
- [ ] Navigation from Auth → Terminal (Main) triggers on `GoogleSignInButton` press.
- [ ] All four main tab screens (`Terminal`, `Lessons`, `Files`, `Settings`) are reachable from `BottomTabBar`.
- [ ] `FocusedHeader` back button in `FileSystemScreen` and `SettingsScreen` triggers `navigation.goBack()`.
- [ ] `headerShown: false` confirmed on all `Stack.Screen` declarations — no double headers.

---

## 🔲 Section V9 — Accessibility Stub Compliance

- [ ] All interactive elements (`TouchableOpacity`, `TextInput`) have `accessibilityLabel` prop defined.
- [ ] All decorative elements (`ScanlineOverlay`, `DottedGridOverlay`, `TrafficLightDots`) have `accessible={false}` + `importantForAccessibility='no-hide-descendants'`.
- [ ] `TerminalText` blocks have `accessible={true}` and `accessibilityRole='text'`.
- [ ] `StatusDot` and `ConnectionBadge` have `accessibilityHint` describing connection state.
- [ ] Minimum contrast ratio of 4.5:1 verified for all text on background pairs:
  - `Colors.text.primary` (#F9FAFB) on `Colors.background.floor` (#000000): ✅ (exceeds 21:1)
  - `Colors.text.secondary` (#9CA3AF) on `Colors.background.floor` (#000000): ✅ (meets AA)
  - `Colors.primary.default` (#3B82F6) on `Colors.background.floor` (#000000): ✅ (meets AA Large)
  - `Colors.text.code` (#E5E7EB) on `Colors.background.elevated` (#0D0D0D): ✅

---

## 🔲 Section V10 — Final File Count Verification

> All paths below must exist in the project. Run `find ./src -name "*.ts" -o -name "*.tsx" | sort` and confirm every path is present.

**Tokens (8 files):**
- [ ] `/src/tokens/index.ts`
- [ ] `/src/tokens/colors.ts`
- [ ] `/src/tokens/typography.ts`
- [ ] `/src/tokens/spacing.ts`
- [ ] `/src/tokens/layout.ts`
- [ ] `/src/tokens/borders.ts`
- [ ] `/src/tokens/shadows.ts`
- [ ] `/src/tokens/zIndex.ts`
- [ ] `/src/tokens/theme.ts`

**Atoms (26 files):**
- [ ] `/src/atoms/index.ts`
- [ ] `/src/atoms/text/index.ts`
- [ ] `/src/atoms/text/SafeText.tsx`
- [ ] `/src/atoms/text/MonoText.tsx`
- [ ] `/src/atoms/text/LabelCapsText.tsx`
- [ ] `/src/atoms/text/HeadlineText.tsx`
- [ ] `/src/atoms/text/BodyText.tsx`
- [ ] `/src/atoms/text/TerminalText.tsx`
- [ ] `/src/atoms/text/SyntaxText.tsx`
- [ ] `/src/atoms/badges/index.ts`
- [ ] `/src/atoms/badges/StatusDot.tsx`
- [ ] `/src/atoms/badges/TrafficLightDots.tsx`
- [ ] `/src/atoms/badges/StatusIndicatorBadge.tsx`
- [ ] `/src/atoms/badges/ConnectionBadge.tsx`
- [ ] `/src/atoms/badges/LessonStateBadge.tsx`
- [ ] `/src/atoms/buttons/index.ts`
- [ ] `/src/atoms/buttons/PrimaryActionButton.tsx`
- [ ] `/src/atoms/buttons/SecondaryActionButton.tsx`
- [ ] `/src/atoms/buttons/IconButton.tsx`
- [ ] `/src/atoms/buttons/NavButton.tsx`
- [ ] `/src/atoms/buttons/TerminalKeyButton.tsx`
- [ ] `/src/atoms/inputs/index.ts`
- [ ] `/src/atoms/inputs/TerminalTextInput.tsx`
- [ ] `/src/atoms/inputs/IconTextInput.tsx`
- [ ] `/src/atoms/inputs/ConfigInputField.tsx`
- [ ] `/src/atoms/icons/index.ts`
- [ ] `/src/atoms/icons/MaterialIcon.tsx`
- [ ] `/src/atoms/icons/TerminalIcon.tsx`
- [ ] `/src/atoms/icons/FolderIcon.tsx`
- [ ] `/src/atoms/icons/FileTypeIcon.tsx`
- [ ] `/src/atoms/containers/index.ts`
- [ ] `/src/atoms/containers/Surface.tsx`
- [ ] `/src/atoms/containers/BorderedSurface.tsx`
- [ ] `/src/atoms/containers/TerminalPanel.tsx`
- [ ] `/src/atoms/containers/SectionHeader.tsx`
- [ ] `/src/atoms/containers/Divider.tsx`
- [ ] `/src/atoms/containers/ProgressTrack.tsx`

**Components (51 files):**
- [ ] `/src/components/index.ts`
- [ ] `/src/components/shell/index.ts`
- [ ] `/src/components/shell/TrueDarkCanvas.tsx`
- [ ] `/src/components/shell/AppBackground.tsx`
- [ ] `/src/components/shell/ScanlineOverlay.tsx`
- [ ] `/src/components/shell/DottedGridOverlay.tsx`
- [ ] `/src/components/shell/AppHeader.tsx`
- [ ] `/src/components/shell/ShellXBrandMark.tsx`
- [ ] `/src/components/shell/ShellXLogoText.tsx`
- [ ] `/src/components/navigation/index.ts`
- [ ] `/src/components/navigation/BottomTabBar.tsx`
- [ ] `/src/components/navigation/BottomTabItem.tsx`
- [ ] `/src/components/navigation/DesktopSideNav.tsx`
- [ ] `/src/components/navigation/SideNavProfileHeader.tsx`
- [ ] `/src/components/navigation/SideNavItem.tsx`
- [ ] `/src/components/navigation/FocusedHeader.tsx`
- [ ] `/src/components/auth/index.ts`
- [ ] `/src/components/auth/AuthTerminalWindow.tsx`
- [ ] `/src/components/auth/AuthTerminalHeader.tsx`
- [ ] `/src/components/auth/AuthBrandPanel.tsx`
- [ ] `/src/components/auth/GoogleSignInButton.tsx`
- [ ] `/src/components/auth/AuthTerminalOutput.tsx`
- [ ] `/src/components/terminal/index.ts`
- [ ] `/src/components/terminal/TerminalWorkspace.tsx`
- [ ] `/src/components/terminal/TopMetricsBar.tsx`
- [ ] `/src/components/terminal/TerminalEditor.tsx`
- [ ] `/src/components/terminal/TerminalCodeLine.tsx`
- [ ] `/src/components/terminal/TerminalPromptLine.tsx`
- [ ] `/src/components/terminal/TerminalSyntaxText.tsx`
- [ ] `/src/components/terminal/TerminalCursor.tsx`
- [ ] `/src/components/terminal/VimStatusStrip.tsx`
- [ ] `/src/components/terminal/DeveloperKeyboardBar.tsx`
- [ ] `/src/components/terminal/DeveloperKeyboardRow.tsx`
- [ ] `/src/components/terminal/KeyboardDivider.tsx`
- [ ] `/src/components/terminal/LessonContextHeader.tsx`
- [ ] `/src/components/terminal/TaskBottomSheet.tsx`
- [ ] `/src/components/terminal/TaskSheetHeader.tsx`
- [ ] `/src/components/terminal/TaskSheetActions.tsx`
- [ ] `/src/components/lessons/index.ts`
- [ ] `/src/components/lessons/LessonsHeader.tsx`
- [ ] `/src/components/lessons/LessonModuleSection.tsx`
- [ ] `/src/components/lessons/LessonCardGrid.tsx`
- [ ] `/src/components/lessons/LessonCard.tsx`
- [ ] `/src/components/lessons/LessonCardHeader.tsx`
- [ ] `/src/components/lessons/LessonStatusIcon.tsx`
- [ ] `/src/components/lessons/LessonProgressMeta.tsx`
- [ ] `/src/components/lessons/LessonProgressBar.tsx`
- [ ] `/src/components/lessons/AsciiProgressText.tsx`
- [ ] `/src/components/filesystem/index.ts`
- [ ] `/src/components/filesystem/FileSystemTree.tsx`
- [ ] `/src/components/filesystem/FileTreeBranch.tsx`
- [ ] `/src/components/filesystem/FileTreeRow.tsx`
- [ ] `/src/components/filesystem/FolderRow.tsx`
- [ ] `/src/components/filesystem/FileRow.tsx`
- [ ] `/src/components/filesystem/SelectedFileRow.tsx`
- [ ] `/src/components/filesystem/TreeIndentGuide.tsx`
- [ ] `/src/components/settings/index.ts`
- [ ] `/src/components/settings/ProfileAvatarBlock.tsx`
- [ ] `/src/components/settings/SettingsConfigCard.tsx`
- [ ] `/src/components/settings/ServerConfigInput.tsx`
- [ ] `/src/components/settings/SaveConfigurationButton.tsx`
- [ ] `/src/components/settings/ServerStatusSignal.tsx`

**Screens (7 files):**
- [ ] `/src/screens/index.ts`
- [ ] `/src/screens/SplashScreen.tsx`
- [ ] `/src/screens/AuthScreen.tsx`
- [ ] `/src/screens/TerminalScreen.tsx`
- [ ] `/src/screens/LessonsScreen.tsx`
- [ ] `/src/screens/FileSystemScreen.tsx`
- [ ] `/src/screens/SettingsScreen.tsx`

**Navigation (3 files):**
- [ ] `/src/navigation/index.ts`
- [ ] `/src/navigation/RootNavigator.tsx`
- [ ] `/src/navigation/MainTabNavigator.tsx`

**Data (5 files):**
- [ ] `/src/data/index.ts`
- [ ] `/src/data/mockLessons.ts`
- [ ] `/src/data/mockFileTree.ts`
- [ ] `/src/data/mockTerminalLines.ts`
- [ ] `/src/data/mockAuth.ts`

**App Entry (1 file):**
- [ ] `/src/App.tsx`

---

> **Total tracked files: 110**
> All 110 files must exist, compile without TypeScript errors, and pass the V1–V9 verification sections before Roadmap 1 is considered complete.

---

*Roadmap 1 — ShellX Static Android Prototype*
*Document Version: 1.0.0*
*Architecture: React Native CLI + TypeScript + True Dark OLED Design System*
*Verification Standard: Antigravity Static Verification Protocol v1*
