import { memo, useCallback, useRef, useState } from 'react'
import { Alert, Pressable, Text, View } from 'react-native'
import { Swipeable } from 'react-native-gesture-handler'
import Animated, { FadeOut, Layout } from 'react-native-reanimated'
import { createEntriesStyles } from './EntriesScreen.styles'
import { useTexts } from '@/i18n'
import { useWeightStore } from '@/features/weight'
type Entry = ReturnType<typeof useWeightStore>['entries'][number]
type EntryRowProps = {
  item: Entry
  index: number
  data: Entry[]
  entries: Entry[]
  texts: ReturnType<typeof useTexts>['texts']
  locale: string
  entriesStyles: ReturnType<typeof createEntriesStyles>
  isDeleting: boolean
  onDelete: (_item: Entry, _nextEntries: Entry[]) => void
}
export const EntryRow = memo(function EntryRow({
  item,
  index,
  data,
  entries,
  texts,
  locale,
  entriesStyles,
  isDeleting,
  onDelete,
}: EntryRowProps) {
  const swipeRef = useRef<Swipeable>(null)
  const [isOpen, setIsOpen] = useState(false)
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
  const prev = data[index + 1]
  const delta = prev ? item.weightKg - prev.weightKg : 0
  const deltaLabel =
    delta === 0
      ? texts.entries.deltaZero
      : `${delta > 0 ? texts.symbols.plus : ''}${delta.toFixed(1)}`
  const confirmDelete = useCallback(() => {
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
            onDelete(item, nextEntries)
          },
        },
      ]
    )
  }, [entries, item, onDelete, texts])
  return (
    <Animated.View
      exiting={FadeOut.duration(180)}
      layout={isDeleting ? Layout.duration(180) : undefined}
      style={[entriesStyles.swipeContainer, isOpen && entriesStyles.swipeContainerActive]}>
      <Swipeable
        ref={swipeRef}
        overshootRight={false}
        onSwipeableWillOpen={() => setIsOpen(true)}
        onSwipeableWillClose={() => setIsOpen(false)}
        onSwipeableOpen={confirmDelete}
        renderRightActions={() => (
          <Pressable style={entriesStyles.deleteAction} onPress={confirmDelete}>
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
              <Text
                style={[
                  entriesStyles.delta,
                  delta > 0 ? entriesStyles.deltaUp : entriesStyles.deltaDown,
                ]}>
                {deltaLabel} {texts.entries.unit}
              </Text>
              {item.mood && <Text style={entriesStyles.mood}>{moodMap[item.mood]}</Text>}
            </View>
          </View>
        </View>
      </Swipeable>
    </Animated.View>
  )
})
