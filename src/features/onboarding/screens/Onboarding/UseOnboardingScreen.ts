import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
  type ScrollView,
} from 'react-native'
import type { ActivityLevel, GoalType, ProfileData, Sex } from '@/features/profile'
import {
  ACTIVITY_OPTIONS,
  DEFAULT_BIRTH_DATE,
  GOAL_RATE_MAX_GAIN,
  GOAL_RATE_MAX_LOSE,
  GOAL_TYPE_OPTIONS,
  SEX_OPTIONS,
  STEP_COUNT,
} from './OnboardingScreenConstants'
import { parseNumberInput } from '@/shared/utils'
type UseOnboardingScreenParams = {
  profile: ProfileData
  updateProfile: (_next: Partial<ProfileData>) => void
  addEntry: (_weightKg: number) => void
  onDone: () => void
}
export const useOnboardingScreen = ({
  profile,
  updateProfile,
  addEntry,
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
  const canContinueBody = Boolean(
    parseNumberInput(heightCm) > 0 && parseNumberInput(weightKg) > 0 && sex
  )
  const canContinueGoal = useMemo(() => {
    if (goalType === 'maintain') {
      return (
        parseNumberInput(goalRangeMin) > 0 &&
        parseNumberInput(goalRangeMax) > 0 &&
        parseNumberInput(goalRangeMin) < parseNumberInput(goalRangeMax)
      )
    }
    const maxRate = goalType === 'gain' ? GOAL_RATE_MAX_GAIN : GOAL_RATE_MAX_LOSE
    const rate = parseNumberInput(goalRate)
    return parseNumberInput(goalTarget) > 0 && rate > 0 && rate <= maxRate
  }, [goalRangeMax, goalRangeMin, goalRate, goalTarget, goalType])
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
    setHeightCm,
    weightKg,
    setWeightKg,
    goalType,
    goalTarget,
    setGoalTarget,
    goalRate,
    setGoalRate,
    goalRangeMin,
    setGoalRangeMin,
    goalRangeMax,
    setGoalRangeMax,
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
