import { StyleSheet } from 'react-native'
import type { ThemeColors } from '@/theme'
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography'
import { radii } from '@/theme/radii'
import { shadows } from '@/theme/shadows'
import { spacing } from '@/theme/spacing'
export const createOnboardingStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.cream,
    },
    header: {
      paddingHorizontal: spacing.xMassive,
      paddingTop: spacing.hugePlus,
      paddingBottom: spacing.massive,
    },
    title: {
      fontSize: fontSizes.displaySm,
      fontFamily: fontFamilies.display,
      color: colors.ink,
      letterSpacing: letterSpacings.sm,
    },
    subtitle: {
      marginTop: spacing.md,
      fontSize: fontSizes.md,
      color: colors.inkMuted,
      letterSpacing: letterSpacings.xs,
    },
    progressTrack: {
      height: 4,
      backgroundColor: colors.creamLine,
      borderRadius: radii.full,
      overflow: 'hidden',
      marginHorizontal: spacing.xMassive,
    },
    progressFill: {
      height: 4,
      backgroundColor: colors.inkStrong,
      borderRadius: radii.full,
    },
    pager: {
      flexGrow: 0,
    },
    page: {
      paddingHorizontal: spacing.xMassive,
    },
    pageContent: {
      marginTop: spacing.xMassive,
    },
    card: {
      backgroundColor: colors.creamLight,
      borderRadius: radii.xl,
      padding: spacing.xMassive,
      ...shadows.soft,
    },
    cardTitle: {
      fontSize: fontSizes.xxl,
      fontFamily: fontFamilies.display,
      color: colors.ink,
      letterSpacing: letterSpacings.sm,
    },
    cardBody: {
      marginTop: spacing.lg,
      fontSize: fontSizes.md,
      color: colors.inkMuted,
      letterSpacing: letterSpacings.xs,
      lineHeight: 20,
    },
    section: {
      marginTop: spacing.xMassive,
    },
    label: {
      fontSize: fontSizes.sm,
      color: colors.inkMutedLight,
      textTransform: 'uppercase',
      letterSpacing: letterSpacings.lg,
      marginBottom: spacing.sm,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.creamCard,
      borderRadius: radii.lg,
      paddingHorizontal: spacing.xMassive,
      paddingVertical: spacing.huge,
    },
    inputRowCompact: {
      paddingHorizontal: spacing.xl,
    },
    input: {
      flex: 1,
      fontSize: fontSizes.input,
      color: colors.ink,
      fontFamily: fontFamilies.display,
      letterSpacing: letterSpacings.sm,
    },
    unit: {
      fontSize: fontSizes.md,
      color: colors.inkSoft,
    },
    segmentedRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
    },
    goalRow: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      gap: spacing.md,
    },
    goalCol: {
      flex: 1,
      minWidth: 0,
    },
    segment: {
      flexGrow: 1,
      minWidth: 90,
      backgroundColor: colors.creamCard,
      borderRadius: radii.lg,
      paddingVertical: spacing.huge,
      paddingHorizontal: spacing.xMassive,
      alignItems: 'center',
    },
    segmentActive: {
      backgroundColor: colors.inkStrong,
      borderColor: colors.inkStrong,
    },
    segmentText: {
      fontSize: fontSizes.md,
      color: colors.inkMuted,
      letterSpacing: letterSpacings.sm,
    },
    segmentTextActive: {
      color: colors.highlight,
    },
    helper: {
      marginTop: spacing.sm,
      fontSize: fontSizes.sm,
      color: colors.inkMutedLight,
    },
    scrollHint: {
      marginTop: spacing.md,
      fontSize: fontSizes.sm,
      color: colors.inkMutedLight,
      letterSpacing: letterSpacings.sm,
    },
    datePickerWrap: {
      alignItems: 'center',
      marginTop: spacing.md,
    },
    actions: {
      paddingHorizontal: spacing.xMassive,
      paddingTop: spacing.xMassive,
      paddingBottom: spacing.hugePlus,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    navButton: {
      width: 46,
      height: 46,
      borderRadius: 16,
      backgroundColor: colors.creamLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    navButtonPrimary: {
      backgroundColor: colors.inkStrong,
    },
    navButtonDisabled: {
      opacity: 0.5,
    },
    stepIndicator: {
      fontSize: fontSizes.sm,
      color: colors.inkMutedLight,
      letterSpacing: letterSpacings.md,
    },
  })
