import { useMemo } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Button } from '@/shared/components/Button'
import { Input } from '@/shared/components/Input'
import { useAppTheme } from '@/theme'
import { useTexts } from '@/i18n'
import { IconSymbol } from '@/shared/components/Icon'
import { useGoalSegments } from '@/features/weight'
import { createSegmentDetailStyles } from './SegmentDetailScreen.styles'
import { useSegmentDetailScreen } from './UseSegmentDetailScreen'
export default function SegmentDetailScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id?: string }>()
  const { texts } = useTexts()
  const { colors } = useAppTheme()
  const styles = useMemo(() => createSegmentDetailStyles(colors), [colors])
  const { segments, updateSegment, removeSegment } = useGoalSegments()
  const {
    segment,
    isCompleted,
    isEditing,
    setIsEditing,
    startWeight,
    setStartWeight,
    targetWeight,
    setTargetWeight,
    note,
    setNote,
    canSave,
    handleEditToggle,
    handleSave,
    handleDelete,
  } = useSegmentDetailScreen({
    id,
    segments,
    updateSegment,
    removeSegment,
    texts,
    onDone: router.back,
  })
  if (!segment) {
    return (
      <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
        <View style={styles.card}>
          <Text style={styles.title}>{texts.segments.detailTitle}</Text>
          <Text style={styles.subtitle}>{texts.segments.detailMissing}</Text>
        </View>
      </SafeAreaView>
    )
  }
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>{texts.segments.detailTitle}</Text>
              <Text style={styles.subtitle}>{texts.segments.detailSubtitle}</Text>
            </View>
          <View style={styles.headerActions}>
              <Pressable
                style={[
                  styles.iconButton,
                  isCompleted && styles.iconButtonDisabled,
                ]}
                onPress={handleEditToggle}
                disabled={isCompleted}>
                <IconSymbol name="pencil" size={16} color={colors.inkMuted} />
              </Pressable>
              <Pressable
                style={[
                  styles.iconButton,
                  styles.iconButtonDanger,
                  isCompleted && styles.iconButtonDisabled,
                ]}
                onPress={handleDelete}
                disabled={isCompleted}>
                <IconSymbol name="trash" size={16} color={colors.accentOrangeDark} />
              </Pressable>
            </View>
          </View>
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
              editable={isEditing}
              containerStyle={[styles.inputRow, !isEditing && styles.readOnly]}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>{texts.segments.targetWeight}</Text>
            <Input
              value={targetWeight}
              onChangeText={setTargetWeight}
              keyboardType="decimal-pad"
              placeholder="110.0"
              inputStyle={styles.input}
              unit="kg"
              unitStyle={styles.unit}
              editable={isEditing}
              containerStyle={[styles.inputRow, !isEditing && styles.readOnly]}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>{texts.segments.note}</Text>
            <Input
              value={note}
              onChangeText={setNote}
              placeholder={texts.segments.notePlaceholder}
              inputStyle={styles.input}
              editable={isEditing}
              containerStyle={[styles.inputRow, !isEditing && styles.readOnly]}
            />
          </View>
          {isEditing && (
            <View style={styles.actionRow}>
              <Button
                title={texts.segments.cancel}
                variant="inverse"
                onPress={() => setIsEditing(false)}
                style={styles.actionButton}
              />
              <Button
                title={texts.segments.save}
                onPress={handleSave}
                disabled={!canSave}
                style={styles.actionButton}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
