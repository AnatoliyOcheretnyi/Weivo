import { useMemo } from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';

import { useWeightStore } from '@/features/weight';
import { entriesStyles } from '@/theme/styles/entries';
import { texts } from '@/texts';

const moodMap = {
  happy: texts.moods.happy,
  neutral: texts.moods.neutral,
  sad: texts.moods.sad,
  angry: texts.moods.angry,
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
    <SafeAreaView style={entriesStyles.screen}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.dateISO}
        contentContainerStyle={entriesStyles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={entriesStyles.header}>
            <Text style={entriesStyles.title}>{texts.entries.title}</Text>
            <Text style={entriesStyles.subtitle}>{data.length} {texts.entries.recordsSuffix}</Text>
          </View>
        }
        renderItem={({ item, index }) => {
          const prev = data[index + 1];
          const delta = prev ? item.weightKg - prev.weightKg : 0;
          const deltaLabel =
            delta === 0
              ? texts.entries.deltaZero
              : `${delta > 0 ? texts.symbols.plus : ''}${delta.toFixed(1)}`;

          return (
            <View style={entriesStyles.row}>
              <View>
                <Text style={entriesStyles.date}>{formatFullDate(item.dateISO)}</Text>
                <Text style={entriesStyles.meta}>{texts.entries.dailyLog}</Text>
              </View>
              <View style={entriesStyles.weightBlock}>
                <Text style={entriesStyles.weight}>{item.weightKg.toFixed(1)} {texts.entries.unit}</Text>
                <View style={entriesStyles.deltaRow}>
                  <Text style={[entriesStyles.delta, delta > 0 ? entriesStyles.deltaUp : entriesStyles.deltaDown]}>
                    {deltaLabel} {texts.entries.unit}
                  </Text>
                  {item.mood && <Text style={entriesStyles.mood}>{moodMap[item.mood]}</Text>}
                </View>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
