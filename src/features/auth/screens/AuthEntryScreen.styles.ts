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
      fontSize: fontSizes.xl,
      lineHeight: 24,
      letterSpacing: letterSpacings.xs,
    },
    actions: {
      gap: spacing.huge,
    },
  })
