import { StyleSheet } from 'react-native'
import type { ThemeColors } from '@/theme'
import { dimensions } from '@/theme/dimensions'
import { fontSizes, letterSpacings } from '@/theme/typography'
import { radii } from '@/theme/radii'
import { shadows } from '@/theme/shadows'
import { spacing } from '@/theme/spacing'
export const createProfileEditStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.cream,
      padding: spacing.mega,
      justifyContent: 'center',
    },
    card: {
      backgroundColor: colors.creamLight,
      borderRadius: radii.card,
      padding: dimensions.modal.padding,
      shadowColor: colors.ink,
      shadowOpacity: shadows.card.shadowOpacity,
      shadowRadius: shadows.card.shadowRadius,
      shadowOffset: shadows.card.shadowOffset,
    },
    title: {
      fontSize: fontSizes.title,
      color: colors.ink,
    },
    subtitle: {
      marginTop: spacing.md,
      fontSize: fontSizes.md,
      color: colors.inkMutedLight,
      textTransform: 'uppercase',
      letterSpacing: letterSpacings.lg,
    },
    tabsRow: {
      marginTop: spacing.xxl,
      flexDirection: 'row',
      gap: spacing.md,
      padding: spacing.sm,
      borderRadius: radii.full,
      backgroundColor: colors.cream,
    },
    tabButton: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: spacing.xxl,
      borderRadius: radii.full,
      borderWidth: 1,
      borderColor: colors.creamLine,
      backgroundColor: colors.creamLight,
    },
    tabButtonActive: {
      backgroundColor: colors.inkStrong,
      borderColor: colors.inkStrong,
    },
    tabText: {
      fontSize: fontSizes.sm,
      color: colors.inkMuted,
      textTransform: 'uppercase',
      letterSpacing: letterSpacings.sm,
    },
    tabTextActive: {
      color: colors.highlight,
    },
    section: {
      marginTop: spacing.giant,
      gap: spacing.xl,
    },
    label: {
      fontSize: fontSizes.sm,
      textTransform: 'uppercase',
      letterSpacing: letterSpacings.md,
      color: colors.inkSoft,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.xxl,
      paddingHorizontal: spacing.xxxl,
      backgroundColor: colors.creamCard,
      borderRadius: dimensions.modal.inputRadius,
    },
    input: {
      flex: 1,
      fontSize: fontSizes.lg,
      color: colors.ink,
    },
    unit: {
      fontSize: fontSizes.md,
      color: colors.inkSoft,
    },
    segmentedRow: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    goalRow: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    goalCol: {
      flex: 1,
      minWidth: 0,
      gap: spacing.sm,
    },
    rangeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    rangeCol: {
      flex: 1,
      minWidth: 0,
    },
    segment: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: spacing.xxl,
      borderRadius: radii.md,
      backgroundColor: colors.cream,
    },
    segmentActive: {
      backgroundColor: colors.inkStrong,
    },
    segmentText: {
      fontSize: fontSizes.sm,
      color: colors.inkMuted,
      textTransform: 'uppercase',
      letterSpacing: letterSpacings.sm,
    },
    segmentTextActive: {
      color: colors.highlight,
    },
    themeChip: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xl,
      paddingHorizontal: spacing.lg,
      borderRadius: radii.full,
      borderWidth: 1,
      minWidth: 68,
    },
    themeChipActive: {
      borderColor: colors.inkStrong,
    },
    themeChipActiveDark: {
      borderColor: colors.highlight,
    },
    themeChipText: {
      fontSize: fontSizes.sm,
      textTransform: 'uppercase',
      letterSpacing: letterSpacings.sm,
    },
    themeChipTextActive: {},
    chipsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
    },
    helper: {
      marginTop: spacing.sm,
      fontSize: fontSizes.sm,
      color: colors.inkMuted,
      letterSpacing: letterSpacings.sm,
    },
    rangeCurrent: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.lg,
      borderRadius: radii.full,
      backgroundColor: colors.cream,
    },
    rangeCurrentText: {
      fontSize: fontSizes.sm,
      color: colors.inkMuted,
      textTransform: 'uppercase',
      letterSpacing: letterSpacings.sm,
    },
    actionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.xxlLarge,
      gap: spacing.lg,
    },
    actionButton: {
      flex: 1,
      borderRadius: radii.md,
    },
  })
