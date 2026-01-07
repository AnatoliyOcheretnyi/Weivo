import { StyleSheet } from 'react-native'
import type { ThemeColors } from '@/theme'
import { dimensions } from '@/theme/dimensions'
import { fontSizes, letterSpacings } from '@/theme/typography'
import { radii } from '@/theme/radii'
import { spacing } from '@/theme/spacing'
export const createEntriesStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.cream,
    },
    content: {
      padding: spacing.mega,
      paddingBottom: dimensions.entries.paddingBottom,
    },
    separator: {
      height: spacing.xxl,
    },
    header: {
      marginBottom: dimensions.explore.headerBottom,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: spacing.lg,
    },
    clearButton: {
      borderRadius: radii.full,
      borderWidth: 1,
      borderColor: colors.creamLine,
      backgroundColor: colors.creamLight,
      paddingHorizontal: spacing.xxl,
      paddingVertical: spacing.lg,
    },
    clearText: {
      fontSize: fontSizes.sm,
      color: colors.inkMuted,
      textTransform: 'uppercase',
      letterSpacing: letterSpacings.sm,
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
    rowContent: {
      backgroundColor: colors.creamLight,
      borderRadius: radii.xl,
      padding: dimensions.explore.rowPadding,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginRight: spacing.lg,
    },
    swipeContainer: {
      backgroundColor: colors.creamLine,
      borderRadius: radii.xl,
      overflow: 'hidden',
    },
    swipeContainerActive: {
      backgroundColor: colors.accentOrangeDark,
    },
    deleteAction: {
      width: 88,
      backgroundColor: colors.accentOrangeDark,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radii.xl,
    },
    deleteText: {
      color: colors.highlight,
      fontSize: fontSizes.sm,
      textTransform: 'uppercase',
      letterSpacing: letterSpacings.sm,
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
  })
