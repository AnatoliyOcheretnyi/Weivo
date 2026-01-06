import { useMemo } from 'react'
import type { ProfileData } from '@/features/profile'
import type { WeightEntry } from '@/features/weight'
import { localeLabels, type Texts } from '@/i18n'
import {
  ACTIVITY_MULTIPLIERS,
  CALORIES_PER_KG,
  DEFAULT_ACTIVITY_LEVEL,
} from './ProfileScreenConstants'
import { calculateAge, formatHeightCm } from './ProfileScreenUtils'
type UseProfileScreenParams = {
  entries: WeightEntry[]
  profile: ProfileData
  texts: Texts
  locale: string
  scheme: 'light' | 'dark' | 'rose' | 'sky' | 'mint'
}
export const useProfileScreen = ({
  entries,
  profile,
  texts,
  locale,
  scheme,
}: UseProfileScreenParams) => {
  const latestWeight = entries.length > 0 ? entries[entries.length - 1].weightKg : null
  const birthDateISO = profile.birthDateISO ?? null
  const heightCm = profile.heightCm ?? null
  const goalType = profile.goalType ?? 'maintain'
  const goalTargetKg = profile.goalTargetKg ?? null
  const goalRateKgPerWeek = profile.goalRateKgPerWeek ?? null
  const goalRangeMinKg = profile.goalRangeMinKg ?? null
  const goalRangeMaxKg = profile.goalRangeMaxKg ?? null
  const sex = profile.sex ?? null
  const activityLevel = profile.activityLevel ?? DEFAULT_ACTIVITY_LEVEL
  const birthDateLabel = useMemo(() => {
    if (!birthDateISO) {
      return texts.profile.values.notSet
    }
    return new Date(birthDateISO).toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }, [birthDateISO, locale, texts])
  const ageLabel = useMemo(() => {
    if (!birthDateISO) {
      return texts.profile.values.notSet
    }
    return calculateAge(birthDateISO).toString()
  }, [birthDateISO, texts])
  const heightLabel = formatHeightCm(heightCm) ?? texts.profile.values.notSet
  const sexLabel = useMemo(() => {
    if (!sex) {
      return texts.profile.values.notSet
    }
    return sex === 'male' ? texts.profile.values.sexMale : texts.profile.values.sexFemale
  }, [sex, texts])
  const bmiValue = useMemo(() => {
    if (!latestWeight || !heightCm) {
      return texts.profile.values.notSet
    }
    return (latestWeight / Math.pow(heightCm / 100, 2)).toFixed(1)
  }, [heightCm, latestWeight, texts])
  const calories = useMemo(() => {
    if (!latestWeight || !heightCm || !birthDateISO || !sex) {
      return { maintenance: null, target: null }
    }
    const age = calculateAge(birthDateISO)
    const sexOffset = sex === 'male' ? 5 : -161
    const bmr = 10 * latestWeight + 6.25 * heightCm - 5 * age + sexOffset
    const activityMultiplier = ACTIVITY_MULTIPLIERS[activityLevel] ?? 1.2
    const tdee = bmr * activityMultiplier
    if ((goalType === 'lose' || goalType === 'gain') && goalRateKgPerWeek) {
      const delta = (goalRateKgPerWeek * CALORIES_PER_KG) / 7
      const target = goalType === 'lose' ? tdee - delta : tdee + delta
      return { maintenance: Math.round(tdee), target: Math.round(target) }
    }
    return { maintenance: Math.round(tdee), target: Math.round(tdee) }
  }, [
    activityLevel,
    birthDateISO,
    goalRateKgPerWeek,
    goalType,
    heightCm,
    latestWeight,
    sex,
  ])
  const goalTypeLabel =
    goalType === 'lose'
      ? texts.profile.values.goalLose
      : goalType === 'gain'
        ? texts.profile.values.goalGain
        : texts.profile.values.goalMaintain
  const goalRateLabel =
    goalRateKgPerWeek && (goalType === 'lose' || goalType === 'gain')
      ? `${goalRateKgPerWeek.toFixed(1)} kg / ${texts.home.units.weeksShort}`
      : texts.profile.values.notSet
  const goalRangeLabel =
    goalType === 'maintain' && goalRangeMinKg && goalRangeMaxKg
      ? `${goalRangeMinKg.toFixed(1)}–${goalRangeMaxKg.toFixed(1)} kg`
      : texts.profile.values.notSet
  const predictionLabel = useMemo(() => {
    if (!latestWeight) {
      return texts.profile.values.notSet
    }
    if (goalType === 'maintain') {
      if (goalRangeMinKg != null && goalRangeMaxKg != null) {
        if (latestWeight >= goalRangeMinKg && latestWeight <= goalRangeMaxKg) {
          return texts.profile.values.inRange
        }
        if (goalRateKgPerWeek) {
          const target = latestWeight < goalRangeMinKg ? goalRangeMinKg : goalRangeMaxKg
          const weeks = Math.ceil(Math.abs(latestWeight - target) / goalRateKgPerWeek)
          return `≈ ${weeks} ${texts.home.units.weeksShort}`
        }
      }
      return texts.profile.values.notSet
    }
    if (!goalTargetKg || !goalRateKgPerWeek) {
      return texts.profile.values.notSet
    }
    const weeks = Math.ceil(Math.abs(latestWeight - goalTargetKg) / goalRateKgPerWeek)
    return `≈ ${weeks} ${texts.home.units.weeksShort}`
  }, [
    goalRangeMaxKg,
    goalRangeMinKg,
    goalRateKgPerWeek,
    goalTargetKg,
    goalType,
    latestWeight,
    texts,
  ])
  const storedLanguage =
    profile.language && profile.language !== 'system' ? profile.language : undefined
  const languageLabel = storedLanguage
    ? localeLabels[storedLanguage]
    : localeLabels[locale as keyof typeof localeLabels]
  const themeLabel =
    scheme === 'dark'
      ? texts.profile.values.themeDark
      : scheme === 'rose'
        ? texts.profile.values.themeRose
        : scheme === 'sky'
          ? texts.profile.values.themeSky
          : scheme === 'mint'
            ? texts.profile.values.themeMint
            : texts.profile.values.themeLight
  return {
    latestWeight,
    birthDateLabel,
    ageLabel,
    heightLabel,
    sexLabel,
    bmiValue,
    calories,
    goalType,
    goalTypeLabel,
    goalTargetKg,
    goalRateLabel,
    goalRangeLabel,
    predictionLabel,
    languageLabel,
    themeLabel,
    activityLevel,
  }
}
