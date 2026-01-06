import { useCallback, useMemo, useState } from 'react'
import type { ProfileData } from '@/features/profile'
import type { GoalSegment, GoalSegmentDirection, WeightEntry } from '@/features/weight'
import { WEIGHT_STEP_KG } from './SegmentCreateScreenConstants'
import { parseWeightText } from '@/shared/utils'
type UseSegmentCreateScreenParams = {
  entries: WeightEntry[]
  segments: GoalSegment[]
  profile: ProfileData
  addSegment: (_segment: GoalSegment) => void
  onAfterSave: () => void
}
export const useSegmentCreateScreen = ({
  entries,
  segments,
  profile,
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
    startValue > 0 &&
    targetValue > 0
  const handleSave = useCallback(() => {
    if (!canSave) {
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
    const nextStart =
      inferredDirection === 'gain' ? targetValue + WEIGHT_STEP_KG : targetValue - WEIGHT_STEP_KG
    setStartWeight(nextStart.toFixed(1))
    setTarget('')
    setNote('')
    onAfterSave()
  }, [addSegment, canSave, inferredDirection, note, onAfterSave, startValue, targetValue])
  return {
    latestWeight,
    startWeight,
    setStartWeight,
    target,
    setTarget,
    note,
    setNote,
    canSave,
    handleSave,
  }
}
