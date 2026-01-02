import { StyleSheet } from 'react-native';

import { colors } from '../colors';
import { fontSizes, lineHeights } from '../typography';

export const themedTextStyles = StyleSheet.create({
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
