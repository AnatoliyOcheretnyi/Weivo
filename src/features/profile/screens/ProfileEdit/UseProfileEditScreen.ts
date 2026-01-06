import { useCallback, useMemo, useState } from 'react'
import { Platform } from 'react-native'
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
import { parseNumberInput } from '@/shared/utils'
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
    if (goalType === 'lose' || goalType === 'gain') {
      if (goalRate) {
        const rate = parseNumberInput(goalRate)
        const maxRate = goalType === 'gain' ? GOAL_RATE_MAX_GAIN : GOAL_RATE_MAX_LOSE
        if (!Number.isFinite(rate) || rate <= 0 || rate > maxRate) {
          return false
        }
      }
    }
    if (goalType === 'maintain' && goalRangeMin && goalRangeMax) {
      if (parseNumberInput(goalRangeMin) >= parseNumberInput(goalRangeMax)) {
        return false
      }
    }
    return true
  }, [heightCm, goalRangeMax, goalRangeMin, goalRate, goalTarget, goalType])
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
    setHeightCm,
    sex,
    setSex,
    activityLevel,
    setActivityLevel,
    goalTarget,
    setGoalTarget,
    goalRate,
    setGoalRate,
    goalRangeMin,
    setGoalRangeMin,
    goalRangeMax,
    setGoalRangeMax,
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
