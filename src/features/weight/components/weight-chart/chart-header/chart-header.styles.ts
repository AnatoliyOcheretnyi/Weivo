import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';

export const chartHeaderStyles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.xxl,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontFamily: fontFamilies.display,
    color: colors.ink,
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: fontSizes.md,
    color: colors.inkMutedAlt,
    letterSpacing: letterSpacings.xs,
    textTransform: 'uppercase',
  },
  rangePill: {
    backgroundColor: colors.inkStrong,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: radii.full,
  },
  rangeText: {
    color: colors.highlightAlt,
    fontSize: fontSizes.sm,
    letterSpacing: letterSpacings.sm,
    textTransform: 'uppercase',
  },
});
