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