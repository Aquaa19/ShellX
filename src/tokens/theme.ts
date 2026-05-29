import { Colors } from './colors';
import { FontFamily, FontSize, FontWeight, LineHeight, LetterSpacing } from './typography';
import { Spacing } from './spacing';
import { Layout } from './layout';
import { BorderRadius, BorderWidth, NoShadow } from './borders';
import { Shadows } from './shadows';
import { ZIndex } from './zIndex';

export const Theme = {
  colors: Colors,
  fontFamily: FontFamily,
  fontSize: FontSize,
  fontWeight: FontWeight,
  lineHeight: LineHeight,
  letterSpacing: LetterSpacing,
  spacing: Spacing,
  layout: Layout,
  borderRadius: BorderRadius,
  borderWidth: BorderWidth,
  noShadow: NoShadow,
  shadows: Shadows,
  zIndex: ZIndex,
} as const;

export type ThemeType = typeof Theme;