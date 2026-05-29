import { Dimensions, Platform, StatusBar } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const Layout = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,

  topAppBarHeight: 56,
  topAppBarHeightExpanded: 64,
  bottomNavHeight: 56,
  bottomNavHeightSafe: 64,

  developerKeyboardBarHeight: 56,
  vimStatusStripHeight: 32,
  topMetricsBarHeight: 40,
  taskBottomSheetPeek: 80,
  taskBottomSheetExpanded: 0, 

  progressBarHeight: 4,
  terminalCursorWidth: 8,
  terminalCursorHeight: 18, 
  trafficLightDotSize: 12,
  trafficLightDotSpacing: 8,
  statusDotSize: 8,
  connectionBadgeHeight: 20,
  dividerThickness: 1,
  focusRingWidth: 1,

  minTouchTarget: 44,
  comfortTouchTarget: 48,

  lessonCardMinHeight: 100,
  settingsRowHeight: 56,
  profileAvatarSize: 56,
  profileAvatarSizeLG: 72,

  sideNavWidth: 256,
  sideNavItemHeight: 48,

  statusBarHeight: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0,
} as const;

export type LayoutToken = typeof Layout;