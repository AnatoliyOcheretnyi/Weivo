import { StyleSheet } from 'react-native'
import type { ThemeColors } from '@/theme/colors'
import { spacing } from '@/theme/spacing'
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography'

export const createWelcomeScreenStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.cream,
      paddingHorizontal: spacing.xMassive,
      paddingTop: spacing.hugePlus,
      paddingBottom: spacing.xMassive,
      justifyContent: 'space-between',
      overflow: 'hidden',
    },
    content: {
      gap: spacing.massive,
      zIndex: 1,
    },
    title: {
      color: colors.inkStrong,
      fontFamily: fontFamilies.display,
      fontSize: fontSizes.displayLg,
      letterSpacing: letterSpacings.lg,
      textTransform: 'uppercase',
    },
    subtitle: {
      color: colors.inkMuted,
      fontFamily: fontFamilies.display,
      fontSize: fontSizes.xl,
      lineHeight: 24,
      letterSpacing: letterSpacings.sm,
    },
    body: {
      color: colors.inkMutedAlt,
      fontFamily: fontFamilies.display,
      fontSize: fontSizes.lg,
      lineHeight: 22,
      letterSpacing: letterSpacings.xs,
    },
    actions: {
      gap: spacing.huge,
      zIndex: 1,
    },
  })
