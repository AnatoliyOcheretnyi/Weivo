import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/theme';
import { dimensions } from '@/theme/dimensions';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography';

export const createHomeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.cream,
    },
    content: {
      padding: spacing.mega,
      paddingBottom: spacing.hugePlus + dimensions.tabBar.height,
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
      backgroundColor: colors.inkStrong,
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
    heroTopRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    heroMetaStack: {
      alignItems: 'flex-end',
      gap: spacing.sm,
    },
    heroMetaLabel: {
      fontSize: fontSizes.xs,
      color: colors.creamHint,
      textTransform: 'uppercase',
      letterSpacing: letterSpacings.md,
    },
    heroMetaValue: {
      fontSize: fontSizes.lg,
      color: colors.highlight,
      fontFamily: fontFamilies.mono,
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
      gap: spacing.md,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.creamWarm,
      borderRadius: radii.lg,
      padding: spacing.xxl,
      minHeight: 88,
      justifyContent: 'center',
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
    hintOverlay: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: colors.overlay,
    },
    hintCard: {
      position: 'absolute',
      left: spacing.mega,
      backgroundColor: colors.creamLight,
      borderRadius: radii.xl,
      padding: spacing.xxl,
      paddingTop: spacing.xxl + spacing.md,
      gap: spacing.lg,
    },
    hintArrow: {
      position: 'absolute',
      top: -12,
      left: spacing.xxxl,
      width: 0,
      height: 0,
      borderLeftWidth: 10,
      borderRightWidth: 10,
      borderBottomWidth: 12,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: colors.creamLight,
    },
    hintTitle: {
      fontSize: fontSizes.lg,
      color: colors.ink,
      fontFamily: fontFamilies.display,
    },
    hintBody: {
      fontSize: fontSizes.md,
      color: colors.inkMuted,
      letterSpacing: letterSpacings.sm,
    },
    hintActions: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.sm,
    },
    hintSecondary: {
      flexBasis: '30%',
      paddingVertical: spacing.md,
      borderRadius: radii.full,
      backgroundColor: colors.cream,
      alignItems: 'center',
    },
    hintSecondaryText: {
      fontSize: fontSizes.xs,
      color: colors.inkMuted,
      letterSpacing: letterSpacings.sm,
      textTransform: 'uppercase',
    },
    hintPrimaryWrap: {
      flex: 1,
    },
    hintPrimary: {
      paddingVertical: spacing.md,
      borderRadius: radii.full,
      backgroundColor: colors.inkStrong,
      alignItems: 'center',
    },
    hintPrimaryText: {
      fontSize: fontSizes.xs,
      color: colors.highlight,
      letterSpacing: letterSpacings.sm,
      textTransform: 'uppercase',
    },
  });
