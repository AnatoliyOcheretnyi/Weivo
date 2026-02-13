import { StyleSheet } from 'react-native'
import { spacing } from '@/theme/spacing'

export const authScreenContainerStyles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: spacing.xMassive,
    paddingTop: spacing.hugePlus,
    paddingBottom: spacing.xMassive,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
})
