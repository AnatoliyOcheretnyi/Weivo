import { StyleSheet } from 'react-native'
import { radii } from '@/theme/radii'
import { spacing } from '@/theme/spacing'
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography'
export const inputStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.lg,
    borderWidth: 1,
  },
  default: {
    paddingHorizontal: spacing.xMassive,
    paddingVertical: spacing.huge,
  },
  compact: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  input: {
    flex: 1,
    fontSize: fontSizes.input,
    fontFamily: fontFamilies.display,
    letterSpacing: letterSpacings.sm,
  },
  unit: {
    fontSize: fontSizes.md,
  },
})
