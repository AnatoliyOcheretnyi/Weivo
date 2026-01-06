import { StyleSheet } from 'react-native';

import type { ThemeColors } from '@/theme';
import { dimensions } from '@/theme/dimensions';
import { fontSizes } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

export const createChartGridStyles = (colors: ThemeColors) =>
  StyleSheet.create({
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
