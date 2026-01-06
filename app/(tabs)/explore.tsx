import { useMemo, useRef, useState } from 'react'
import { Alert, FlatList, Pressable, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Swipeable } from 'react-native-gesture-handler'
import { useGoalSegments, useWeightStore } from '@/features/weight'
import { useAppTheme } from '@/theme'
import { createEntriesStyles } from './explore.styles'
import { useTexts } from '@/i18n'
export default function EntriesScreen() {
  const { entries, clearEntries, removeEntry } = useWeightStore()
  const { reconcileCompletion } = useGoalSegments()
  const { texts, locale } = useTexts()
  const { colors } = useAppTheme()
  const entriesStyles = useMemo(() => createEntriesStyles(colors), [colors])
  const data = useMemo(() => [...entries].reverse(), [entries])
  const moodMap = {
    happy: texts.moods.happy,
    neutral: texts.moods.neutral,
    sad: texts.moods.sad,
    angry: texts.moods.angry,
  } as const
  const formatFullDate = (dateISO: string) =>
    new Date(dateISO).toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  const handleClearAll = () => {
    Alert.alert(
      texts.entries.clearAllTitle,
      texts.entries.clearAllMessage,
      [
        { text: texts.entries.clearAllCancel, style: 'cancel' },
        { text: texts.entries.clearAllConfirm, style: 'destructive', onPress: clearEntries },
      ]
    )
  }
  const EntryRow = ({ item, index }: { item: typeof data[number]; index: number }) => {
    const swipeRef = useRef<Swipeable>(null)
    const [isOpen, setIsOpen] = useState(false)
    const prev = data[index + 1]
    const delta = prev ? item.weightKg - prev.weightKg : 0
    const deltaLabel =
      delta === 0
        ? texts.entries.deltaZero
        : `${delta > 0 ? texts.symbols.plus : ''}${delta.toFixed(1)}`
    const confirmDelete = () => {
      Alert.alert(
        texts.entries.deleteTitle,
        texts.entries.deleteMessage,
        [
          {
            text: texts.entries.deleteCancel,
            style: 'cancel',
            onPress: () => swipeRef.current?.close(),
          },
          {
            text: texts.entries.deleteConfirm,
            style: 'destructive',
            onPress: () => {
              const nextEntries = entries.filter((entry) => entry.dateISO !== item.dateISO)
              const nextCurrentKg =
                nextEntries.length > 0
                  ? nextEntries[nextEntries.length - 1].weightKg
                  : null
              removeEntry(item.dateISO)
              reconcileCompletion(nextCurrentKg)
            },
          },
        ]
      )
    }
    return (
      <View
        style={[
          entriesStyles.swipeContainer,
          isOpen && entriesStyles.swipeContainerActive,
        ]}>
        <Swipeable
          ref={swipeRef}
          overshootRight={false}
          onSwipeableWillOpen={() => setIsOpen(true)}
          onSwipeableWillClose={() => setIsOpen(false)}
          onSwipeableOpen={confirmDelete}
          renderRightActions={() => (
            <Pressable
              style={entriesStyles.deleteAction}
              onPress={confirmDelete}>
              <Text style={entriesStyles.deleteText}>{texts.entries.deleteConfirm}</Text>
            </Pressable>
          )}>
          <View style={entriesStyles.rowContent}>
            <View>
              <Text style={entriesStyles.date}>{formatFullDate(item.dateISO)}</Text>
              <Text style={entriesStyles.meta}>{texts.entries.dailyLog}</Text>
            </View>
            <View style={entriesStyles.weightBlock}>
              <Text style={entriesStyles.weight}>
                {item.weightKg.toFixed(1)} {texts.entries.unit}
              </Text>
              <View style={entriesStyles.deltaRow}>
                <Text style={[entriesStyles.delta, delta > 0 ? entriesStyles.deltaUp : entriesStyles.deltaDown]}>
                  {deltaLabel} {texts.entries.unit}
                </Text>
                {item.mood && <Text style={entriesStyles.mood}>{moodMap[item.mood]}</Text>}
              </View>
            </View>
          </View>
        </Swipeable>
      </View>
    )
  }
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
        renderItem={({ item, index }) => <EntryRow item={item} index={index} />}
      />
    </SafeAreaView>
  )
}
