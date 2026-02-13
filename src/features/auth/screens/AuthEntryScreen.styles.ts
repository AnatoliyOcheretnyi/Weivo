import { StyleSheet } from 'react-native'
import type { ThemeColors } from '@/theme/colors'
import { spacing } from '@/theme/spacing'
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography'

export const createAuthEntryScreenStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.cream,
      paddingHorizontal: spacing.xMassive,
      paddingTop: spacing.hugePlus,
      paddingBottom: spacing.xMassive,
      justifyContent: 'space-between',
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.huge,
    },
    headerBackButton: {
      width: 36,
      height: 36,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.creamLine,
      backgroundColor: colors.creamCard,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      gap: spacing.massive,
    },
    title: {
      color: colors.inkStrong,
      fontFamily: fontFamilies.display,
      fontSize: fontSizes.displaySm,
      letterSpacing: letterSpacings.md,
      textTransform: 'uppercase',
    },
    body: {
      color: colors.inkMutedAlt,
      fontFamily: fontFamilies.display,
      fontSize: fontSizes.lg,
      lineHeight: 22,
      letterSpacing: letterSpacings.xs,
    },
    form: {
      gap: spacing.huge,
    },
    tabsRow: {
      flexDirection: 'row',
      backgroundColor: colors.creamLight,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.creamLine,
      padding: 4,
      gap: 4,
    },
    tabButton: {
      flex: 1,
      borderRadius: 10,
      paddingVertical: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabButtonActive: {
      backgroundColor: colors.inkStrong,
    },
    tabLabel: {
      color: colors.inkMuted,
      fontFamily: fontFamilies.display,
      fontSize: fontSizes.md,
      letterSpacing: letterSpacings.sm,
      textTransform: 'uppercase',
    },
    tabLabelActive: {
      color: colors.highlight,
    },
    helperText: {
      color: colors.inkMutedLight,
      fontFamily: fontFamilies.display,
      fontSize: fontSizes.sm,
      letterSpacing: letterSpacings.xs,
    },
    errorText: {
      color: colors.accentOrangeDark,
      fontFamily: fontFamilies.display,
      fontSize: fontSizes.sm,
      letterSpacing: letterSpacings.xs,
    },
    actions: {
      gap: spacing.huge,
    },
  })
