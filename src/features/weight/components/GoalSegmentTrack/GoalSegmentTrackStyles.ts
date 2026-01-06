import { StyleSheet } from 'react-native'
import type { ThemeColors } from '@/theme'
import { radii } from '@/theme/radii'
import { spacing } from '@/theme/spacing'
import { fontSizes, letterSpacings } from '@/theme/typography'
import { GOAL_SEGMENT_DOT_SIZE } from './GoalSegmentTrackConstants'
type GoalSegmentTrackLayout = {
  width: number;
  height: number;
};
export const createGoalSegmentTrackStyles = (
  colors: ThemeColors,
  layout: GoalSegmentTrackLayout
) =>
  StyleSheet.create({
    container: {
      gap: spacing.xl,
    },
    canvas: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: layout.width,
      height: layout.height,
    },
    trackRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      width: '100%',
    },
    trackRowReverse: {
      flexDirection: 'row-reverse',
      justifyContent: 'flex-start',
    },
    segmentWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      position: 'absolute',
    },
    segmentWrapReverse: {
      flexDirection: 'row-reverse',
    },
    dot: {
      width: GOAL_SEGMENT_DOT_SIZE,
      height: GOAL_SEGMENT_DOT_SIZE,
      borderRadius: radii.lg,
      backgroundColor: colors.creamLine,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dotActive: {
      backgroundColor: colors.inkStrong,
    },
    dotCompleted: {
      backgroundColor: colors.accentOrange,
    },
    addDot: {
      borderWidth: 1,
      borderColor: colors.creamLine,
      backgroundColor: colors.creamLight,
    },
    dotText: {
      fontSize: fontSizes.xs,
      color: colors.inkMuted,
      letterSpacing: letterSpacings.sm,
    },
    dotTextActive: {
      color: colors.highlight,
    },
    addDotText: {
      fontSize: fontSizes.md,
      color: colors.inkMuted,
    },
    trackLayer: {
      position: 'relative',
      width: '100%',
      height: layout.height,
    },
    labelsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    labelWrap: {
      minWidth: 72,
    },
    labelText: {
      fontSize: fontSizes.xs,
      color: colors.inkMuted,
      letterSpacing: letterSpacings.sm,
    },
  })
