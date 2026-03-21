import { useCallback, useMemo, useState } from 'react'
import { Alert } from 'react-native'
import type { ProfileData } from '@/features/profile'
import type { GoalSegment, GoalSegmentDirection, WeightEntry } from '@/features/weight'
import type { Texts } from '@/i18n'
import { WEIGHT_STEP_KG } from './SegmentCreateScreenConstants'
import {
  GOAL_NOTE_MAX_LENGTH,
  WEIGHT_MAX_KG,
  WEIGHT_MIN_KG,
  formatKg,
  getHealthyTargetRangeKg,
  isWithinRange,
  parseWeightText,
  sanitizeDecimalInput,
  sanitizeNoteInput,
} from '@/shared/utils'
import { Actions, Screens, analyticsService } from '@/shared/services/analytics'
type UseSegmentCreateScreenParams = {
  entries: WeightEntry[]
  segments: GoalSegment[]
  profile: ProfileData
  texts: Texts
  addSegment: (_segment: GoalSegment) => void
  onAfterSave: () => void
}
export const useSegmentCreateScreen = ({
  entries,
  segments,
  profile,
  texts,
  addSegment,
  onAfterSave,
}: UseSegmentCreateScreenParams) => {
  const latestWeight = entries.length > 0 ? entries[entries.length - 1].weightKg : 0
  const lastSegment = segments[0]
  const inferredDirection: GoalSegmentDirection =
    lastSegment?.direction ?? (profile.goalType === 'gain' ? 'gain' : 'lose')
  const initialStartWeight = useMemo(() => {
    if (lastSegment?.targetKg != null) {
      return (lastSegment.targetKg - WEIGHT_STEP_KG).toFixed(1)
    }
    return latestWeight ? latestWeight.toFixed(1) : ''
  }, [lastSegment?.targetKg, latestWeight])
  const [startWeight, setStartWeight] = useState(initialStartWeight)
  const [target, setTarget] = useState('')
  const [note, setNote] = useState('')
  const startValue = useMemo(() => parseWeightText(startWeight), [startWeight])
  const targetValue = useMemo(() => parseWeightText(target), [target])
  const canSave =
    Number.isFinite(startValue) &&
    Number.isFinite(targetValue) &&
    isWithinRange(startValue, WEIGHT_MIN_KG, WEIGHT_MAX_KG) &&
    isWithinRange(targetValue, WEIGHT_MIN_KG, WEIGHT_MAX_KG)
  const handleStartChange = useCallback((value: string) => {
    setStartWeight((prev) => {
      const next = sanitizeDecimalInput(value, { maxDecimals: 1 })
      const parsed = parseWeightText(next)
      if (Number.isFinite(parsed) && parsed > WEIGHT_MAX_KG) {
        return prev
      }
      return next
    })
  }, [])
  const handleTargetChange = useCallback((value: string) => {
    setTarget((prev) => {
      const next = sanitizeDecimalInput(value, { maxDecimals: 1 })
      const parsed = parseWeightText(next)
      if (Number.isFinite(parsed) && parsed > WEIGHT_MAX_KG) {
        return prev
      }
      return next
    })
  }, [])
  const handleNoteChange = useCallback((value: string) => {
    setNote(sanitizeNoteInput(value, GOAL_NOTE_MAX_LENGTH))
  }, [])
  const handleSave = useCallback(() => {
    if (!canSave) {
      return
    }
    const healthyRange = getHealthyTargetRangeKg(startValue, profile.heightCm)
    if (!isWithinRange(targetValue, healthyRange.min, healthyRange.max)) {
      Alert.alert(
        texts.validation.goalRangeTitle,
        texts.validation.goalRangeMessage
          .replace('{min}', formatKg(healthyRange.min))
          .replace('{max}', formatKg(healthyRange.max))
          .replace('{unit}', texts.home.units.kg)
      )
      return
    }
    const segment: GoalSegment = {
      id: String(Date.now()),
      startKg: startValue,
      targetKg: targetValue,
      direction: inferredDirection,
      note: note.trim() || undefined,
      createdAtISO: new Date().toISOString(),
    }
    addSegment(segment)
    analyticsService.createAnalyticEvent({
      screen: Screens.CreateNewSegment,
      action: Actions.Click,
      extraProperties: {
        direction: inferredDirection,
        has_note: note.trim() ? 'true' : 'false',
      },
    })
    const nextStart =
      inferredDirection === 'gain' ? targetValue + WEIGHT_STEP_KG : targetValue - WEIGHT_STEP_KG
    setStartWeight(nextStart.toFixed(1))
    setTarget('')
    setNote('')
    onAfterSave()
  }, [addSegment, canSave, inferredDirection, note, onAfterSave, startValue, targetValue, texts])
  return {
    latestWeight,
    startWeight,
    setStartWeight: handleStartChange,
    target,
    setTarget: handleTargetChange,
    note,
    setNote: handleNoteChange,
    canSave,
    handleSave,
  }
}
