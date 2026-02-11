import { StyleSheet } from 'react-native'
import type { ThemeColors } from '@/theme'
import { spacing } from '@/theme/spacing'
import { radii } from '@/theme/radii'
import { fontSizes, letterSpacings } from '@/theme/typography'
export const createAnalyticsStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.cream,
    },
    content: {
      paddingHorizontal: spacing.mega,
      paddingTop: spacing.mega,
      paddingBottom: spacing.massive,
      gap: spacing.xxl,
    },
    header: {
      gap: spacing.sm,
    },
    title: {
      fontSize: fontSizes.displaySm,
      color: colors.ink,
      letterSpacing: letterSpacings.sm,
    },
    subtitle: {
      fontSize: fontSizes.md,
      color: colors.inkMutedLight,
      textTransform: 'uppercase',
      letterSpacing: letterSpacings.lg,
    },
    toggleRow: {
      flexDirection: 'row',
      backgroundColor: colors.creamWarm,
      borderRadius: radii.full,
      padding: spacing.xs,
      gap: spacing.xs,
    },
    toggleButton: {
      flex: 1,
      borderRadius: radii.full,
      paddingVertical: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    toggleButtonActive: {
      backgroundColor: colors.inkStrong,
    },
    toggleText: {
      fontSize: fontSizes.sm,
      color: colors.inkMuted,
      textTransform: 'uppercase',
      letterSpacing: letterSpacings.sm,
    },
    toggleTextActive: {
      color: colors.highlight,
    },
    heroCard: {
      backgroundColor: colors.inkStrong,
      borderRadius: radii.xl,
      padding: spacing.xxl,
      gap: spacing.md,
    },
    heroLabel: {
      fontSize: fontSizes.sm,
      color: colors.creamHint,
      textTransform: 'uppercase',
      letterSpacing: letterSpacings.sm,
    },
    heroValue: {
      fontSize: fontSizes.displayMd,
      color: colors.highlight,
    },
    heroMeta: {
      fontSize: fontSizes.md,
      color: colors.creamMuted,
      letterSpacing: letterSpacings.sm,
    },
    metricGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
    },
    metricCard: {
      width: '48%',
      backgroundColor: colors.creamLight,
      borderRadius: radii.xl,
      padding: spacing.xxl,
      gap: spacing.sm,
    },
    metricLabel: {
      fontSize: fontSizes.xs,
      color: colors.inkSoft,
      textTransform: 'uppercase',
      letterSpacing: letterSpacings.sm,
    },
    metricValue: {
      fontSize: fontSizes.xl,
      color: colors.ink,
    },
    fullWidthCard: {
      width: '100%',
    },
    sectionCard: {
      backgroundColor: colors.creamLight,
      borderRadius: radii.xl,
      padding: spacing.xxl,
      gap: spacing.xl,
    },
    sectionTitle: {
      fontSize: fontSizes.md,
      color: colors.inkMutedLight,
      textTransform: 'uppercase',
      letterSpacing: letterSpacings.lg,
    },
    sectionText: {
      fontSize: fontSizes.md,
      color: colors.ink,
    },
  })
