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

export function GoalSegmentTrack({
  segments,
  currentKg,
  showAddNode = false,
  onAddPress,
  allowSegmentPress = true,
}: GoalSegmentTrackProps) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createGoalSegmentTrackStyles(colors), [colors]);
  const { texts } = useTexts();
  const router = useRouter();
  const [containerWidth, setContainerWidth] = useState(0);
  const ordered = useMemo(
    () => [...segments].sort((a, b) => a.createdAtISO.localeCompare(b.createdAtISO)),
    [segments]
  );

  const dotSize = 36;
  const lineWidth = 40;
  const gap = 6;
  const rowGap = 18;
  const availableWidth = containerWidth || Dimensions.get('window').width - 48;
  const itemWidth = dotSize + lineWidth + gap;
  const itemsPerRow = Math.max(2, Math.floor((availableWidth + gap) / itemWidth));
  const nodes = useMemo(() => {
    if (ordered.length === 0 && !showAddNode) {
      return [];
    }
    const startValue =
      ordered.length > 0
        ? ordered[0].startKg
        : currentKg != null
          ? currentKg
          : 0;
    const baseNodes = [
      {
        id: ordered.length > 0 ? `start-${ordered[0].id}` : 'start',
        value: startValue,
        segmentIndex: null as number | null,
        type: 'start' as const,
      },
      ...ordered.map((segment, index) => ({
        id: segment.id,
        value: segment.targetKg,
        segmentIndex: index,
        segment,
        type: 'segment' as const,
      })),
    ];
    if (!showAddNode) {
      return baseNodes;
    }
    return [
      ...baseNodes,
      {
        id: 'add',
        value: null as number | null,
        segmentIndex: null as number | null,
        type: 'add' as const,
      },
    ];
  }, [currentKg, ordered, showAddNode]);
  const rowCount = Math.max(1, Math.ceil(nodes.length / itemsPerRow));
  const height = rowCount * dotSize + (rowCount - 1) * rowGap;

  const points = useMemo(() => {
    return nodes.map((node, index) => {
      const row = Math.floor(index / itemsPerRow);
      const col = index % itemsPerRow;
      const isReversed = row % 2 === 1;
      const x = isReversed
        ? availableWidth - dotSize - col * itemWidth
        : col * itemWidth;
      const y = row * (dotSize + rowGap);
      return {
        id: node.id,
        segment: node.segment,
        segmentIndex: node.segmentIndex,
        value: node.value,
        type: node.type,
        index,
        row,
        x,
        y,
        cx: x + dotSize / 2,
        cy: y + dotSize / 2,
      };
    });
  }, [availableWidth, dotSize, itemWidth, itemsPerRow, nodes, rowGap]);

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
    const firstOpenIndex = ordered.findIndex(
      (segment) => !segment.completedAtISO && !reachedTarget(segment)
    );
    const completedEdgeCount =
      firstOpenIndex === -1 ? ordered.length - 1 : firstOpenIndex - 1;
    const path = Skia.Path.Make();
    path.moveTo(points[0].cx, points[0].cy);
    if (completedEdgeCount >= 0) {
      for (let i = 0; i <= completedEdgeCount; i += 1) {
        path.lineTo(points[i + 1].cx, points[i + 1].cy);
      }
    }
    if (firstOpenIndex >= 0 && firstOpenIndex < ordered.length) {
      const segment = ordered[firstOpenIndex];
      const progress = getProgress(segment.startKg, segment.targetKg, segment.direction);
      const start = points[firstOpenIndex];
      const end = points[firstOpenIndex + 1];
      const nx = start.cx + (end.cx - start.cx) * progress;
      const ny = start.cy + (end.cy - start.cy) * progress;
      path.lineTo(nx, ny);
    }
    return path;
  }, [currentKg, ordered, points]);

  const activeNodeIndex = useMemo(() => {
    const segmentNodes = nodes.filter((node) => node.type !== 'add');
    if (segmentNodes.length === 0) {
      return -1;
    }
    const reachedTarget = (segment: GoalSegment) =>
      segment.direction === 'gain'
        ? currentKg != null && currentKg >= segment.targetKg
        : currentKg != null && currentKg <= segment.targetKg;
    const firstOpenIndex = ordered.findIndex((segment) => !segment.completedAtISO);
    if (firstOpenIndex === -1) {
      return segmentNodes.length - 1;
    }
    const isReached = reachedTarget(ordered[firstOpenIndex]);
    return Math.min(firstOpenIndex + (isReached ? 1 : 0), segmentNodes.length - 1);
  }, [currentKg, nodes, ordered]);

  return (
    <View
      style={styles.container}
      onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}>
      {ordered.length === 0 && !showAddNode ? (
        <Text style={styles.labelText}>{texts.segments.empty}</Text>
      ) : (
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
          const isAdd = point.type === 'add';
          const isStart = point.type === 'start';
          const reachedTarget = !isStart && segment
            ? segment.direction === 'gain'
              ? currentKg != null && currentKg >= segment.targetKg
              : currentKg != null && currentKg <= segment.targetKg
            : false;
          const isCompleted = isStart
            ? activeNodeIndex > 0
            : Boolean(segment?.completedAtISO) || reachedTarget;
          const isActive = !isAdd && point.index === activeNodeIndex;
          const handlePress = () => {
            if (isAdd) {
              onAddPress?.();
              return;
            }
            if (!allowSegmentPress) {
              return;
            }
            if (!segment) {
              return;
            }
            router.push({
              pathname: '/segment-detail',
              params: { id: segment.id },
            });
          };

          return (
            <Pressable
              key={point.id}
              onPress={handlePress}
              disabled={!segment && !isAdd}
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
                  isAdd && styles.addDot,
                  isCompleted && !isActive && styles.dotCompleted,
                  isActive && styles.dotActive,
                ]}>
                {isAdd ? (
                  <Text style={styles.addDotText}>+</Text>
                ) : (
                  <Text
                    style={[
                      styles.dotText,
                      (isActive || isCompleted) && styles.dotTextActive,
                    ]}>
                    {point.value != null ? formatKg(point.value) : ''}
                  </Text>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
      )}
    </View>
  );
}
