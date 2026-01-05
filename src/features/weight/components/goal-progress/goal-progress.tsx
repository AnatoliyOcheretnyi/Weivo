import { useEffect, useMemo } from 'react';
import { Text, View } from 'react-native';
import { Canvas, Circle, Path, Skia } from '@shopify/react-native-skia';
import { Easing, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';

import { useAppTheme } from '@/theme';
import type { GoalProgressProps } from './types';
import { createGoalProgressStyles } from './styles';

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function GoalProgress({ currentKg, targetKg }: GoalProgressProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createGoalProgressStyles(colors), [colors]);
  const progress = targetKg > 0 ? clamp(currentKg / targetKg, 0, 1) : 0;
  const size = 84;
  const stroke = 8;
  const inset = stroke / 2;
  const radius = (size - stroke) / 2;
  const progressValue = useSharedValue(0);

  useEffect(() => {
    progressValue.value = withTiming(progress, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, progressValue]);

  const arcPath = useDerivedValue(() => {
    const path = Skia.Path.Make();
    path.addArc(
      { x: inset, y: inset, width: size - stroke, height: size - stroke },
      -90,
      progressValue.value * 360
    );
    return path;
  }, [inset, size, stroke, progressValue]);

  return (
    <View style={styles.container}>
      <View style={styles.canvasWrap}>
        <Canvas style={{ width: size, height: size }}>
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
        </Canvas>
        <View style={{ position: 'absolute', alignItems: 'center' }}>
          <View style={styles.centerRow}>
            <Text style={styles.centerText}>{currentKg.toFixed(1)}</Text>
            <Text style={styles.centerUnit}>/ {targetKg.toFixed(0)}kg</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
