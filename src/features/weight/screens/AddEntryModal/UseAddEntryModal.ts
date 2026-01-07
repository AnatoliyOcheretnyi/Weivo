import { useCallback, useMemo, useState } from 'react'
import type { Mood } from '@/features/weight'
import type { Texts } from '@/i18n'
import {
  WEIGHT_MAX_KG,
  WEIGHT_MIN_KG,
  isWithinRange,
  parseWeightText,
  sanitizeDecimalInput,
} from '@/shared/utils'
import { Actions, Screens, Triggers, analyticsService } from '@/shared/services/analytics'
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
  const canSave = Number.isFinite(weightValue) && isWithinRange(weightValue, WEIGHT_MIN_KG, WEIGHT_MAX_KG)
  const handleWeightChange = useCallback((value: string) => {
    setWeightText((prev) => {
      const next = sanitizeDecimalInput(value, { maxDecimals: 1 })
      const parsed = parseWeightText(next)
      if (Number.isFinite(parsed) && parsed > WEIGHT_MAX_KG) {
        return prev
      }
      return next
    })
  }, [])
  const handleSave = useCallback(() => {
    if (!canSave) {
      return
    }
    addEntry(Number(weightValue.toFixed(1)), mood)
    analyticsService.createAnalyticEvent({
      screen: Screens.AddEntry,
      trigger: Triggers.AddEntry,
      action: Actions.Add,
      extraProperties: {
        has_mood: mood ? 'true' : 'false',
        source: 'modal',
      },
    })
    onDone()
  }, [addEntry, canSave, mood, onDone, weightValue])
  return {
    weightText,
    setWeightText: handleWeightChange,
    mood,
    setMood,
    moodOptions,
    canSave,
    handleSave,
  }
}
