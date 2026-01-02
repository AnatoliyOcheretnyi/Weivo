import { Platform } from 'react-native';

export const fontFamilies = {
  display: Platform.select({ ios: 'Avenir Next', android: 'serif', default: 'Avenir Next' }),
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'Menlo' }),
  system: Platform.select({
    ios: {
      sans: 'system-ui',
      serif: 'ui-serif',
      rounded: 'ui-rounded',
      mono: 'ui-monospace',
    },
    default: {
      sans: 'normal',
      serif: 'serif',
      rounded: 'normal',
      mono: 'monospace',
    },
    web: {
      sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      serif: "Georgia, 'Times New Roman', serif",
      rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
      mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
  }),
};

export const fontSizes = {
  xs: 10,
  sm: 11,
  md: 12,
  base: 13,
  lg: 14,
  xl: 16,
  xxl: 20,
  title: 24,
  input: 22,
  emoji: 28,
  displaySm: 26,
  displayMd: 30,
  displayLg: 32,
  displayXl: 46,
};

export const lineHeights = {
  sm: 24,
  md: 30,
  lg: 32,
};

export const letterSpacings = {
  xs: 0.4,
  sm: 0.6,
  md: 0.8,
  lg: 1,
  xl: 1.1,
  xxl: 1.2,
};
