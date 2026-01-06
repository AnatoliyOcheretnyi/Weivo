import { useCallback, useMemo, useState } from 'react'
import type { Mood } from '@/features/weight'
import type { Texts } from '@/i18n'
import { WEIGHT_MAX_KG, WEIGHT_MIN_KG } from './AddEntryModalConstants'
import { parseWeightText } from '@/shared/utils'
type UseAddEntryModalParams = {
  addEntry: (_weightKg: number, _mood?: Mood) => void
  texts: Texts
  onDone: () => void
}
type MoodOption = {
  key: Mood
  label: string
}
export const useAddEntryModal = ({
  addEntry,
  texts,
  onDone,
}: UseAddEntryModalParams) => {
  const [weightText, setWeightText] = useState('')
  const [mood, setMood] = useState<Mood | undefined>()
  const moodOptions = useMemo<MoodOption[]>(
    () => [
      { key: 'happy', label: texts.moods.happy },
      { key: 'neutral', label: texts.moods.neutral },
      { key: 'sad', label: texts.moods.sad },
      { key: 'angry', label: texts.moods.angry },
    ],
    [texts]
  )
  const weightValue = useMemo(() => parseWeightText(weightText), [weightText])
  const canSave =
    Number.isFinite(weightValue) && weightValue > WEIGHT_MIN_KG && weightValue < WEIGHT_MAX_KG
  const handleSave = useCallback(() => {
    if (!canSave) {
      return
    }
    addEntry(Number(weightValue.toFixed(1)), mood)
    onDone()
  }, [addEntry, canSave, mood, onDone, weightValue])
  return {
    weightText,
    setWeightText,
    mood,
    setMood,
    moodOptions,
    canSave,
    handleSave,
  }
}
