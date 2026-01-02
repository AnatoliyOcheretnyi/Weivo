import { useMemo } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { useWeightStore } from '@/features/weight';

const moodMap = {
  happy: '🙂',
  neutral: '😐',
  sad: '😔',
  angry: '😠',
} as const;

const formatFullDate = (dateISO: string) =>
  new Date(dateISO).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export default function EntriesScreen() {
  const { entries } = useWeightStore();
  const data = useMemo(() => [...entries].reverse(), [entries]);

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.dateISO}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>All entries</Text>
            <Text style={styles.subtitle}>{data.length} records</Text>
          </View>
        }
        renderItem={({ item, index }) => {
          const prev = data[index + 1];
          const delta = prev ? item.weightKg - prev.weightKg : 0;
          const deltaLabel = delta === 0 ? '0.0' : `${delta > 0 ? '+' : ''}${delta.toFixed(1)}`;

          return (
            <View style={styles.row}>
              <View>
                <Text style={styles.date}>{formatFullDate(item.dateISO)}</Text>
                <Text style={styles.meta}>Daily log</Text>
              </View>
              <View style={styles.weightBlock}>
                <Text style={styles.weight}>{item.weightKg.toFixed(1)} kg</Text>
                <View style={styles.deltaRow}>
                  <Text style={[styles.delta, delta > 0 ? styles.deltaUp : styles.deltaDown]}>
                    {deltaLabel} kg
                  </Text>
                  {item.mood && <Text style={styles.mood}>{moodMap[item.mood]}</Text>}
                </View>
              </View>
            </View>
          );
        }}
      />
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
    paddingBottom: 80,
    gap: 12,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    color: '#1B1B1B',
    letterSpacing: 0.6,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B5647',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  row: {
    backgroundColor: '#F7F1E9',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 16,
    color: '#1B1B1B',
  },
  meta: {
    marginTop: 4,
    fontSize: 11,
    color: '#9A7E69',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  weightBlock: {
    alignItems: 'flex-end',
  },
  weight: {
    fontSize: 16,
    color: '#1B1B1B',
  },
  delta: {
    marginTop: 4,
    fontSize: 11,
  },
  deltaRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mood: {
    fontSize: 14,
  },
  deltaUp: {
    color: '#B96A2C',
  },
  deltaDown: {
    color: '#2E5C56',
  },
});
