import { useMemo, useRef } from 'react'
import { ScrollView, Text, View, type TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Button } from '@/shared/components/Button'
import { Input } from '@/shared/components/Input'
import { useAppTheme } from '@/theme'
import { useTexts } from '@/i18n'
import { useProfileStore } from '@/features/profile'
import {
  GoalSegmentTrack,
  useGoalSegments,
  useWeightStore,
} from '@/features/weight'
import { createSegmentCreateStyles } from './SegmentCreateScreen.styles'
import { useSegmentCreateScreen } from './UseSegmentCreateScreen'
export default function SegmentCreateScreen() {
  const router = useRouter()
  const { texts } = useTexts()
  const { colors } = useAppTheme()
  const styles = useMemo(() => createSegmentCreateStyles(colors), [colors])
  const { entries } = useWeightStore()
  const { profile } = useProfileStore()
  const { segments, addSegment } = useGoalSegments()
  const scrollRef = useRef<ScrollView>(null)
  const targetInputRef = useRef<TextInput>(null)
  const {
    latestWeight,
    startWeight,
    setStartWeight,
    target,
    setTarget,
    note,
    setNote,
    canSave,
    handleSave,
  } = useSegmentCreateScreen({
    entries,
    segments,
    profile,
    addSegment,
    onAfterSave: () => {
      targetInputRef.current?.focus()
      scrollRef.current?.scrollTo({ y: 0, animated: true })
    },
  })
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.handle} />
          <Text style={styles.title}>{texts.segments.createTitle}</Text>
          <Text style={styles.subtitle}>{texts.segments.createSubtitle}</Text>
          <View style={styles.section}>
            <Text style={styles.label}>{texts.segments.startWeight}</Text>
            <Input
              value={startWeight}
              onChangeText={setStartWeight}
              keyboardType="decimal-pad"
              placeholder="115.0"
              inputStyle={styles.input}
              unit="kg"
              unitStyle={styles.unit}
              containerStyle={styles.inputRow}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>{texts.segments.targetWeight}</Text>
            <Input
              value={target}
              onChangeText={setTarget}
              keyboardType="decimal-pad"
              placeholder="110.0"
              inputStyle={styles.input}
              unit="kg"
              unitStyle={styles.unit}
              ref={targetInputRef}
              containerStyle={styles.inputRow}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>{texts.segments.note}</Text>
            <Input
              value={note}
              onChangeText={setNote}
              placeholder={texts.segments.notePlaceholder}
              inputStyle={styles.input}
              containerStyle={styles.inputRow}
            />
          </View>
          <View style={styles.actionRow}>
            <Button
              title={texts.segments.cancel}
              variant="inverse"
              onPress={() => router.back()}
              style={styles.actionButton}
            />
            <Button
              title={texts.segments.save}
              onPress={handleSave}
              disabled={!canSave}
              style={styles.actionButton}
            />
          </View>
        </View>
        <View style={styles.previewSection}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle}>{texts.profile.sections.segments}</Text>
          </View>
          <View style={styles.previewCard}>
            <GoalSegmentTrack
              segments={segments}
              currentKg={latestWeight || undefined}
              showAddNode
              allowSegmentPress={false}
              onAddPress={() => {
                targetInputRef.current?.focus()
                scrollRef.current?.scrollTo({ y: 0, animated: true })
              }}
            />
          </View>
        </View>
        <View style={styles.doneRow}>
          <Button
            title={texts.segments.done}
            onPress={() => router.back()}
            style={styles.doneButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
