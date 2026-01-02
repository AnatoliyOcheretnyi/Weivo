import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  Canvas,
  Circle,
  Path,
  Skia,
} from '@shopify/react-native-skia';
import {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withDelay,
  withTiming,
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
  const introProgress = useSharedValue(1);
  const hasAnimatedIntro = useRef(false);

  const { min, max, first, last } = useMemo(() => getWeightStats(data), [data]);
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
    if (!hasAnimatedIntro.current && weights.length > 1) {
      hasAnimatedIntro.current = true;
      const length = weights.length;
      const visiblePoints = Math.max(2, Math.floor(frameWidth / pointGap));
      const introPoints = Math.min(
        dimensions.chart.introPointCount + dimensions.chart.introExtraPoints,
        visiblePoints,
        length
      );
      const introStartIndex = Math.max(length - introPoints, 0);
      const windowStartIndex = clamp(
        Math.floor(-nextMinTranslate / pointGap) - 2,
        0,
        length - 1
      );
      const windowEndIndex = clamp(
        windowStartIndex + Math.ceil(frameWidth / pointGap) + 4,
        0,
        length - 1
      );
      let nextMin = weights[windowStartIndex];
      let nextMax = weights[windowStartIndex];
      for (let index = windowStartIndex + 1; index <= windowEndIndex; index += 1) {
        const weight = weights[index];
        if (weight < nextMin) {
          nextMin = weight;
        }
        if (weight > nextMax) {
          nextMax = weight;
        }
      }
      minValue.value = nextMin;
      rangeValue.value = Math.max(nextMax - nextMin, 1);
      updateAxisLabels(nextMin, nextMax);
      introProgress.value = 0;
      introProgress.value = withDelay(
        dimensions.chart.introDelayMs,
        withTiming(1, {
          duration: dimensions.chart.introDurationMs,
          easing: Easing.linear,
        })
      );
    }
  }, [
    frameWidth,
    totalWidth,
    translateX,
    minTranslate,
    weights.length,
    introProgress,
    pointGap,
    weights,
    updateAxisLabels,
    minValue,
    rangeValue,
  ]);

  useEffect(() => {
    weightsValue.value = weights;
  }, [weights, weightsValue]);

  useEffect(() => {
    setAxisLabels(initialAxisLabels);
  }, [initialAxisLabels]);

  useAnimatedReaction(
    () => {
      if (!frameWidth || weightsValue.value.length === 0) {
        return null;
      }
      if (introProgress.value < 1) {
        return null;
      }
      const length = weightsValue.value.length;
      const visiblePoints = Math.max(2, Math.floor(frameWidth / pointGap));
      const introPoints = Math.min(
        dimensions.chart.introPointCount + dimensions.chart.introExtraPoints,
        visiblePoints,
        length
      );
      const introStartIndex = Math.max(length - introPoints, 0);
      const isIntro = introProgress.value < 1;
      const windowStartIndex = clamp(
        Math.floor(-translateX.value / pointGap) - 2,
        0,
        length - 1
      );
      const windowEndIndex = clamp(
        windowStartIndex + Math.ceil(frameWidth / pointGap) + 4,
        0,
        length - 1
      );
      const rangeStartIndex = isIntro ? introStartIndex : windowStartIndex;
      const rangeEndIndex = isIntro
        ? Math.min(introStartIndex + introPoints - 1, length - 1)
        : windowEndIndex;
      let nextMin = weightsValue.value[rangeStartIndex];
      let nextMax = weightsValue.value[rangeStartIndex];
      for (let index = rangeStartIndex + 1; index <= rangeEndIndex; index += 1) {
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
    [frameWidth, pointGap, translateX, introProgress, updateAxisLabels]
  );

  const linePath = useDerivedValue(() => {
    if (!frameWidth || weightsValue.value.length === 0) {
      return Skia.Path.Make();
    }
    const length = weightsValue.value.length;
    const visiblePoints = Math.max(2, Math.floor(frameWidth / pointGap));
    const introPoints = Math.min(
      dimensions.chart.introPointCount + dimensions.chart.introExtraPoints,
      visiblePoints,
      length
    );
    const introStartIndex = Math.max(length - introPoints, 0);
    const isIntro = introProgress.value < 1;
    const windowStartIndex = clamp(
      Math.floor(-translateX.value / pointGap) - 2,
      0,
      length - 1
    );
    const windowEndIndex = clamp(
      windowStartIndex + Math.ceil(frameWidth / pointGap) + 4,
      0,
      length - 1
    );
    const startIndex = isIntro ? introStartIndex : windowStartIndex;
    const endIndex = isIntro
      ? Math.min(introStartIndex + introPoints - 1, length - 1)
      : windowEndIndex;
    const path = Skia.Path.Make();
    const height = dimensions.chart.height;
    const padding = dimensions.chart.linePadding;
    const getPoint = (index: number) => {
      const weight = weightsValue.value[index];
      const x = index * pointGap + translateX.value;
      const normalized = (weight - minValue.value) / rangeValue.value;
      const exaggerated = exaggerateNormalized(normalized, dimensions.chart.valueExaggeration);
      const y = padding + (1 - exaggerated) * (height - padding * 2);
      return { x, y };
    };

    if (isIntro) {
      const segmentCount = Math.max(introPoints - 1, 1);
      const segmentProgress = introProgress.value * segmentCount;
      const headIndex = Math.floor(segmentProgress);
      const t = segmentProgress - headIndex;
      const lastIndex = clamp(introStartIndex + headIndex, startIndex, endIndex);

      for (let index = startIndex; index <= lastIndex; index += 1) {
        const { x, y } = getPoint(index);
        if (index === startIndex) {
          path.moveTo(x, y);
        } else {
          path.lineTo(x, y);
        }
      }

      if (t > 0 && lastIndex < endIndex) {
        const current = getPoint(lastIndex);
        const next = getPoint(lastIndex + 1);
        const x = current.x + (next.x - current.x) * t;
        const y = current.y + (next.y - current.y) * t;
        path.lineTo(x, y);
      }

      return path;
    }

    for (let index = startIndex; index <= endIndex; index += 1) {
      const { x, y } = getPoint(index);
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
    const length = weightsValue.value.length;
    if (introProgress.value < 1) {
      const visiblePoints = Math.max(2, Math.floor(frameWidth / pointGap));
      const introPoints = Math.min(
        dimensions.chart.introPointCount + dimensions.chart.introExtraPoints,
        visiblePoints,
        length
      );
      const introStartIndex = Math.max(length - introPoints, 0);
      const segmentCount = Math.max(introPoints - 1, 1);
      const segmentProgress = introProgress.value * segmentCount;
      const baseIndex = Math.floor(segmentProgress);
      const t = segmentProgress - baseIndex;
      const currentIndex = clamp(introStartIndex + baseIndex, 0, length - 1);
      return (currentIndex + t) * pointGap + translateX.value;
    }
    return (length - 1) * pointGap + translateX.value;
  }, [frameWidth, pointGap]);

  const latestY = useDerivedValue(() => {
    if (!frameWidth || weightsValue.value.length === 0) {
      return 0;
    }
    const padding = dimensions.chart.linePadding;
    const height = dimensions.chart.height;
    const length = weightsValue.value.length;
    if (introProgress.value < 1) {
      const visiblePoints = Math.max(2, Math.floor(frameWidth / pointGap));
      const introPoints = Math.min(
        dimensions.chart.introPointCount + dimensions.chart.introExtraPoints,
        visiblePoints,
        length
      );
      const introStartIndex = Math.max(length - introPoints, 0);
      const segmentCount = Math.max(introPoints - 1, 1);
      const segmentProgress = introProgress.value * segmentCount;
      const baseIndex = Math.floor(segmentProgress);
      const t = segmentProgress - baseIndex;
      const currentIndex = clamp(introStartIndex + baseIndex, 0, length - 1);
      const nextIndex = clamp(currentIndex + 1, 0, length - 1);
      const currentWeight = weightsValue.value[currentIndex];
      const nextWeight = weightsValue.value[nextIndex];
      const interpolatedWeight = currentWeight + (nextWeight - currentWeight) * t;
      const normalized = (interpolatedWeight - minValue.value) / rangeValue.value;
      const exaggerated = exaggerateNormalized(normalized, dimensions.chart.valueExaggeration);
      return padding + (1 - exaggerated) * (height - padding * 2);
    }
    const weight = weightsValue.value[length - 1];
    const normalized = (weight - minValue.value) / rangeValue.value;
    const exaggerated = exaggerateNormalized(normalized, dimensions.chart.valueExaggeration);
    return padding + (1 - exaggerated) * (height - padding * 2);
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
