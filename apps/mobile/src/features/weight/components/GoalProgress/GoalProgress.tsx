import { Canvas, Circle, Path, Skia } from '@shopify/react-native-skia'
import { useMemo } from 'react'
import { Text, View } from 'react-native'
import { clamp, formatKg } from '@/shared/utils'
import { useAppTheme } from '@/theme'
import { useTexts } from '@/i18n'
import {
  GOAL_PROGRESS_CHECK_STROKE,
  GOAL_PROGRESS_SIZE,
  GOAL_PROGRESS_STROKE,
} from './GoalProgressConstants'
import { createGoalProgressStyles } from './GoalProgressStyles'
import type { GoalProgressProps } from './GoalProgressTypes'
import { useGoalProgressAnimation } from './UseGoalProgressAnimation'
export function GoalProgress({
  currentKg,
  startKg,
  targetKg,
  showSuccess = false,
  onSuccessComplete,
}: GoalProgressProps) {
  const { colors } = useAppTheme()
  const { texts } = useTexts()
  const styles = useMemo(() => createGoalProgressStyles(colors), [colors])
  const totalDelta = Math.abs(startKg - targetKg)
  const isGain = targetKg > startKg
  const rawProgress = isGain ? currentKg - startKg : startKg - currentKg
  const progressKg = totalDelta > 0 ? clamp(rawProgress, 0, totalDelta) : 0
  const progress = totalDelta > 0 ? clamp(progressKg / totalDelta, 0, 1) : 0
  const isAtStart = Math.abs(currentKg - startKg) < 0.05
  const displayProgress = progress === 0 && totalDelta > 0 && isAtStart ? 0.01 : progress
  const size = GOAL_PROGRESS_SIZE
  const stroke = GOAL_PROGRESS_STROKE
  const radius = (size - stroke) / 2
  const { arcPath } = useGoalProgressAnimation({
    displayProgress,
    showSuccess,
    onSuccessComplete,
    size,
    stroke,
  })
  const checkPath = useMemo(() => {
    const path = Skia.Path.Make()
    path.moveTo(size * 0.3, size * 0.53)
    path.lineTo(size * 0.45, size * 0.66)
    path.lineTo(size * 0.72, size * 0.38)
    return path
  }, [size])
  const progressLabel =
    totalDelta > 0
      ? `${formatKg(progressKg)}/${formatKg(totalDelta)}${texts.home.units.kg}`
      : '--'
  return (
    <View style={styles.container}>
      <View style={styles.canvasWrap}>
        <Canvas style={styles.canvas}>
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
              strokeWidth={GOAL_PROGRESS_CHECK_STROKE}
              strokeCap="round"
              strokeJoin="round"
            />
          )}
        </Canvas>
        <View style={styles.overlay}>
          {!showSuccess && <Text style={styles.centerText}>{progressLabel}</Text>}
        </View>
      </View>
    </View>
  )
}
