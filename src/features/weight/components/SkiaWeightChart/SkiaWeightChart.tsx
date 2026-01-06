import { useMemo } from 'react';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { Canvas, Circle, Path } from '@shopify/react-native-skia';

import { dimensions, useAppTheme } from '@/theme';
import { ChartFooter } from '../WeightChart/ChartFooter';
import { ChartGrid } from '../WeightChart/ChartGrid';
import { ChartHeader } from '../WeightChart/ChartHeader';
import { createWeightChartStyles } from '../WeightChart/WeightChartStyles';
import { skiaWeightChartStyles } from './SkiaWeightChartStyles';
import type { SkiaWeightChartProps } from './SkiaWeightChartTypes';
import { useSkiaWeightChart } from './UseSkiaWeightChart';

export function SkiaWeightChart({ data }: SkiaWeightChartProps) {
  if (data.length === 0) {
    return null;
  }
  const { colors, scheme } = useAppTheme();
  const weightChartStyles = useMemo(() => createWeightChartStyles(colors), [colors]);
  const {
    min,
    max,
    first,
    last,
    totalDays,
    axisLabels,
    linePath,
    latestX,
    latestY,
    panGesture,
    onFrameLayout,
  } = useSkiaWeightChart({ data });

  return (
    <View style={weightChartStyles.card}>
      <ChartHeader min={min} max={max} totalDays={totalDays} />

      <View style={weightChartStyles.chartFrame} onLayout={onFrameLayout}>
        <ChartGrid height={dimensions.chart.height} labels={axisLabels} />
        <GestureDetector gesture={panGesture}>
          <Canvas key={scheme} style={skiaWeightChartStyles.canvas}>
            <Path
              path={linePath}
              style="stroke"
              strokeWidth={dimensions.chart.lineWidth}
              color={colors.accentOrange}
            />
            <Circle
              cx={latestX}
              cy={latestY}
              r={dimensions.chart.currentGlowRadius}
              color={colors.glow}
            />
            <Circle
              cx={latestX}
              cy={latestY}
              r={dimensions.chart.currentDotRadius}
              color={colors.inkStrong}
            />
          </Canvas>
        </GestureDetector>
      </View>

      <ChartFooter first={first} last={last} />
    </View>
  );
}
