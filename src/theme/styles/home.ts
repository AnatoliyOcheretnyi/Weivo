import { StyleSheet } from 'react-native';

import { colors } from '../colors';
import { dimensions } from '../dimensions';
import { fontFamilies, fontSizes, letterSpacings } from '../typography';
import { radii } from '../radii';
import { spacing } from '../spacing';

export const homeStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  content: {
    padding: spacing.mega,
    paddingBottom: spacing.hugePlus,
    gap: spacing.mega,
  },
  orbLarge: {
    position: 'absolute',
    width: dimensions.home.orbLarge,
    height: dimensions.home.orbLarge,
    borderRadius: dimensions.home.orbLarge,
    backgroundColor: colors.accentGold,
    opacity: 0.28,
    top: dimensions.home.orbLargeOffsetTop,
    right: dimensions.home.orbLargeOffsetRight,
  },
  orbSmall: {
    position: 'absolute',
    width: dimensions.home.orbSmall,
    height: dimensions.home.orbSmall,
    borderRadius: dimensions.home.orbSmall,
    backgroundColor: colors.inkWarm,
    opacity: 0.18,
    bottom: dimensions.home.orbSmallOffsetBottom,
    left: dimensions.home.orbSmallOffsetLeft,
  },
  header: {
    gap: spacing.md,
  },
  brand: {
    fontSize: fontSizes.displayMd,
    color: colors.ink,
    fontFamily: fontFamilies.display,
    letterSpacing: letterSpacings.xl,
  },
  tagline: {
    fontSize: fontSizes.md,
    color: colors.inkMuted,
    textTransform: 'uppercase',
    letterSpacing: letterSpacings.xxl,
  },
  heroCard: {
    backgroundColor: colors.ink,
    borderRadius: radii.xxxl,
    padding: spacing.ultra,
  },
  heroLabel: {
    fontSize: fontSizes.md,
    color: colors.creamHint,
    textTransform: 'uppercase',
    letterSpacing: letterSpacings.lg,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.lg,
    marginTop: spacing.xl,
  },
  heroValue: {
    fontSize: fontSizes.displayXl,
    color: colors.highlight,
    fontFamily: fontFamilies.display,
  },
  heroUnit: {
    fontSize: fontSizes.xl,
    color: colors.highlight,
    marginBottom: spacing.md,
  },
  heroMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xxl,
  },
  heroMeta: {
    color: colors.creamMuted,
    fontSize: fontSizes.md,
  },
  heroMetaAccent: {
    color: colors.accentOrangeSoft,
    fontSize: fontSizes.md,
    fontFamily: fontFamilies.mono,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.xxl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.creamWarm,
    borderRadius: radii.xl,
    padding: spacing.xxxl,
  },
  statLabel: {
    fontSize: fontSizes.xs,
    color: colors.inkSoft,
    textTransform: 'uppercase',
    letterSpacing: letterSpacings.md,
  },
  statValue: {
    marginTop: spacing.lg,
    fontSize: fontSizes.xxl,
    color: colors.ink,
    fontFamily: fontFamilies.display,
  },
  statUnit: {
    marginTop: spacing.xs,
    fontSize: fontSizes.sm,
    color: colors.inkMuted,
  },
});
