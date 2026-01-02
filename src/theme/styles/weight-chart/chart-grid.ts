import { StyleSheet } from 'react-native';

import { colors } from '../../colors';
import { dimensions } from '../../dimensions';
import { fontSizes } from '../../typography';
import { spacing } from '../../spacing';

export const chartGridStyles = StyleSheet.create({
  grid: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: dimensions.chart.framePaddingVertical,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.creamLine,
  },
  label: {
    position: 'absolute',
    left: spacing.lg,
    fontSize: fontSizes.sm,
    color: colors.inkMuted,
    fontWeight: '600',
  },
});
