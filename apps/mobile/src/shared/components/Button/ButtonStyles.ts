import { StyleSheet } from 'react-native'
import { radii } from '@/theme/radii'
import { spacing } from '@/theme/spacing'
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography'
export const buttonStyles = StyleSheet.create({
  button: {
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  text: {
    textTransform: 'uppercase',
    letterSpacing: letterSpacings.sm,
    fontFamily: fontFamilies.display,
  },
  md: {
    paddingVertical: spacing.huge,
    paddingHorizontal: spacing.xl,
  },
  sm: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  mdText: {
    fontSize: fontSizes.md,
  },
  smText: {
    fontSize: fontSizes.sm,
  },
  disabled: {
    opacity: 0.55,
  },
})
