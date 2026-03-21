import { useCallback, useMemo, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { Canvas, Path, Skia } from '@shopify/react-native-skia'
import { useAppTheme } from '@/theme'
import { useTexts } from '@/i18n'
import type { GoalSegment } from '../../data/goal-segments/types'
import type { GoalSegmentTrackProps } from './GoalSegmentTrackTypes'
import { createGoalSegmentTrackStyles } from './GoalSegmentTrackStyles'
import { GOAL_SEGMENT_STROKE_WIDTH } from './GoalSegmentTrackConstants'
import { clamp, formatKg } from '@/shared/utils'
import { useGoalSegmentLayout } from './UseGoalSegmentLayout'
export function GoalSegmentTrack({
  segments,
  currentKg,
  showAddNode = false,
  onAddPress,
  allowSegmentPress = true,
}: GoalSegmentTrackProps) {
  const { colors } = useAppTheme()
  const { texts } = useTexts()
  const router = useRouter()
  const [containerWidth, setContainerWidth] = useState(0)
  const { ordered, nodes, points, height, availableWidth } = useGoalSegmentLayout({
    segments,
    currentKg,
    showAddNode,
    containerWidth,
  })
  const styles = useMemo(
    () => createGoalSegmentTrackStyles(colors, { width: availableWidth, height }),
    [availableWidth, colors, height]
  )
  const pointPositions = useMemo(
    () =>
      points.map((point) => ({
        left: point.x,
        top: point.y,
      })),
    [points]
  )
  const getProgress = useCallback((segmentStart: number, segmentTarget: number, direction: string) => {
    if (currentKg == null) {
      return 0
    }
    if (direction === 'gain') {
      const total = segmentTarget - segmentStart
      return total > 0 ? clamp((currentKg - segmentStart) / total, 0, 1) : 0
    }
    const total = segmentStart - segmentTarget
    return total > 0 ? clamp((segmentStart - currentKg) / total, 0, 1) : 0
  }, [currentKg])
  const basePath = useMemo(() => {
    if (points.length === 0) {
      return Skia.Path.Make()
    }
    const path = Skia.Path.Make()
    path.moveTo(points[0].cx, points[0].cy)
    for (let i = 1; i < points.length; i += 1) {
      path.lineTo(points[i].cx, points[i].cy)
    }
    return path
  }, [points])
  const progressPath = useMemo(() => {
    if (points.length === 0) {
      return Skia.Path.Make()
    }
    const reachedTarget = (segment: GoalSegment) =>
      segment.direction === 'gain'
        ? currentKg != null && currentKg >= segment.targetKg
        : currentKg != null && currentKg <= segment.targetKg
    const firstOpenIndex = ordered.findIndex(
      (segment) => !segment.completedAtISO && !reachedTarget(segment)
    )
    const completedEdgeCount =
      firstOpenIndex === -1 ? ordered.length - 1 : firstOpenIndex - 1
    const path = Skia.Path.Make()
    path.moveTo(points[0].cx, points[0].cy)
    if (completedEdgeCount >= 0) {
      for (let i = 0; i <= completedEdgeCount; i += 1) {
        path.lineTo(points[i + 1].cx, points[i + 1].cy)
      }
    }
    if (firstOpenIndex >= 0 && firstOpenIndex < ordered.length) {
      const segment = ordered[firstOpenIndex]
      const progress = getProgress(segment.startKg, segment.targetKg, segment.direction)
      const start = points[firstOpenIndex]
      const end = points[firstOpenIndex + 1]
      const nx = start.cx + (end.cx - start.cx) * progress
      const ny = start.cy + (end.cy - start.cy) * progress
      path.lineTo(nx, ny)
    }
    return path
  }, [currentKg, getProgress, ordered, points])
  const activeNodeIndex = useMemo(() => {
    const segmentNodes = nodes.filter((node) => node.type !== 'add')
    if (segmentNodes.length === 0) {
      return -1
    }
    const reachedTarget = (segment: GoalSegment) =>
      segment.direction === 'gain'
        ? currentKg != null && currentKg >= segment.targetKg
        : currentKg != null && currentKg <= segment.targetKg
    const firstOpenIndex = ordered.findIndex((segment) => !segment.completedAtISO)
    if (firstOpenIndex === -1) {
      return segmentNodes.length - 1
    }
    const isReached = reachedTarget(ordered[firstOpenIndex])
    return Math.min(firstOpenIndex + (isReached ? 1 : 0), segmentNodes.length - 1)
  }, [currentKg, nodes, ordered])
  return (
    <View
      style={styles.container}
      onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}>
      {ordered.length === 0 && !showAddNode ? (
        <Text style={styles.labelText}>{texts.segments.empty}</Text>
      ) : (
      <View style={styles.trackLayer}>
        <Canvas style={styles.canvas}>
          <Path
            path={basePath}
            style="stroke"
            color={colors.creamLine}
            strokeWidth={GOAL_SEGMENT_STROKE_WIDTH}
            strokeJoin="round"
            strokeCap="round"
          />
          <Path
            path={progressPath}
            style="stroke"
            color={colors.accentOrange}
            strokeWidth={GOAL_SEGMENT_STROKE_WIDTH}
            strokeJoin="round"
            strokeCap="round"
          />
        </Canvas>
        {points.map((point, index) => {
          const segment = point.segment
          const isAdd = point.type === 'add'
          const isStart = point.type === 'start'
          const reachedTarget = !isStart && segment
            ? segment.direction === 'gain'
              ? currentKg != null && currentKg >= segment.targetKg
              : currentKg != null && currentKg <= segment.targetKg
            : false
          const isCompleted = isStart
            ? activeNodeIndex > 0
            : Boolean(segment?.completedAtISO) || reachedTarget
          const isActive = !isAdd && point.index === activeNodeIndex
          const handlePress = () => {
            if (isAdd) {
              onAddPress?.()
              return
            }
            if (!allowSegmentPress) {
              return
            }
            if (!segment) {
              return
            }
            router.push({
              pathname: '/segment-detail',
              params: { id: segment.id },
            })
          }
          return (
            <Pressable
              key={point.id}
              onPress={handlePress}
              disabled={!segment && !isAdd}
              style={[
                styles.segmentWrap,
                pointPositions[index],
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
          )
        })}
      </View>
      )}
    </View>
  )
}
