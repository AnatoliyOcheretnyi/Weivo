import { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  Canvas,
  Circle,
  Path,
  Skia,
} from '@shopify/react-native-skia';
import {
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

import { ChartFooter } from '../weight-chart/chart-footer';
import { ChartGrid } from '../weight-chart/chart-grid';
import { ChartHeader } from '../weight-chart/chart-header';
import { getWeightStats } from '../weight-chart/utils';
import { colors, dimensions } from '@/theme';
import { skiaWeightChartStyles } from '@/theme/styles/weight-chart/skia-weight-chart';
import { weightChartStyles } from '@/theme/styles/weight-chart/weight-chart';
import type { SkiaWeightChartProps } from './types';
import { clamp, exaggerateNormalized } from './utils';

export function SkiaWeightChart({ data }: SkiaWeightChartProps) {
  const [frameWidth, setFrameWidth] = useState(0);
  const translateX = useSharedValue(0);
  const startTranslateX = useSharedValue(0);
  const minTranslate = useSharedValue(0);
  const weightsValue = useSharedValue<number[]>([]);
  const minValue = useSharedValue(0);
  const rangeValue = useSharedValue(1);

  const { min, max, first, last } = useMemo(() => getWeightStats(data), [data]);
  const range = Math.max(max - min, 1);
  const pointGap = dimensions.chart.barWidth + dimensions.chart.barGap;
  const totalWidth = Math.max(1, (data.length - 1) * pointGap);
  const weights = useMemo(() => data.map((entry) => entry.weightKg), [data]);
  const formatAxisLabel = useCallback((value: number) => {
    const rounded = Math.round(value * 10) / 10;
    const label = rounded.toFixed(1);
    return label.endsWith('.0') ? label.slice(0, -2) : label;
  }, []);
  const initialAxisLabels = useMemo(() => {
    const mid = (min + max) / 2;
    return {
      top: formatAxisLabel(max),
      middle: formatAxisLabel(mid),
      bottom: formatAxisLabel(min),
    };
  }, [formatAxisLabel, max, min]);
  const [axisLabels, setAxisLabels] = useState(initialAxisLabels);
  const updateAxisLabels = useCallback(
    (nextMin: number, nextMax: number) => {
      const mid = (nextMin + nextMax) / 2;
      setAxisLabels({
        top: formatAxisLabel(nextMax),
        middle: formatAxisLabel(mid),
        bottom: formatAxisLabel(nextMin),
      });
    },
    [formatAxisLabel]
  );

  useEffect(() => {
    if (!frameWidth) {
      return;
    }
    const nextMinTranslate = Math.min(
      0,
      frameWidth - totalWidth - dimensions.chart.trailingSpacer
    );
    minTranslate.value = nextMinTranslate;
    translateX.value = nextMinTranslate;
  }, [frameWidth, totalWidth, translateX, minTranslate]);

  useEffect(() => {
    weightsValue.value = weights;
    minValue.value = min;
    rangeValue.value = range;
  }, [weights, min, range, weightsValue, minValue, rangeValue]);

  useEffect(() => {
    setAxisLabels(initialAxisLabels);
  }, [initialAxisLabels]);

  useAnimatedReaction(
    () => {
      if (!frameWidth || weightsValue.value.length === 0) {
        return null;
      }
      const startIndex = clamp(
        Math.floor(-translateX.value / pointGap) - 2,
        0,
        weightsValue.value.length - 1
      );
      const endIndex = clamp(
        startIndex + Math.ceil(frameWidth / pointGap) + 4,
        0,
        weightsValue.value.length - 1
      );
      let nextMin = weightsValue.value[startIndex];
      let nextMax = weightsValue.value[startIndex];
      for (let index = startIndex + 1; index <= endIndex; index += 1) {
        const weight = weightsValue.value[index];
        if (weight < nextMin) {
          nextMin = weight;
        }
        if (weight > nextMax) {
          nextMax = weight;
        }
      }
      return { min: nextMin, max: nextMax };
    },
    (result, previous) => {
      if (!result) {
        return;
      }
      if (
        previous &&
        Math.abs(previous.min - result.min) < 0.05 &&
        Math.abs(previous.max - result.max) < 0.05
      ) {
        return;
      }
      const nextRange = Math.max(result.max - result.min, 1);
      minValue.value = withTiming(result.min, { duration: 140 });
      rangeValue.value = withTiming(nextRange, { duration: 140 });
      runOnJS(updateAxisLabels)(result.min, result.max);
    },
    [frameWidth, pointGap, updateAxisLabels]
  );

  const linePath = useDerivedValue(() => {
    const path = Skia.Path.Make();
    if (!frameWidth || weightsValue.value.length === 0) {
      return path;
    }

    const startIndex = clamp(
      Math.floor(-translateX.value / pointGap) - 2,
      0,
      weightsValue.value.length - 1
    );
    const endIndex = clamp(
      startIndex + Math.ceil(frameWidth / pointGap) + 4,
      0,
      weightsValue.value.length - 1
    );
    const height = dimensions.chart.height;
    const padding = dimensions.chart.linePadding;

    for (let index = startIndex; index <= endIndex; index += 1) {
      const weight = weightsValue.value[index];
      const x = index * pointGap + translateX.value;
      const normalized = (weight - minValue.value) / rangeValue.value;
      const exaggerated = exaggerateNormalized(normalized, dimensions.chart.valueExaggeration);
      const y = padding + (1 - exaggerated) * (height - padding * 2);

      if (index === startIndex) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    }

    return path;
  });

  const latestX = useDerivedValue(() => {
    if (!frameWidth || weightsValue.value.length === 0) {
      return 0;
    }
    return (weightsValue.value.length - 1) * pointGap + translateX.value;
  }, [frameWidth, pointGap]);

  const latestY = useDerivedValue(() => {
    if (!frameWidth || weightsValue.value.length === 0) {
      return 0;
    }
    const padding = dimensions.chart.linePadding;
    const normalized =
      (weightsValue.value[weightsValue.value.length - 1] - minValue.value) / rangeValue.value;
    const exaggerated = exaggerateNormalized(normalized, dimensions.chart.valueExaggeration);
    return padding + (1 - exaggerated) * (dimensions.chart.height - padding * 2);
  }, [frameWidth]);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      startTranslateX.value = translateX.value;
    })
    .onUpdate((event) => {
      const nextValue = clamp(
        startTranslateX.value + event.translationX,
        minTranslate.value,
        0
      );
      translateX.value =
        translateX.value + (nextValue - translateX.value) * dimensions.chart.dragSmoothing;
    })
    .onEnd((event) => {
      translateX.value = withDecay({
        velocity: event.velocityX,
        clamp: [minTranslate.value, 0],
        deceleration: 0.997,
      });
    });

  return (
    <View style={weightChartStyles.card}>
      <ChartHeader min={min} max={max} total={data.length} />

      <View
        style={weightChartStyles.chartFrame}
        onLayout={(event) => setFrameWidth(event.nativeEvent.layout.width)}>
        <ChartGrid height={dimensions.chart.height} labels={axisLabels} />
        <GestureDetector gesture={panGesture}>
          <Canvas style={skiaWeightChartStyles.canvas}>
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
