import { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useProfileStore } from '@/features/profile';
import { GoalProgress, SkiaWeightChart, useGoalSegments, useWeightStore } from '@/features/weight';
import { useAppTheme } from '@/theme';
import { createHomeStyles } from './index.styles';
import { useTexts } from '@/i18n';

export default function HomeScreen() {
  const { entries } = useWeightStore();
  const { segments } = useGoalSegments();
  const { profile } = useProfileStore();
  const { texts } = useTexts();
  const { colors } = useAppTheme();
  const homeStyles = useMemo(() => createHomeStyles(colors), [colors]);
  const heightCm = profile.heightCm ?? null;
  const goalType = profile.goalType ?? null;
  const goalTargetKg = profile.goalTargetKg ?? null;
  const goalRateKgPerWeek = profile.goalRateKgPerWeek ?? null;
  const goalRangeMinKg = profile.goalRangeMinKg ?? null;
  const goalRangeMaxKg = profile.goalRangeMaxKg ?? null;
  const stats = useMemo(() => {
    if (entries.length === 0) {
      return {
        min: 0,
        max: 0,
        current: 0,
        delta: 0,
        trendLabel: texts.home.trendingDown,
        total: 0,
      };
    }
    let minValue = Number.POSITIVE_INFINITY;
    let maxValue = Number.NEGATIVE_INFINITY;
    for (const entry of entries) {
      minValue = Math.min(minValue, entry.weightKg);
      maxValue = Math.max(maxValue, entry.weightKg);
    }
    const current = entries[entries.length - 1];
    const lookback = entries[entries.length - 10] ?? current;
    const delta = Number((current.weightKg - lookback.weightKg).toFixed(1));

    return {
      min: minValue,
      max: maxValue,
      current: current.weightKg,
      delta,
      trendLabel: delta <= 0 ? texts.home.trendingDown : texts.home.trendingUp,
      total: entries.length,
    };
  }, [entries, texts]);

  const bmiValue =
    stats.current > 0 && heightCm
      ? (stats.current / Math.pow(heightCm / 100, 2)).toFixed(1)
      : null;

  const activeSegment = useMemo(() => {
    if (segments.length === 0 || stats.current <= 0) {
      return null;
    }
    const ordered = [...segments].sort((a, b) => a.createdAtISO.localeCompare(b.createdAtISO));
    const reachedTarget = (segment: { direction: string; targetKg: number }) =>
      segment.direction === 'gain'
        ? stats.current >= segment.targetKg
        : stats.current <= segment.targetKg;
    const next = ordered.find(
      (segment) => !segment.completedAtISO && !reachedTarget(segment)
    );
    return next ?? ordered[ordered.length - 1];
  }, [segments, stats.current]);

  const goalLabel = (() => {
    if (goalType === 'maintain') {
      if (goalRangeMinKg != null && goalRangeMaxKg != null) {
        return `${goalRangeMinKg.toFixed(1)}–${goalRangeMaxKg.toFixed(1)} kg`;
      }
      return texts.profile.values.notSet;
    }
    if (goalTargetKg != null) {
      return `${goalTargetKg.toFixed(1)} kg`;
    }
    return texts.profile.values.notSet;
  })();

  const etaLabel = (() => {
    if (!goalRateKgPerWeek || goalRateKgPerWeek <= 0) {
      return texts.profile.values.notSet;
    }
    if (goalType === 'maintain') {
      if (goalRangeMinKg != null && goalRangeMaxKg != null) {
        if (stats.current >= goalRangeMinKg && stats.current <= goalRangeMaxKg) {
          return texts.profile.values.inRange;
        }
        const target =
          stats.current < goalRangeMinKg ? goalRangeMinKg : goalRangeMaxKg;
        const weeks = Math.ceil(Math.abs(stats.current - target) / goalRateKgPerWeek);
        return `${weeks} ${texts.home.units.weeksShort}`;
      }
      return texts.profile.values.notSet;
    }
    if (goalTargetKg != null && goalType) {
      const weeks = Math.ceil(Math.abs(stats.current - goalTargetKg) / goalRateKgPerWeek);
      return `${weeks} ${texts.home.units.weeksShort}`;
    }
    return texts.profile.values.notSet;
  })();

  return (
    <SafeAreaView style={homeStyles.screen} edges={['top', 'left', 'right']}>
      <View style={homeStyles.orbLarge} />
      <View style={homeStyles.orbSmall} />
      <ScrollView contentContainerStyle={homeStyles.content} showsVerticalScrollIndicator={false}>
        <View style={homeStyles.header}>
          <Text style={homeStyles.brand}>{texts.appName}</Text>
          <Text style={homeStyles.tagline}>{texts.home.tagline}</Text>
        </View>

        <View style={homeStyles.heroCard}>
          <Text style={homeStyles.heroLabel}>{texts.home.currentWeight}</Text>
          <View style={homeStyles.heroTopRow}>
            <View style={homeStyles.heroRow}>
              <Text style={homeStyles.heroValue}>{stats.current.toFixed(1)}</Text>
              <Text style={homeStyles.heroUnit}>{texts.home.units.kg}</Text>
            </View>
            <View style={homeStyles.heroMetaStack}>
              <Text style={homeStyles.heroMetaLabel}>{texts.home.goal}</Text>
              <Text style={homeStyles.heroMetaValue}>{goalLabel}</Text>
              <Text style={homeStyles.heroMetaLabel}>{texts.home.eta}</Text>
              <Text style={homeStyles.heroMetaValue}>{etaLabel}</Text>
              <Text style={homeStyles.heroMetaLabel}>{texts.home.bmi}</Text>
              <Text style={homeStyles.heroMetaValue}>{bmiValue ?? texts.profile.values.notSet}</Text>
            </View>
          </View>
          <View style={homeStyles.heroMetaRow}>
            <Text style={homeStyles.heroMeta}>{stats.trendLabel}</Text>
            <Text style={homeStyles.heroMetaAccent}>
              {stats.delta <= 0 ? '' : texts.symbols.plus}
              {stats.delta.toFixed(1)} {texts.home.deltaSuffix}
            </Text>
          </View>
        </View>

        <View style={homeStyles.statsRow}>
          <View style={homeStyles.statCard}>
            <Text style={homeStyles.statLabel}>{texts.home.lowest}</Text>
            <Text style={homeStyles.statValue}>{stats.min.toFixed(1)}</Text>
            <Text style={homeStyles.statUnit}>{texts.home.units.kg}</Text>
          </View>
          <View style={homeStyles.statCard}>
            {activeSegment ? (
              <GoalProgress
                currentKg={stats.current}
                startKg={activeSegment.startKg}
                targetKg={activeSegment.targetKg}
              />
            ) : (
              <GoalProgress currentKg={0} startKg={0} targetKg={0} />
            )}
          </View>
          <View style={homeStyles.statCard}>
            <Text style={homeStyles.statLabel}>{texts.home.entries}</Text>
            <Text style={homeStyles.statValue}>{stats.total}</Text>
            <Text style={homeStyles.statUnit}>{texts.home.units.days}</Text>
          </View>
        </View>

        <SkiaWeightChart data={entries} />
      </ScrollView>
    </SafeAreaView>
  );
}
