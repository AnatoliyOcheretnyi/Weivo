/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { themeColors, useAppTheme } from '@/theme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof themeColors.light & keyof typeof themeColors.dark
) {
  const { scheme } = useAppTheme();
  const colorFromProps = props[scheme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return themeColors[scheme][colorName];
  }
}
