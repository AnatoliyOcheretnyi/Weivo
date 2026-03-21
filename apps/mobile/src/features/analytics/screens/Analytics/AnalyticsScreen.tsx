import { useEffect, useMemo, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useProfileStore } from '@/features/profile'
import { useWeightStore } from '@/features/weight'
import { useTexts } from '@/i18n'
import { useAppTheme } from '@/theme'
import { Actions, Screens, analyticsService } from '@/shared/services/analytics'
import { Button } from '@/shared/components/Button'
import { createAnalyticsStyles } from './AnalyticsScreen.styles'
import { getAnalyticsStats } from './AnalyticsScreenUtils'
type Mode = 'weight' | 'trend'
const formatWeight = (value: number | null, unit: string, emptyValue: string) =>
  value == null ? emptyValue : `${value.toFixed(1)} ${unit}`
const formatRate = (value: number | null, unit: string, emptyValue: string) =>
  value == null ? emptyValue : `${value > 0 ? '+' : ''}${value.toFixed(2)} ${unit}/wk`
export default function AnalyticsScreen() {
  const router = useRouter()
  const { entries } = useWeightStore()
  const { profile } = useProfileStore()
  const { texts, locale } = useTexts()
  const { colors } = useAppTheme()
  const styles = useMemo(() => createAnalyticsStyles(colors), [colors])
  const [mode, setMode] = useState<Mode>('weight')
  useEffect(() => {
    analyticsService.createAnalyticEvent({
      screen: Screens.Analytics,
      action: Actions.View,
    })
  }, [])
  const stats = useMemo(() => getAnalyticsStats(entries, profile), [entries, profile])
  const kg = texts.home.units.kg
  const emptyValue = texts.profile.values.notSet
  const forecastLabel = stats.forecastDateISO
    ? new Date(stats.forecastDateISO).toLocaleDateString(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : emptyValue
  const heroLabel = mode === 'weight' ? texts.analytics.currentWeight : texts.analytics.trendWeight
  const heroValue = formatWeight(
    mode === 'weight' ? stats.currentKg : stats.trendKg,
    kg,
    emptyValue
  )
  const heroMeta =
    mode === 'weight'
      ? `${texts.analytics.trendGap}: ${formatWeight(stats.trendDeltaKg, kg, emptyValue)}`
      : `${texts.analytics.weeklyRate}: ${formatRate(stats.weeklyRateKg, kg, emptyValue)}`
  const handleModeChange = (next: Mode) => {
    setMode(next)
    analyticsService.createAnalyticEvent({
      screen: Screens.Analytics,
      action: Actions.Click,
    })
  }
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{texts.analytics.title}</Text>
          <Text style={styles.subtitle}>
            {stats.entriesCount} {texts.analytics.recordsSuffix}
          </Text>
        </View>
        <View style={styles.toggleRow}>
          <Pressable
            style={[styles.toggleButton, mode === 'weight' && styles.toggleButtonActive]}
            onPress={() => handleModeChange('weight')}>
            <Text style={[styles.toggleText, mode === 'weight' && styles.toggleTextActive]}>
              {texts.analytics.modes.weight}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.toggleButton, mode === 'trend' && styles.toggleButtonActive]}
            onPress={() => handleModeChange('trend')}>
            <Text style={[styles.toggleText, mode === 'trend' && styles.toggleTextActive]}>
              {texts.analytics.modes.trend}
            </Text>
          </Pressable>
        </View>
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>{heroLabel}</Text>
          <Text style={styles.heroValue}>{heroValue}</Text>
          <Text style={styles.heroMeta}>{heroMeta}</Text>
        </View>
        <View style={styles.metricGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>{texts.analytics.avg7}</Text>
            <Text style={styles.metricValue}>{formatWeight(stats.avg7Kg, kg, emptyValue)}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>{texts.analytics.avg30}</Text>
            <Text style={styles.metricValue}>{formatWeight(stats.avg30Kg, kg, emptyValue)}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>{texts.analytics.largestDrop}</Text>
            <Text style={styles.metricValue}>
              {formatWeight(stats.largestWeeklyDropKg, kg, emptyValue)}
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>{texts.analytics.largestRollback}</Text>
            <Text style={styles.metricValue}>
              {formatWeight(stats.largestRollbackKg, kg, emptyValue)}
            </Text>
          </View>
          <View style={[styles.metricCard, styles.fullWidthCard]}>
            <Text style={styles.metricLabel}>{texts.analytics.stableWeeks}</Text>
            <Text style={styles.metricValue}>{stats.stableWeeks}</Text>
          </View>
        </View>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{texts.analytics.forecastTitle}</Text>
          <Text style={styles.sectionText}>
            {texts.analytics.forecastPrefix}: {forecastLabel}
          </Text>
          <Button
            title={texts.analytics.openEntries}
            variant="inverseSmall"
            onPress={() => router.push('/entries')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
