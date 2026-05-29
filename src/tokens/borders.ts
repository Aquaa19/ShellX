export const BorderRadius = {
  none: 0,
  sm: 2,
  default: 4,
  md: 4,
  lg: 8,
  xl: 12,
  xxl: 16,
  full: 9999,
} as const;

export const BorderWidth = {
  none: 0,
  hairline: 1,
  medium: 2,
} as const;

export const NoShadow = {
  elevation: 0,
  shadowColor: 'transparent',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0,
  shadowRadius: 0,
} as const;