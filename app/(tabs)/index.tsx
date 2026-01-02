import { useMemo } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { WeightChart, weightEntries } from '@/features/weight';

const fontTitle = Platform.select({ ios: 'Avenir Next', android: 'serif', default: 'Avenir Next' });
const fontMono = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'Menlo' });

export default function HomeScreen() {
  const stats = useMemo(() => {
    let minValue = Number.POSITIVE_INFINITY;
    let maxValue = Number.NEGATIVE_INFINITY;
    for (const entry of weightEntries) {
      minValue = Math.min(minValue, entry.weightKg);
      maxValue = Math.max(maxValue, entry.weightKg);
    }
    const current = weightEntries[weightEntries.length - 1];
    const lookback = weightEntries[weightEntries.length - 10] ?? current;
    const delta = Number((current.weightKg - lookback.weightKg).toFixed(1));

    return {
      min: minValue,
      max: maxValue,
      current: current.weightKg,
      delta,
      trendLabel: delta <= 0 ? 'Trending down' : 'Trending up',
      total: weightEntries.length,
    };
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.orbLarge} />
      <View style={styles.orbSmall} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.brand}>Weivo</Text>
          <Text style={styles.tagline}>Weight journey - steady, honest, real</Text>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Current weight</Text>
          <View style={styles.heroRow}>
            <Text style={styles.heroValue}>{stats.current.toFixed(1)}</Text>
            <Text style={styles.heroUnit}>kg</Text>
          </View>
          <View style={styles.heroMetaRow}>
            <Text style={styles.heroMeta}>{stats.trendLabel}</Text>
            <Text style={styles.heroMetaAccent}>
              {stats.delta <= 0 ? '' : '+'}{stats.delta.toFixed(1)} kg / 10 days
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Lowest</Text>
            <Text style={styles.statValue}>{stats.min.toFixed(1)}</Text>
            <Text style={styles.statUnit}>kg</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Highest</Text>
            <Text style={styles.statValue}>{stats.max.toFixed(1)}</Text>
            <Text style={styles.statUnit}>kg</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Entries</Text>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statUnit}>days</Text>
          </View>
        </View>

        <WeightChart data={weightEntries} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EFE4D7',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 20,
  },
  orbLarge: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 280,
    backgroundColor: '#D8B18A',
    opacity: 0.28,
    top: -120,
    right: -80,
  },
  orbSmall: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 160,
    backgroundColor: '#6A7D7E',
    opacity: 0.18,
    bottom: -60,
    left: -50,
  },
  header: {
    gap: 6,
  },
  brand: {
    fontSize: 30,
    color: '#1B1B1B',
    fontFamily: fontTitle,
    letterSpacing: 1.1,
  },
  tagline: {
    fontSize: 12,
    color: '#5A4636',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  heroCard: {
    backgroundColor: '#1B1B1B',
    borderRadius: 26,
    padding: 22,
  },
  heroLabel: {
    fontSize: 12,
    color: '#DAD0C4',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginTop: 10,
  },
  heroValue: {
    fontSize: 46,
    color: '#F7EFE6',
    fontFamily: fontTitle,
  },
  heroUnit: {
    fontSize: 16,
    color: '#F7EFE6',
    marginBottom: 6,
  },
  heroMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  heroMeta: {
    color: '#E3D6C7',
    fontSize: 12,
  },
  heroMetaAccent: {
    color: '#F4B183',
    fontSize: 12,
    fontFamily: fontMono,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F5EFE7',
    borderRadius: 18,
    padding: 14,
  },
  statLabel: {
    fontSize: 10,
    color: '#9A7E69',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  statValue: {
    marginTop: 8,
    fontSize: 20,
    color: '#1B1B1B',
    fontFamily: fontTitle,
  },
  statUnit: {
    marginTop: 2,
    fontSize: 11,
    color: '#5A4636',
  },
});
