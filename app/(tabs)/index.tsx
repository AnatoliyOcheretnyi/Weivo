import { useMemo } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';

import { WeightChart, useWeightStore } from '@/features/weight';
import { homeStyles } from '@/theme/styles/home';
import { texts } from '@/texts';

export default function HomeScreen() {
  const { entries } = useWeightStore();
  const stats = useMemo(() => {
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
  }, [entries]);

  return (
    <SafeAreaView style={homeStyles.screen}>
      <View style={homeStyles.orbLarge} />
      <View style={homeStyles.orbSmall} />
      <ScrollView contentContainerStyle={homeStyles.content} showsVerticalScrollIndicator={false}>
        <View style={homeStyles.header}>
          <Text style={homeStyles.brand}>{texts.appName}</Text>
          <Text style={homeStyles.tagline}>{texts.home.tagline}</Text>
        </View>

        <View style={homeStyles.heroCard}>
          <Text style={homeStyles.heroLabel}>{texts.home.currentWeight}</Text>
          <View style={homeStyles.heroRow}>
            <Text style={homeStyles.heroValue}>{stats.current.toFixed(1)}</Text>
            <Text style={homeStyles.heroUnit}>{texts.home.units.kg}</Text>
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
            <Text style={homeStyles.statLabel}>{texts.home.highest}</Text>
            <Text style={homeStyles.statValue}>{stats.max.toFixed(1)}</Text>
            <Text style={homeStyles.statUnit}>{texts.home.units.kg}</Text>
          </View>
          <View style={homeStyles.statCard}>
            <Text style={homeStyles.statLabel}>{texts.home.entries}</Text>
            <Text style={homeStyles.statValue}>{stats.total}</Text>
            <Text style={homeStyles.statUnit}>{texts.home.units.days}</Text>
          </View>
        </View>

        <WeightChart data={entries} />
      </ScrollView>
    </SafeAreaView>
  );
}
