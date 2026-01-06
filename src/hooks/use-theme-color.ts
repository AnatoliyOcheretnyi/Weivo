/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { themeColors, useAppTheme } from '@/theme';

type ThemeName = keyof typeof themeColors;
type ThemeColorName = keyof typeof themeColors.light;

export function useThemeColor(
  props: Partial<Record<ThemeName, string>>,
  colorName: ThemeColorName
) {
  const { scheme } = useAppTheme();
  const colorFromProps = props[scheme as ThemeName];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return themeColors[scheme as ThemeName][colorName];
  }
}
