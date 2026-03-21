import { StyleSheet } from 'react-native'
import type { ThemeColors } from '@/theme'
import { radii } from '@/theme'
import { fontFamilies, fontSizes, letterSpacings, spacing } from '@/theme'
import { dimensions } from '@/theme/dimensions'

export const createVoicePocScreenStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.cream,
    },
    content: {
      paddingHorizontal: spacing.mega,
      paddingTop: spacing.lg,
      paddingBottom: spacing.hugePlus + dimensions.tabBar.height,
      gap: spacing.lg,
    },
    chartBlock: {
      borderRadius: radii.xl,
      overflow: 'hidden',
      backgroundColor: colors.creamWarm,
      padding: spacing.lg,
    },
    card: {
      borderRadius: radii.xl,
      backgroundColor: colors.inkStrong,
      padding: spacing.xxl,
      gap: spacing.md,
    },
    title: {
      fontSize: fontSizes.lg,
      color: colors.highlight,
      textTransform: 'uppercase',
      letterSpacing: letterSpacings.lg,
      fontFamily: fontFamilies.display,
    },
    body: {
      fontSize: fontSizes.md,
      color: colors.creamHint,
      lineHeight: 22,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.creamMuted,
      borderRadius: radii.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      color: colors.highlight,
      fontFamily: fontFamilies.mono,
      fontSize: fontSizes.sm,
      backgroundColor: colors.inkSoft,
    },
    controlsRow: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    button: {
      flex: 1,
      borderRadius: radii.full,
      paddingVertical: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonPrimary: {
      backgroundColor: colors.accentTeal,
    },
    buttonDanger: {
      backgroundColor: colors.accentOrangeSoft,
    },
    buttonSecondary: {
      backgroundColor: colors.inkWarm,
    },
    buttonGhost: {
      backgroundColor: colors.creamMuted,
    },
    buttonText: {
      color: colors.inkStrong,
      fontFamily: fontFamilies.display,
      fontSize: fontSizes.sm,
      textTransform: 'uppercase',
      letterSpacing: letterSpacings.md,
    },
    tinyButton: {
      flex: 1,
      borderRadius: radii.full,
      paddingVertical: spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    configBlock: {
      borderRadius: radii.md,
      padding: spacing.lg,
      backgroundColor: colors.inkSoft,
      gap: spacing.sm,
    },
    configRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    adjustRow: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    adjustButton: {
      minWidth: 42,
      borderRadius: radii.full,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    metricsCard: {
      borderRadius: radii.md,
      padding: spacing.lg,
      backgroundColor: colors.inkSoft,
      gap: spacing.xs,
    },
    metricLine: {
      color: colors.creamHint,
      fontSize: fontSizes.sm,
      fontFamily: fontFamilies.mono,
    },
    metricError: {
      marginTop: spacing.xs,
      color: colors.accentOrangeSoft,
      fontSize: fontSizes.sm,
      fontFamily: fontFamilies.mono,
    },
    progressTrack: {
      height: 8,
      borderRadius: radii.full,
      backgroundColor: colors.inkSoft,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: radii.full,
      backgroundColor: colors.accentTeal,
    },
    sequenceCard: {
      borderRadius: radii.md,
      padding: spacing.lg,
      backgroundColor: colors.inkSoft,
      gap: spacing.sm,
    },
    sequenceTitle: {
      color: colors.creamHint,
      fontSize: fontSizes.xs,
      textTransform: 'uppercase',
      letterSpacing: letterSpacings.md,
      marginTop: spacing.xs,
    },
    sequenceRow: {
      flexDirection: 'row',
      gap: spacing.xs,
      paddingVertical: spacing.xs,
      paddingRight: spacing.md,
    },
    sequenceChip: {
      minWidth: 30,
      borderRadius: radii.sm,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      backgroundColor: colors.creamWarm,
      alignItems: 'center',
    },
    sequenceChipActive: {
      backgroundColor: colors.accentTeal,
    },
    sequenceChipPlayed: {
      minWidth: 30,
      borderRadius: radii.sm,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      backgroundColor: colors.accentGold,
      alignItems: 'center',
    },
    sequenceChipText: {
      color: colors.inkStrong,
      fontSize: fontSizes.xs,
      fontFamily: fontFamilies.mono,
    },
  })
