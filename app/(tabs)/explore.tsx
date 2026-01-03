import { useMemo } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const { entries, clearEntries } = useWeightStore();
  const data = useMemo(() => [...entries].reverse(), [entries]);
  const handleClearAll = () => {
    Alert.alert(
      texts.entries.clearAllTitle,
      texts.entries.clearAllMessage,
      [
        { text: texts.entries.clearAllCancel, style: 'cancel' },
        { text: texts.entries.clearAllConfirm, style: 'destructive', onPress: clearEntries },
      ]
    );
  };

  return (
    <SafeAreaView style={entriesStyles.screen} edges={['top', 'left', 'right']}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.dateISO}
        contentContainerStyle={entriesStyles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={entriesStyles.header}>
            <View style={entriesStyles.headerRow}>
              <View>
                <Text style={entriesStyles.title}>{texts.entries.title}</Text>
                <Text style={entriesStyles.subtitle}>
                  {data.length} {texts.entries.recordsSuffix}
                </Text>
              </View>
              <Pressable style={entriesStyles.clearButton} onPress={handleClearAll}>
                <Text style={entriesStyles.clearText}>{texts.entries.clearAll}</Text>
              </Pressable>
            </View>
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
