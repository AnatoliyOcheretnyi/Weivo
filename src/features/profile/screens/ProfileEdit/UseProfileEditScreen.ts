import { useCallback, useMemo, useState } from 'react'
import { Alert, Platform } from 'react-native'
import type {
  ActivityLevel,
  GoalType,
  Language,
  ProfileData,
  Sex,
  ThemeMode,
  Units,
} from '@/features/profile'
import type { WeightEntry } from '@/features/weight'
import type { Texts } from '@/i18n'
import {
  ACTIVITY_OPTIONS,
  DEFAULT_BIRTH_DATE,
  GOAL_RATE_MAX_GAIN,
  GOAL_RATE_MAX_LOSE,
  GOAL_TYPE_OPTIONS,
  LANGUAGE_OPTIONS,
  PROFILE_TABS,
  SEX_OPTIONS,
  THEME_OPTIONS,
  UNIT_OPTIONS,
} from './ProfileEditScreenConstants'
import {
  HEIGHT_MAX_CM,
  HEIGHT_MIN_CM,
  WEIGHT_MAX_KG,
  WEIGHT_MIN_KG,
  formatKg,
  getHealthyTargetRangeKg,
  isWithinRange,
  parseNumberInput,
  sanitizeDecimalInput,
} from '@/shared/utils'
type UseProfileEditScreenParams = {
  profile: ProfileData
  entries: WeightEntry[]
  texts: Texts
  locale: string
  scheme: ThemeMode
  updateProfile: (_next: Partial<ProfileData>) => void
  onDone: () => void
}
export const useProfileEditScreen = ({
  profile,
  entries,
  texts,
  locale,
  scheme,
  updateProfile,
  onDone,
}: UseProfileEditScreenParams) => {
  const latestWeight = entries.length > 0 ? entries[entries.length - 1].weightKg : null
  const [editTab, setEditTab] = useState<(typeof PROFILE_TABS)[number]>('profile')
  const [birthDate, setBirthDate] = useState<Date | null>(
    profile.birthDateISO ? new Date(profile.birthDateISO) : null
  )
  const [heightCm, setHeightCm] = useState(profile.heightCm ? String(profile.heightCm) : '')
  const [sex, setSex] = useState<Sex>(profile.sex ?? 'male')
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    profile.activityLevel ?? 'sedentary'
  )
  const [goalTarget, setGoalTarget] = useState(
    profile.goalTargetKg ? profile.goalTargetKg.toFixed(1) : ''
  )
  const [goalRate, setGoalRate] = useState(
    profile.goalRateKgPerWeek ? profile.goalRateKgPerWeek.toFixed(1) : ''
  )
  const [goalRangeMin, setGoalRangeMin] = useState(
    profile.goalRangeMinKg ? profile.goalRangeMinKg.toFixed(1) : ''
  )
  const [goalRangeMax, setGoalRangeMax] = useState(
    profile.goalRangeMaxKg ? profile.goalRangeMaxKg.toFixed(1) : ''
  )
  const [goalType, setGoalType] = useState<GoalType>(profile.goalType ?? 'maintain')
  const [units, setUnits] = useState<Units>(profile.units ?? 'metric')
  const [language, setLanguage] = useState<Language>(
    profile.language && profile.language !== 'system' ? profile.language : (locale as Language)
  )
  const [theme, setTheme] = useState<ThemeMode>(profile.theme ?? scheme)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const canSave = useMemo(() => {
    if (heightCm && Number.isNaN(parseNumberInput(heightCm))) {
      return false
    }
    if (goalTarget && Number.isNaN(parseNumberInput(goalTarget))) {
      return false
    }
    if (goalRate && Number.isNaN(parseNumberInput(goalRate))) {
      return false
    }
    if (goalRangeMin && Number.isNaN(parseNumberInput(goalRangeMin))) {
      return false
    }
    if (goalRangeMax && Number.isNaN(parseNumberInput(goalRangeMax))) {
      return false
    }
    if (heightCm) {
      const heightValue = parseNumberInput(heightCm)
      if (!isWithinRange(heightValue, HEIGHT_MIN_CM, HEIGHT_MAX_CM)) {
        return false
      }
    }
    if (goalType === 'lose' || goalType === 'gain') {
      if (goalRate) {
        const rate = parseNumberInput(goalRate)
        const maxRate = goalType === 'gain' ? GOAL_RATE_MAX_GAIN : GOAL_RATE_MAX_LOSE
        if (!Number.isFinite(rate) || rate <= 0 || rate > maxRate) {
          return false
        }
      }
      if (goalTarget) {
        const targetValue = parseNumberInput(goalTarget)
        if (!isWithinRange(targetValue, WEIGHT_MIN_KG, WEIGHT_MAX_KG)) {
          return false
        }
      }
    }
    if (goalType === 'maintain' && goalRangeMin && goalRangeMax) {
      const minValue = parseNumberInput(goalRangeMin)
      const maxValue = parseNumberInput(goalRangeMax)
      if (minValue >= maxValue) {
        return false
      }
      if (
        !isWithinRange(minValue, WEIGHT_MIN_KG, WEIGHT_MAX_KG) ||
        !isWithinRange(maxValue, WEIGHT_MIN_KG, WEIGHT_MAX_KG)
      ) {
        return false
      }
    }
    return true
  }, [heightCm, goalRangeMax, goalRangeMin, goalRate, goalTarget, goalType])
  const handleHeightChange = useCallback((value: string) => {
    setHeightCm((prev) => {
      const next = sanitizeDecimalInput(value, { maxDecimals: 1 })
      const parsed = parseNumberInput(next)
      if (Number.isFinite(parsed) && parsed > HEIGHT_MAX_CM) {
        return prev
      }
      return next
    })
  }, [])
  const handleGoalTargetChange = useCallback((value: string) => {
    setGoalTarget((prev) => {
      const next = sanitizeDecimalInput(value, { maxDecimals: 1 })
      const parsed = parseNumberInput(next)
      if (Number.isFinite(parsed) && parsed > WEIGHT_MAX_KG) {
        return prev
      }
      return next
    })
  }, [])
  const handleGoalRateChange = useCallback(
    (value: string) => {
      setGoalRate((prev) => {
        const next = sanitizeDecimalInput(value, { maxDecimals: 1 })
        const parsed = parseNumberInput(next)
        const maxRate = goalType === 'gain' ? GOAL_RATE_MAX_GAIN : GOAL_RATE_MAX_LOSE
        if (Number.isFinite(parsed) && parsed > maxRate) {
          return prev
        }
        return next
      })
    },
    [goalType]
  )
  const handleGoalRangeMinChange = useCallback((value: string) => {
    setGoalRangeMin((prev) => {
      const next = sanitizeDecimalInput(value, { maxDecimals: 1 })
      const parsed = parseNumberInput(next)
      if (Number.isFinite(parsed) && parsed > WEIGHT_MAX_KG) {
        return prev
      }
      return next
    })
  }, [])
  const handleGoalRangeMaxChange = useCallback((value: string) => {
    setGoalRangeMax((prev) => {
      const next = sanitizeDecimalInput(value, { maxDecimals: 1 })
      const parsed = parseNumberInput(next)
      if (Number.isFinite(parsed) && parsed > WEIGHT_MAX_KG) {
        return prev
      }
      return next
    })
  }, [])
  const themeLabel = useCallback(
    (option: ThemeMode) => {
      switch (option) {
        case 'light':
          return texts.profileEdit.themeOptions.light
        case 'dark':
          return texts.profileEdit.themeOptions.dark
        case 'rose':
          return texts.profileEdit.themeOptions.rose
        case 'sky':
          return texts.profileEdit.themeOptions.sky
        case 'mint':
          return texts.profileEdit.themeOptions.mint
        default:
          return texts.profileEdit.themeOptions.light
      }
    },
    [texts]
  )
  const onDateChange = useCallback(
    (_event: unknown, selectedDate?: Date) => {
      if (Platform.OS !== 'ios') {
        setShowDatePicker(false)
      }
      if (selectedDate) {
        setBirthDate(selectedDate)
      }
    },
    []
  )
  const handleSave = useCallback(() => {
    if (!canSave) {
      return
    }
    if (latestWeight != null && (goalType === 'lose' || goalType === 'gain')) {
      const targetValue = parseNumberInput(goalTarget)
      if (Number.isFinite(targetValue)) {
        const healthyRange = getHealthyTargetRangeKg(latestWeight)
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
      }
    }
    if (latestWeight != null && goalType === 'maintain') {
      const minValue = parseNumberInput(goalRangeMin)
      const maxValue = parseNumberInput(goalRangeMax)
      if (Number.isFinite(minValue) && Number.isFinite(maxValue)) {
        const healthyRange = getHealthyTargetRangeKg(latestWeight)
        if (
          !isWithinRange(minValue, healthyRange.min, healthyRange.max) ||
          !isWithinRange(maxValue, healthyRange.min, healthyRange.max)
        ) {
          Alert.alert(
            texts.validation.goalRangeTitle,
            texts.validation.goalRangeMessage
              .replace('{min}', formatKg(healthyRange.min))
              .replace('{max}', formatKg(healthyRange.max))
              .replace('{unit}', texts.home.units.kg)
          )
          return
        }
      }
    }
    const nextProfile: Partial<ProfileData> = {
      birthDateISO: birthDate ? birthDate.toISOString() : undefined,
      heightCm: heightCm ? parseNumberInput(heightCm) : undefined,
      goalType,
      sex,
      activityLevel,
      units,
      language,
      theme,
      goalTargetKg: goalTarget ? parseNumberInput(goalTarget) : undefined,
      goalRateKgPerWeek: goalRate ? parseNumberInput(goalRate) : undefined,
      goalRangeMinKg: goalRangeMin ? parseNumberInput(goalRangeMin) : undefined,
      goalRangeMaxKg: goalRangeMax ? parseNumberInput(goalRangeMax) : undefined,
    }
    if (goalType === 'maintain') {
      nextProfile.goalTargetKg = undefined
      nextProfile.goalRateKgPerWeek = undefined
    } else {
      nextProfile.goalRangeMinKg = undefined
      nextProfile.goalRangeMaxKg = undefined
    }
    updateProfile(nextProfile)
    onDone()
  }, [
    activityLevel,
    birthDate,
    canSave,
    goalRangeMax,
    goalRangeMin,
    goalRate,
    goalTarget,
    goalType,
    heightCm,
    language,
    onDone,
    sex,
    theme,
    units,
    updateProfile,
    latestWeight,
    texts,
  ])
  return {
    latestWeight,
    editTab,
    setEditTab,
    birthDate,
    setBirthDate,
    showDatePicker,
    setShowDatePicker,
    onDateChange,
    heightCm,
    setHeightCm: handleHeightChange,
    sex,
    setSex,
    activityLevel,
    setActivityLevel,
    goalTarget,
    setGoalTarget: handleGoalTargetChange,
    goalRate,
    setGoalRate: handleGoalRateChange,
    goalRangeMin,
    setGoalRangeMin: handleGoalRangeMinChange,
    goalRangeMax,
    setGoalRangeMax: handleGoalRangeMaxChange,
    goalType,
    setGoalType,
    units,
    setUnits,
    language,
    setLanguage,
    theme,
    setTheme,
    canSave,
    themeLabel,
    handleSave,
    tabs: PROFILE_TABS,
    sexOptions: SEX_OPTIONS,
    activityOptions: ACTIVITY_OPTIONS,
    goalTypeOptions: GOAL_TYPE_OPTIONS,
    unitOptions: UNIT_OPTIONS,
    languageOptions: LANGUAGE_OPTIONS,
    themeOptions: THEME_OPTIONS,
    defaultBirthDate: DEFAULT_BIRTH_DATE,
  }
}
