export const ZIndex = {
  floor: 0,
  base: 1,
  raised: 10,
  overlay: 20,
  dropdown: 30,
  sticky: 40,
  navigation: 50,
  modal: 60,
  taskSheet: 70,
  toast: 80,
  splash: 100,
} as const;

export type ZIndexToken = keyof typeof ZIndex;