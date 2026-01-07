import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Alert,
  Animated,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
  type ScrollView,
} from 'react-native'
import type { ActivityLevel, GoalType, ProfileData, Sex } from '@/features/profile'
import type { Texts } from '@/i18n'
import {
  ACTIVITY_OPTIONS,
  DEFAULT_BIRTH_DATE,
  GOAL_RATE_MAX_GAIN,
  GOAL_RATE_MAX_LOSE,
  GOAL_TYPE_OPTIONS,
  SEX_OPTIONS,
  STEP_COUNT,
} from './OnboardingScreenConstants'
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
import { Actions, Screens, analyticsService } from '@/shared/services/analytics'
type UseOnboardingScreenParams = {
  profile: ProfileData
  updateProfile: (_next: Partial<ProfileData>) => void
  addEntry: (_weightKg: number) => void
  texts: Texts
  onDone: () => void
}
export const useOnboardingScreen = ({
  profile,
  updateProfile,
  addEntry,
  texts,
  onDone,
}: UseOnboardingScreenParams) => {
  const scrollRef = useRef<ScrollView>(null)
  const scrollX = useRef(new Animated.Value(0)).current
  const [currentStep, setCurrentStep] = useState(0)
  const [birthDate, setBirthDate] = useState<Date | null>(
    profile.birthDateISO ? new Date(profile.birthDateISO) : null
  )
  const showDatePicker = true
  const [sex, setSex] = useState<Sex>(profile.sex ?? 'male')
  const [heightCm, setHeightCm] = useState(profile.heightCm ? String(profile.heightCm) : '')
  const [weightKg, setWeightKg] = useState('')
  const [goalType, setGoalType] = useState<GoalType>(profile.goalType ?? 'maintain')
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
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    profile.activityLevel ?? 'sedentary'
  )
  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }
  }, [])
  const screenWidth = Dimensions.get('window').width
  const trackWidth = screenWidth - 64
  const progressWidth = scrollX.interpolate({
    inputRange: [0, screenWidth * (STEP_COUNT - 1)],
    outputRange: [0, trackWidth],
    extrapolate: 'clamp',
  })
  const canContinueAge = Boolean(birthDate)
  const heightValue = parseNumberInput(heightCm)
  const weightValue = parseNumberInput(weightKg)
  const canContinueBody = Boolean(
    isWithinRange(heightValue, HEIGHT_MIN_CM, HEIGHT_MAX_CM) &&
      isWithinRange(weightValue, WEIGHT_MIN_KG, WEIGHT_MAX_KG) &&
      sex
  )
  const canContinueGoal = useMemo(() => {
    if (goalType === 'maintain') {
      const minValue = parseNumberInput(goalRangeMin)
      const maxValue = parseNumberInput(goalRangeMax)
      return (
        isWithinRange(minValue, WEIGHT_MIN_KG, WEIGHT_MAX_KG) &&
        isWithinRange(maxValue, WEIGHT_MIN_KG, WEIGHT_MAX_KG) &&
        minValue < maxValue
      )
    }
    const maxRate = goalType === 'gain' ? GOAL_RATE_MAX_GAIN : GOAL_RATE_MAX_LOSE
    const rate = parseNumberInput(goalRate)
    const targetValue = parseNumberInput(goalTarget)
    return (
      isWithinRange(targetValue, WEIGHT_MIN_KG, WEIGHT_MAX_KG) &&
      rate > 0 &&
      rate <= maxRate
    )
  }, [goalRangeMax, goalRangeMin, goalRate, goalTarget, goalType])
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
  const handleWeightChange = useCallback((value: string) => {
    setWeightKg((prev) => {
      const next = sanitizeDecimalInput(value, { maxDecimals: 1 })
      const parsed = parseNumberInput(next)
      if (Number.isFinite(parsed) && parsed > WEIGHT_MAX_KG) {
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
  const goToStep = useCallback(
    (nextStep: number) => {
      scrollRef.current?.scrollTo({ x: nextStep * screenWidth, animated: true })
    },
    [screenWidth]
  )
  const handleNext = useCallback(() => {
    if (currentStep < STEP_COUNT - 1) {
      goToStep(currentStep + 1)
    }
  }, [currentStep, goToStep])
  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      goToStep(currentStep - 1)
    }
  }, [currentStep, goToStep])
  const handleFinish = useCallback(() => {
    if (weightValue > 0 && (goalType === 'lose' || goalType === 'gain')) {
      const targetValue = parseNumberInput(goalTarget)
      if (Number.isFinite(targetValue)) {
        const healthyRange = getHealthyTargetRangeKg(weightValue)
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
    if (weightValue > 0 && goalType === 'maintain') {
      const minValue = parseNumberInput(goalRangeMin)
      const maxValue = parseNumberInput(goalRangeMax)
      if (Number.isFinite(minValue) && Number.isFinite(maxValue)) {
        const healthyRange = getHealthyTargetRangeKg(weightValue)
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
    const birthDateISO = birthDate ? birthDate.toISOString() : undefined
    const nextProfile: Partial<ProfileData> = {
      birthDateISO,
      heightCm: heightCm ? parseNumberInput(heightCm) : undefined,
      sex,
      activityLevel,
      goalType,
      goalTargetKg: goalTarget ? parseNumberInput(goalTarget) : undefined,
      goalRateKgPerWeek: goalRate ? parseNumberInput(goalRate) : undefined,
      goalRangeMinKg: goalRangeMin ? parseNumberInput(goalRangeMin) : undefined,
      goalRangeMaxKg: goalRangeMax ? parseNumberInput(goalRangeMax) : undefined,
      onboardingComplete: true,
    }
    if (goalType === 'maintain') {
      nextProfile.goalTargetKg = undefined
      nextProfile.goalRateKgPerWeek = undefined
    } else {
      nextProfile.goalRangeMinKg = undefined
      nextProfile.goalRangeMaxKg = undefined
    }
    if (weightKg) {
      addEntry(parseNumberInput(weightKg))
    }
    updateProfile(nextProfile)
    analyticsService.createAnalyticEvent({
      screen: Screens.Onboarding,
      action: Actions.Complete,
      extraProperties: { goal_type: goalType },
    })
    onDone()
  }, [
    activityLevel,
    addEntry,
    birthDate,
    goalRangeMax,
    goalRangeMin,
    goalRate,
    goalTarget,
    goalType,
    heightCm,
    onDone,
    sex,
    updateProfile,
    weightKg,
    weightValue,
    texts,
  ])
  const onDateChange = useCallback((_event: unknown, selectedDate?: Date) => {
    if (selectedDate) {
      setBirthDate(selectedDate)
    }
  }, [])
  const onGoalTypeChange = useCallback((nextGoalType: GoalType) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setGoalType(nextGoalType)
  }, [])
  const handleMomentumEnd = useCallback(
    (offsetX: number) => {
      const nextStep = Math.round(offsetX / screenWidth)
      setCurrentStep(nextStep)
    },
    [screenWidth]
  )
  return {
    scrollRef,
    scrollX,
    screenWidth,
    progressWidth,
    currentStep,
    birthDate,
    showDatePicker,
    sex,
    setSex,
    heightCm,
    setHeightCm: handleHeightChange,
    weightKg,
    setWeightKg: handleWeightChange,
    goalType,
    goalTarget,
    setGoalTarget: handleGoalTargetChange,
    goalRate,
    setGoalRate: handleGoalRateChange,
    goalRangeMin,
    setGoalRangeMin: handleGoalRangeMinChange,
    goalRangeMax,
    setGoalRangeMax: handleGoalRangeMaxChange,
    activityLevel,
    setActivityLevel,
    canContinueAge,
    canContinueBody,
    canContinueGoal,
    handleNext,
    handleBack,
    handleFinish,
    onDateChange,
    onGoalTypeChange,
    handleMomentumEnd,
    options: {
      sex: SEX_OPTIONS,
      activity: ACTIVITY_OPTIONS,
      goalTypes: GOAL_TYPE_OPTIONS,
    },
    defaultBirthDate: DEFAULT_BIRTH_DATE,
  }
}
