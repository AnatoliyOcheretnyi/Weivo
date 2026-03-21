import { StyleSheet } from 'react-native'
import type { ThemeColors } from '@/theme'
import { fontFamilies, fontSizes, letterSpacings } from '@/theme/typography'
import { spacing } from '@/theme/spacing'
import { GOAL_PROGRESS_SIZE } from './GoalProgressConstants'
export const createGoalProgressStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
    },
    canvasWrap: {
      width: GOAL_PROGRESS_SIZE,
      height: GOAL_PROGRESS_SIZE,
      alignItems: 'center',
      justifyContent: 'center',
    },
    canvas: {
      width: GOAL_PROGRESS_SIZE,
      height: GOAL_PROGRESS_SIZE,
    },
    overlay: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    centerText: {
      fontSize: fontSizes.lg,
      color: colors.ink,
      fontFamily: fontFamilies.display,
      letterSpacing: letterSpacings.sm,
    },
  })
