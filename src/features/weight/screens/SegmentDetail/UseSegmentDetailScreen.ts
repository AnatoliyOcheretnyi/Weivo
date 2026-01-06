import { useCallback, useMemo, useState } from 'react'
import { Alert } from 'react-native'
import type { Texts } from '@/i18n'
import type { GoalSegment } from '@/features/weight'
import { parseWeightText } from './SegmentDetailScreenUtils'
type UseSegmentDetailScreenParams = {
  id?: string
  segments: GoalSegment[]
  updateSegment: (_segment: GoalSegment) => void
  removeSegment: (_id: string) => void
  texts: Texts
  onDone: () => void
}
export const useSegmentDetailScreen = ({
  id,
  segments,
  updateSegment,
  removeSegment,
  texts,
  onDone,
}: UseSegmentDetailScreenParams) => {
  const segment = useMemo(() => segments.find((item) => item.id === id), [id, segments])
  const ordered = useMemo(
    () => [...segments].sort((a, b) => b.createdAtISO.localeCompare(a.createdAtISO)),
    [segments]
  )
  const isLatest = segment ? ordered[0]?.id === segment.id : false
  const isCompleted = Boolean(segment?.completedAtISO)
  const [isEditing, setIsEditing] = useState(false)
  const [startWeight, setStartWeight] = useState(
    segment ? segment.startKg.toFixed(1) : ''
  )
  const [targetWeight, setTargetWeight] = useState(
    segment ? segment.targetKg.toFixed(1) : ''
  )
  const [note, setNote] = useState(segment?.note ?? '')
  const startValue = useMemo(() => parseWeightText(startWeight), [startWeight])
  const targetValue = useMemo(() => parseWeightText(targetWeight), [targetWeight])
  const canSave =
    Number.isFinite(startValue) &&
    Number.isFinite(targetValue) &&
    startValue > 0 &&
    targetValue > 0
  const handleEditToggle = useCallback(() => {
    if (isCompleted) {
      Alert.alert(texts.segments.completedTitle, texts.segments.completedMessage)
      return
    }
    if (!isLatest) {
      Alert.alert(texts.segments.editBlockedTitle, texts.segments.editBlockedMessage)
      return
    }
    setIsEditing((value) => !value)
  }, [isCompleted, isLatest, texts])
  const handleSave = useCallback(() => {
    if (!segment || !canSave) {
      return
    }
    const updated: GoalSegment = {
      ...segment,
      startKg: startValue,
      targetKg: targetValue,
      note: note.trim() || undefined,
    }
    updateSegment(updated)
    setIsEditing(false)
    onDone()
  }, [canSave, note, onDone, segment, startValue, targetValue, updateSegment])
  const handleDelete = useCallback(() => {
    if (!segment) {
      return
    }
    if (isCompleted) {
      Alert.alert(texts.segments.completedTitle, texts.segments.completedMessage)
      return
    }
    if (!isLatest) {
      Alert.alert(texts.segments.editBlockedTitle, texts.segments.editBlockedMessage)
      return
    }
    Alert.alert(
      texts.segments.deleteTitle,
      texts.segments.deleteMessage,
      [
        { text: texts.segments.deleteCancel, style: 'cancel' },
        {
          text: texts.segments.deleteConfirm,
          style: 'destructive',
          onPress: () => {
            removeSegment(segment.id)
            onDone()
          },
        },
      ]
    )
  }, [isCompleted, isLatest, onDone, removeSegment, segment, texts])
  return {
    segment,
    isLatest,
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
  }
}
