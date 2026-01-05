import { Canvas, Circle, Path, Skia } from '@shopify/react-native-skia';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Text, View } from 'react-native';
import {
  Easing,
  runOnJS,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useAppTheme } from '@/theme';
import { createGoalProgressStyles } from './styles';
import type { GoalProgressProps } from './types';

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function GoalProgress({
  currentKg,
  startKg,
  targetKg,
  showSuccess = false,
  onSuccessComplete,
}: GoalProgressProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createGoalProgressStyles(colors), [colors]);
  const totalDelta = Math.abs(startKg - targetKg);
  const isGain = targetKg > startKg;
  const rawProgress = isGain ? currentKg - startKg : startKg - currentKg;
  const progressKg = totalDelta > 0 ? clamp(rawProgress, 0, totalDelta) : 0;
  const progress = totalDelta > 0 ? clamp(progressKg / totalDelta, 0, 1) : 0;
  const displayProgress = progress === 0 && totalDelta > 0 ? 0.01 : progress;
  const size = 84;
  const stroke = 8;
  const inset = stroke / 2;
  const radius = (size - stroke) / 2;
  const progressValue = useSharedValue(0);
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleSuccessComplete = useCallback(() => {
    if (!onSuccessComplete) {
      return;
    }
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }
    successTimeoutRef.current = setTimeout(() => {
      onSuccessComplete();
    }, 450);
  }, [onSuccessComplete]);

  useEffect(() => {
    if (showSuccess) {
      progressValue.value = 0;
      progressValue.value = withTiming(
        1,
        {
          duration: 650,
          easing: Easing.out(Easing.cubic),
        },
        (finished) => {
          if (finished) {
            runOnJS(scheduleSuccessComplete)();
          }
        }
      );
      return;
    }
    progressValue.value = withTiming(displayProgress, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });
  }, [displayProgress, progressValue, scheduleSuccessComplete, showSuccess]);

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  const arcPath = useDerivedValue(() => {
    const path = Skia.Path.Make();
    path.addArc(
      { x: inset, y: inset, width: size - stroke, height: size - stroke },
      -90,
      progressValue.value * 360
    );
    return path;
  }, [inset, size, stroke, progressValue]);

  const checkPath = useMemo(() => {
    const path = Skia.Path.Make();
    path.moveTo(size * 0.3, size * 0.53);
    path.lineTo(size * 0.45, size * 0.66);
    path.lineTo(size * 0.72, size * 0.38);
    return path;
  }, [size]);

  const formatKg = (value: number) => {
    const fixed = value.toFixed(1);
    return fixed.endsWith('.0') ? fixed.slice(0, -2) : fixed;
  };
  const progressLabel = totalDelta > 0 ? `${formatKg(progressKg)}/${formatKg(totalDelta)}kg` : '--';

  return (
    <View style={styles.container}>
      <View style={styles.canvasWrap}>
        <Canvas style={{ width: size, height: size }}>
          {showSuccess && (
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              color={colors.accentOrange}
            />
          )}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            color={colors.creamLine}
            style="stroke"
            strokeWidth={stroke}
          />
          <Path
            path={arcPath}
            color={colors.accentOrange}
            style="stroke"
            strokeWidth={stroke}
            strokeCap="round"
          />
          {showSuccess && (
            <Path
              path={checkPath}
              color={colors.highlight}
              style="stroke"
              strokeWidth={4}
              strokeCap="round"
              strokeJoin="round"
            />
          )}
        </Canvas>
        <View style={{ position: 'absolute', alignItems: 'center' }}>
          {!showSuccess && <Text style={styles.centerText}>{progressLabel}</Text>}
        </View>
      </View>
    </View>
  );
}
