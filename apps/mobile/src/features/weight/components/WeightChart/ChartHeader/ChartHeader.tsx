import { useMemo } from 'react'
import { Text, View } from 'react-native'
import type { ChartHeaderProps } from './ChartHeaderTypes'
import { useAppTheme } from '@/theme'
import { createChartHeaderStyles } from './ChartHeaderStyles'
import { useTexts } from '@/i18n'
export function ChartHeader({ min, max, totalDays }: ChartHeaderProps) {
  const { texts } = useTexts()
  const { colors } = useAppTheme()
  const chartHeaderStyles = useMemo(() => createChartHeaderStyles(colors), [colors])
  return (
    <View style={chartHeaderStyles.headerRow}>
      <View>
        <Text style={chartHeaderStyles.title}>{texts.chart.title}</Text>
        <Text style={chartHeaderStyles.subtitle}>
          {totalDays} {texts.chart.subtitleSuffix}
        </Text>
      </View>
      <View style={chartHeaderStyles.rangePill}>
        <Text style={chartHeaderStyles.rangeText}>
          {min.toFixed(1)}-{max.toFixed(1)} {texts.chart.unit}
        </Text>
      </View>
    </View>
  )
}
