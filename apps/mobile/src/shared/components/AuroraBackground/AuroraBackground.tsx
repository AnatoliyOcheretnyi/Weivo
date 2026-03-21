import { useEffect } from 'react'
import { StyleSheet, View, useWindowDimensions } from 'react-native'
import { Canvas, Circle, Group } from '@shopify/react-native-skia'
import {
  cancelAnimation,
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import { useAppTheme } from '@/theme'

const full = Math.PI * 2

const withAlpha = (hexColor: string, alpha: number) => {
  const normalized = hexColor.replace('#', '')
  const isShort = normalized.length === 3
  const expanded = isShort
    ? normalized
        .split('')
        .map((value) => `${value}${value}`)
        .join('')
    : normalized

  const red = Number.parseInt(expanded.slice(0, 2), 16)
  const green = Number.parseInt(expanded.slice(2, 4), 16)
  const blue = Number.parseInt(expanded.slice(4, 6), 16)

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

export function AuroraBackground() {
  const { colors } = useAppTheme()
  const { width, height } = useWindowDimensions()
  const phase = useSharedValue(0)

  useEffect(() => {
    phase.value = withRepeat(
      withTiming(full, {
        duration: 26000,
        easing: Easing.linear,
      }),
      -1,
      false
    )

    return () => cancelAnimation(phase)
  }, [phase])

  const blob1X = useDerivedValue(() => width * 0.2 + Math.sin(phase.value * 0.9) * width * 0.16)
  const blob1Y = useDerivedValue(() => height * 0.16 + Math.cos(phase.value * 0.7) * height * 0.06)

  const blob2X = useDerivedValue(() => width * 0.78 + Math.cos(phase.value * 0.8 + 0.7) * width * 0.14)
  const blob2Y = useDerivedValue(() => height * 0.34 + Math.sin(phase.value * 0.65 + 0.4) * height * 0.08)

  const blob3X = useDerivedValue(() => width * 0.42 + Math.sin(phase.value * 0.55 + 1.6) * width * 0.18)
  const blob3Y = useDerivedValue(() => height * 0.68 + Math.cos(phase.value * 0.75 + 0.3) * height * 0.07)

  if (!width || !height) {
    return null
  }

  return (
    <View pointerEvents="none" style={styles.layer}>
      <Canvas style={styles.canvas}>
        <Group>
          <Circle
            cx={blob1X}
            cy={blob1Y}
            r={Math.max(width, height) * 0.5}
            color={withAlpha(colors.accentOrangeSoft, 0.16)}
          />
          <Circle
            cx={blob2X}
            cy={blob2Y}
            r={Math.max(width, height) * 0.44}
            color={withAlpha(colors.accentGold, 0.14)}
          />
          <Circle
            cx={blob3X}
            cy={blob3Y}
            r={Math.max(width, height) * 0.52}
            color={withAlpha(colors.accentTeal, 0.08)}
          />
        </Group>
      </Canvas>
    </View>
  )
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
  },
  canvas: {
    flex: 1,
  },
})
