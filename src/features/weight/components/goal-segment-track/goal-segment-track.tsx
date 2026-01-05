import { useMemo, useState } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';

import { useAppTheme } from '@/theme';
import { useTexts } from '@/i18n';
import type { GoalSegmentTrackProps } from './types';
import type { GoalSegment } from '../../data/goal-segments/types';
import { createGoalSegmentTrackStyles } from './styles';

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function GoalSegmentTrack({ segments, currentKg }: GoalSegmentTrackProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createGoalSegmentTrackStyles(colors), [colors]);
  const { texts } = useTexts();
  const router = useRouter();
  const [containerWidth, setContainerWidth] = useState(0);
  const ordered = useMemo(
    () => [...segments].sort((a, b) => a.createdAtISO.localeCompare(b.createdAtISO)),
    [segments]
  );
  const activeIndex = ordered.findIndex((segment) => !segment.completedAtISO);
  const lastIndex = ordered.length - 1;

  if (ordered.length === 0) {
    return (
      <Text style={styles.labelText}>{texts.segments.empty}</Text>
    );
  }

  const dotSize = 36;
  const lineWidth = 40;
  const gap = 6;
  const rowGap = 18;
  const availableWidth = containerWidth || Dimensions.get('window').width - 48;
  const itemWidth = dotSize + lineWidth + gap;
  const itemsPerRow = Math.max(2, Math.floor((availableWidth + gap) / itemWidth));
  const rowCount = Math.max(1, Math.ceil(ordered.length / itemsPerRow));
  const height = rowCount * dotSize + (rowCount - 1) * rowGap;

  const points = useMemo(() => {
    return ordered.map((segment, index) => {
      const row = Math.floor(index / itemsPerRow);
      const col = index % itemsPerRow;
      const isReversed = row % 2 === 1;
      const x = isReversed
        ? availableWidth - dotSize - col * itemWidth
        : col * itemWidth;
      const y = row * (dotSize + rowGap);
      return {
        id: segment.id,
        segment,
        index,
        row,
        x,
        y,
        cx: x + dotSize / 2,
        cy: y + dotSize / 2,
      };
    });
  }, [availableWidth, dotSize, itemWidth, ordered, itemsPerRow, rowGap]);

  const getProgress = (segmentStart: number, segmentTarget: number, direction: string) => {
    if (currentKg == null) {
      return 0;
    }
    if (direction === 'gain') {
      const total = segmentTarget - segmentStart;
      return total > 0 ? clamp((currentKg - segmentStart) / total, 0, 1) : 0;
    }
    const total = segmentStart - segmentTarget;
    return total > 0 ? clamp((segmentStart - currentKg) / total, 0, 1) : 0;
  };

  const formatKg = (value: number) => {
    const fixed = value.toFixed(1);
    return fixed.endsWith('.0') ? fixed.slice(0, -2) : fixed;
  };

  const basePath = useMemo(() => {
    if (points.length === 0) {
      return Skia.Path.Make();
    }
    const path = Skia.Path.Make();
    path.moveTo(points[0].cx, points[0].cy);
    for (let i = 1; i < points.length; i += 1) {
      path.lineTo(points[i].cx, points[i].cy);
    }
    return path;
  }, [points]);

  const progressPath = useMemo(() => {
    if (points.length === 0) {
      return Skia.Path.Make();
    }
    const reachedTarget = (segment: GoalSegment) =>
      segment.direction === 'gain'
        ? currentKg != null && currentKg >= segment.targetKg
        : currentKg != null && currentKg <= segment.targetKg;
    const firstOpenIndex = points.findIndex(
      (point) => !point.segment.completedAtISO && !reachedTarget(point.segment)
    );
    const completedEdgeCount = firstOpenIndex === -1 ? points.length - 1 : firstOpenIndex - 1;
    const path = Skia.Path.Make();
    path.moveTo(points[0].cx, points[0].cy);
    if (completedEdgeCount >= 0) {
      for (let i = 0; i <= completedEdgeCount; i += 1) {
        path.lineTo(points[i + 1].cx, points[i + 1].cy);
      }
    }
    if (firstOpenIndex >= 0 && firstOpenIndex < points.length - 1) {
      const segment = points[firstOpenIndex].segment;
      const progress = getProgress(segment.startKg, segment.targetKg, segment.direction);
      const start = points[firstOpenIndex];
      const end = points[firstOpenIndex + 1];
      const nx = start.cx + (end.cx - start.cx) * progress;
      const ny = start.cy + (end.cy - start.cy) * progress;
      path.lineTo(nx, ny);
    }
    return path;
  }, [currentKg, points]);

  return (
    <View
      style={styles.container}
      onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}>
      <View style={[styles.trackLayer, { height }]}>
        <Canvas style={[styles.canvas, { width: availableWidth, height }]}>
          <Path
            path={basePath}
            style="stroke"
            color={colors.creamLine}
            strokeWidth={3}
            strokeJoin="round"
            strokeCap="round"
          />
          <Path
            path={progressPath}
            style="stroke"
            color={colors.accentOrange}
            strokeWidth={3}
            strokeJoin="round"
            strokeCap="round"
          />
        </Canvas>
        {points.map((point) => {
          const segment = point.segment;
          const reachedTarget =
            segment.direction === 'gain'
              ? currentKg != null && currentKg >= segment.targetKg
              : currentKg != null && currentKg <= segment.targetKg;
          const isCompleted = Boolean(segment.completedAtISO) || reachedTarget;
          const isActive = activeIndex === -1 ? point.index === lastIndex : point.index === activeIndex;
          const handlePress = () => {
            router.push({
              pathname: '/segment-detail',
              params: { id: segment.id },
            });
          };

          return (
            <Pressable
              key={segment.id}
              onPress={handlePress}
              style={[
                styles.segmentWrap,
                {
                  left: point.x,
                  top: point.y,
                },
              ]}>
              <View
                style={[
                  styles.dot,
                  isCompleted && styles.dotCompleted,
                  isActive && !isCompleted && styles.dotActive,
                ]}>
                <Text
                  style={[
                    styles.dotText,
                    (isActive || isCompleted) && styles.dotTextActive,
                  ]}>
                  {formatKg(segment.targetKg)}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
