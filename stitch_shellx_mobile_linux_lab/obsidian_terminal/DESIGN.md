---
name: Obsidian Terminal
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1b1b'
  surface-container: '#0D0D0D'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#303030'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#4fdf94'
  on-secondary: '#00391f'
  secondary-container: '#00b26c'
  on-secondary-container: '#003c21'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#c2842f'
  on-tertiary-container: '#3e2400'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#6ffcae'
  secondary-fixed-dim: '#4fdf94'
  on-secondary-fixed: '#002110'
  on-secondary-fixed-variant: '#00522f'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#131313'
  on-background: '#e2e2e2'
  surface-variant: '#353535'
  border-subtle: '#1F2937'
  error-red: '#FFB4AB'
  syntax-blue: '#ADC6FF'
  syntax-green: '#6FFBBE'
  syntax-orange: '#FFDDB8'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  code-block:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '450'
    lineHeight: 22px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
---

## Brand & Style

The design system is engineered for a high-focus, low-latency learning experience tailored specifically for mobile developers. The brand personality is technical, precise, and utilitarian, aiming to evoke the feeling of a high-end integrated development environment (IDE). 

The style utilizes a blend of **Minimalism** and **Modern Corporate** aesthetics, optimized for the terminal environment. It prioritizes content clarity through pitch-black backgrounds, high-contrast syntax highlighting, and a flat UI architecture. Every element is designed to reduce eye strain during long coding sessions, using subtle borders instead of shadows to define structure, mimicking the clean, grid-based layout of modern code editors.

## Colors

The palette is built on a "True Dark" foundation to maximize OLED efficiency and minimize visual noise. 

- **Primary Canvas:** Use `#000000` for the main application background.
- **Surface Layers:** Use `#0D0D0D` for secondary containers, such as code blocks, cards, or sidebar navigation.
- **Action & Brand:** Primary Blue (`#3B82F6`) is reserved for primary call-to-actions, progress indicators, and active selection states.
- **Semantic Feedback:** Colors follow industry standards for developer tools—Green for successful builds, Yellow for warnings, and Red for critical errors.
- **Borders:** Use `#1F2937` for all structural dividers and element outlines to maintain a sophisticated hierarchy without relying on shadows.

## Typography

This design system employs a dual-font strategy to distinguish between UI interaction and educational content.

- **UI Sans (Inter):** Used for all navigational elements, descriptions, and headlines. It provides a neutral, highly readable foundation.
- **Code Mono (JetBrains Mono):** Used for code snippets, terminal outputs, technical labels, and data inputs. The increased x-height ensures code is legible even at smaller mobile sizes.

**Scaling Rules:**
For mobile screens, headlines should never exceed 30px to ensure sufficient line wrapping for technical terms. Paragraph text maintains a 16px base for accessibility, while code blocks are set to 14px to maximize horizontal real estate on narrow screens.

## Layout & Spacing

The layout philosophy is strictly **Grid-Based and Fluid**, utilizing a 4px base increment to align with standard developer tool environments.

- **Mobile Layout:** A single-column fluid layout with 16px side margins. 
- **Grid:** Elements align to a 4-column layout on mobile, with gutters fixed at 16px.
- **The Terminal Container:** Code editors and terminal views should use 8px internal padding to maximize the visible character count per line while maintaining separation from the container edge.
- **Vertical Rhythm:** Use 16px (md) for standard spacing between elements and 24px (lg) to separate major sections.

## Elevation & Depth

This design system rejects traditional shadows in favor of **Tonal Layers and Low-Contrast Outlines**. Depth is communicated through color variance and crisp boundaries rather than blur.

- **Level 0 (Floor):** `#000000` — The base background layer.
- **Level 1 (Card/Container):** `#0D0D0D` — Used for elevated content blocks, code editors, and input fields.
- **Structural Definition:** Use 1px solid borders (`#1F2937`) to define the edges of all Level 1 containers.
- **Active State:** When an element is focused or active, the border color transitions to the Primary Blue (`#3B82F6`) to indicate focus without changing the layout geometry.

## Shapes

The shape language is **Soft**, reflecting a professional and efficient toolset. To maintain the "technical" feel, large radii and pill shapes are avoided.

- **Standard Radius:** UI elements like buttons, checkboxes, and inputs use a 4px (0.25rem) corner radius.
- **Container Radius:** Cards and code blocks use an 8px (0.5rem) radius to differentiate them from smaller interactive components.
- **Strict Geometry:** Avoid "Pill" shapes for buttons; maintain rectangular structural integrity to maximize the internal area for text strings.

## Components

### Buttons
Primary buttons feature a solid `#3B82F6` fill with white text. Secondary buttons are outlined using the `#1F2937` border with a `#0D0D0D` background. Use the `label-caps` typography style for all button labels to reinforce the technical aesthetic.

### Terminal & Code Blocks
The central component of the experience. Terminal windows must use the `#0D0D0D` background and JetBrains Mono font. They should include a top "header" bar containing the file name or path and a copy-to-clipboard action.

### Input Fields
Inputs are flat with a `#000000` background and a `#1F2937` border. On focus, the border transitions to `#3B82F6`. Use JetBrains Mono for any inputs that involve technical data or code entry.

### Cards
Cards utilize the Level 1 surface (`#0D0D0D`) and a 1px `#1F2937` border. They are used for grouping related educational content and should not have shadows.

### Status Indicators
Small, circular dots (8px) used for system status:
- **Green:** Connected / Success
- **Yellow:** Booting / Warning
- **Red:** Offline / Error

### Progress Bars
Progress indicators use a thin 4px height. The track is `#1F2937` and the active indicator is `#3B82F6`. In a terminal context, favor ASCII-style progress bars (`[#####---]`) using the monospaced font.