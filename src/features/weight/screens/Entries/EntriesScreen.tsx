import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Pressable, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlashList } from '@shopify/flash-list'
import { useGoalSegments, useWeightStore } from '@/features/weight'
import { useAppTheme } from '@/theme'
import { useTexts } from '@/i18n'
import { createEntriesStyles } from './EntriesScreen.styles'
import { EntryRow } from './EntriesRow'
import { analyticsService } from '@/shared/services/analytics'
type Entry = ReturnType<typeof useWeightStore>['entries'][number]
export default function EntriesScreen() {
  const { entries, clearEntries, removeEntry } = useWeightStore()
  const { reconcileCompletion } = useGoalSegments()
  const { texts, locale } = useTexts()
  const { colors } = useAppTheme()
  const entriesStyles = useMemo(() => createEntriesStyles(colors), [colors])
  const data = useMemo(() => [...entries].reverse(), [entries])
  const [isDeleting, setIsDeleting] = useState(false)
  const deleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    analyticsService.logView('entries')
    return () => {
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current)
      }
    }
  }, [])
  const handleClearAll = useCallback(() => {
    Alert.alert(
      texts.entries.clearAllTitle,
      texts.entries.clearAllMessage,
      [
        { text: texts.entries.clearAllCancel, style: 'cancel' },
        {
          text: texts.entries.clearAllConfirm,
          style: 'destructive',
          onPress: () => {
            analyticsService.logClick('clear_entries', 'entries')
            analyticsService.logEvent('entries_clear')
            setIsDeleting(true)
            clearEntries()
            if (deleteTimeoutRef.current) {
              clearTimeout(deleteTimeoutRef.current)
            }
            deleteTimeoutRef.current = setTimeout(() => setIsDeleting(false), 240)
          },
        },
      ]
    )
  }, [clearEntries, texts])
  const handleDelete = useCallback(
    (item: Entry, nextEntries: Entry[]) => {
      const nextCurrentKg =
        nextEntries.length > 0 ? nextEntries[nextEntries.length - 1].weightKg : null
      analyticsService.logClick('delete_entry', 'entries')
      analyticsService.logEvent('entry_delete', {
        has_mood: item.mood ? 'true' : 'false',
        source: 'swipe',
      })
      setIsDeleting(true)
      removeEntry(item.dateISO)
      reconcileCompletion(nextCurrentKg)
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current)
      }
      deleteTimeoutRef.current = setTimeout(() => setIsDeleting(false), 240)
    },
    [reconcileCompletion, removeEntry]
  )
  const renderItem = useCallback(
    ({ item, index }: { item: Entry; index: number }) => (
      <EntryRow
        item={item}
        index={index}
        data={data}
        entries={entries}
        texts={texts}
        locale={locale}
        entriesStyles={entriesStyles}
        isDeleting={isDeleting}
        onDelete={handleDelete}
      />
    ),
    [data, entries, entriesStyles, handleDelete, isDeleting, locale, texts]
  )
  const renderSeparator = useCallback(
    () => <View style={entriesStyles.separator} />,
    [entriesStyles.separator]
  )
  const renderHeader = useCallback(
    () => (
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
    ),
    [data.length, entriesStyles, handleClearAll, texts]
  )
  const keyExtractor = useCallback((item: Entry) => item.dateISO, [])
  return (
    <SafeAreaView style={entriesStyles.screen} edges={['top', 'left', 'right']}>
      <FlashList
        data={data}
        keyExtractor={keyExtractor}
        contentContainerStyle={entriesStyles.content}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={renderHeader}
        renderItem={renderItem}
      />
    </SafeAreaView>
  )
}
