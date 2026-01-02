import { StyleSheet } from 'react-native';

import { colors } from '../../colors';
import { dimensions } from '../../dimensions';
import { radii } from '../../radii';
import { shadows } from '../../shadows';
import { spacing } from '../../spacing';

export const weightChartStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.creamWarm,
    borderRadius: radii.card,
    padding: spacing.mega,
    shadowColor: colors.ink,
    shadowOpacity: shadows.card.shadowOpacity,
    shadowRadius: shadows.card.shadowRadius,
    shadowOffset: shadows.card.shadowOffset,
  },
  chartFrame: {
    marginTop: spacing.mega,
    height: dimensions.chart.height + dimensions.chart.framePaddingVertical * 2,
    borderRadius: radii.xxl,
    backgroundColor: colors.creamCard,
    paddingVertical: dimensions.chart.framePaddingVertical,
    overflow: 'hidden',
  },
  chartContent: {
    paddingHorizontal: spacing.huge,
    alignItems: 'flex-end',
  },
  trailingSpacer: {
    width: dimensions.chart.trailingSpacer,
  },
  barSlot: {
    width: dimensions.chart.barWidth + dimensions.chart.barGap,
    height: dimensions.chart.height,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: dimensions.chart.barWidth,
    borderRadius: radii.xs,
  },
  currentDot: {
    position: 'absolute',
    width: spacing.xl,
    height: spacing.xl,
    borderRadius: radii.full,
    backgroundColor: colors.inkStrong,
  },
  currentGlow: {
    position: 'absolute',
    width: spacing.xxlLarge,
    height: spacing.xxlLarge,
    borderRadius: radii.full,
    backgroundColor: colors.glow,
  },
});
