import { Platform } from 'react-native';

export const FontFamily = {
  sans: Platform.select({
    android: 'Inter-Regular',
    ios: 'Inter-Regular',
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

export const FontSize = {
  headlineLG: 30,
  headlineMD: 24,
  headlineSM: 20,
  titleLG: 18,
  titleMD: 16,
  titleSM: 15,
  bodyLG: 16,
  bodyMD: 15,
  bodySM: 14,
  labelLG: 13,
  labelMD: 12,
  labelSM: 11,
  labelXS: 10,
  codeBase: 14,
  codeSM: 13,
  codeXS: 12,
} as const;

export const FontWeight = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
} as const;

export const LineHeight = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
  terminal: 22,
  terminalSM: 20,
  code: 22,
} as const;

export const LetterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.5,
  wider: 1.0,
  caps: 1.5,
  ultraCaps: 2.0,
} as const;