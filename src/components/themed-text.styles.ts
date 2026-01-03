import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/theme';
import { fontSizes, lineHeights } from '@/theme/typography';

export const createThemedTextStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    default: {
      fontSize: fontSizes.xl,
      lineHeight: lineHeights.sm,
    },
    defaultSemiBold: {
      fontSize: fontSizes.xl,
      lineHeight: lineHeights.sm,
      fontWeight: '600',
    },
    title: {
      fontSize: fontSizes.displayLg,
      fontWeight: 'bold',
      lineHeight: lineHeights.lg,
    },
    subtitle: {
      fontSize: fontSizes.xxl,
      fontWeight: 'bold',
    },
    link: {
      lineHeight: lineHeights.md,
      fontSize: fontSizes.xl,
      color: colors.link,
    },
  });
