import { StyleSheet } from 'react-native';

import { colors } from '../colors';
import { dimensions } from '../dimensions';
import { fontSizes, letterSpacings } from '../typography';
import { radii } from '../radii';
import { spacing } from '../spacing';

export const entriesStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    padding: spacing.mega,
    paddingBottom: dimensions.entries.paddingBottom,
    gap: spacing.xxl,
  },
  header: {
    marginBottom: dimensions.explore.headerBottom,
  },
  title: {
    fontSize: fontSizes.displaySm,
    color: colors.ink,
    letterSpacing: letterSpacings.sm,
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: fontSizes.md,
    color: colors.inkMutedLight,
    textTransform: 'uppercase',
    letterSpacing: letterSpacings.xl,
  },
  row: {
    backgroundColor: colors.creamLight,
    borderRadius: radii.xl,
    padding: dimensions.explore.rowPadding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: fontSizes.xl,
    color: colors.ink,
  },
  meta: {
    marginTop: spacing.sm,
    fontSize: fontSizes.sm,
    color: colors.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: letterSpacings.sm,
  },
  weightBlock: {
    alignItems: 'flex-end',
  },
  weight: {
    fontSize: fontSizes.xl,
    color: colors.ink,
  },
  delta: {
    marginTop: spacing.sm,
    fontSize: fontSizes.sm,
  },
  deltaRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  mood: {
    fontSize: dimensions.list.moodSize,
  },
  deltaUp: {
    color: colors.accentOrangeDark,
  },
  deltaDown: {
    color: colors.accentTeal,
  },
});
