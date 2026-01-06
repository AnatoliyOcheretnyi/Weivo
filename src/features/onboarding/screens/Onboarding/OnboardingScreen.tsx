import { useMemo } from 'react'
import { Animated, Pressable, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, type Href } from 'expo-router'
import { useProfileStore } from '@/features/profile'
import { useWeightStore } from '@/features/weight'
import { IconSymbol } from '@/shared/components/Icon'
import { useAppTheme } from '@/theme'
import { useTexts } from '@/i18n'
import { createOnboardingStyles } from './OnboardingScreen.styles'
import { STEP_COUNT } from './OnboardingScreenConstants'
import { useOnboardingScreen } from './UseOnboardingScreen'
import { WelcomeStep } from './steps/WelcomeStep'
import { AgeStep } from './steps/AgeStep'
import { BodyStep } from './steps/BodyStep'
import { GoalStep } from './steps/GoalStep'
export default function OnboardingScreen() {
  const router = useRouter()
  const { profile, updateProfile } = useProfileStore()
  const { addEntry } = useWeightStore()
  const { texts } = useTexts()
  const { colors } = useAppTheme()
  const onboardingStyles = useMemo(() => createOnboardingStyles(colors), [colors])
  const {
    scrollRef,
    scrollX,
    screenWidth,
    progressWidth,
    currentStep,
    birthDate,
    showDatePicker,
    onDateChange,
    heightCm,
    setHeightCm,
    weightKg,
    setWeightKg,
    sex,
    setSex,
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
    onGoalTypeChange,
    handleMomentumEnd,
    options,
    defaultBirthDate,
  } = useOnboardingScreen({
    profile,
    updateProfile,
    addEntry,
    onDone: () => router.replace('/(tabs)' as Href),
  })
  return (
    <SafeAreaView style={onboardingStyles.screen} edges={['top', 'left', 'right']}>
      <View style={onboardingStyles.header}>
        <Text style={onboardingStyles.title}>{texts.onboarding.title}</Text>
        <Text style={onboardingStyles.subtitle}>{texts.onboarding.subtitle}</Text>
      </View>
      <View style={onboardingStyles.progressTrack}>
        <Animated.View style={[onboardingStyles.progressFill, { width: progressWidth }]} />
      </View>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={onboardingStyles.pager}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(event) => {
          handleMomentumEnd(event.nativeEvent.contentOffset.x)
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}>
        <View style={[onboardingStyles.page, { width: screenWidth }]}>
          <WelcomeStep texts={texts} styles={onboardingStyles} />
        </View>
        <View style={[onboardingStyles.page, { width: screenWidth }]}>
          <AgeStep
            texts={texts}
            styles={onboardingStyles}
            birthDate={birthDate}
            showDatePicker={showDatePicker}
            defaultBirthDate={defaultBirthDate}
            onDateChange={onDateChange}
          />
        </View>
        <View style={[onboardingStyles.page, { width: screenWidth }]}>
          <BodyStep
            texts={texts}
            styles={onboardingStyles}
            heightCm={heightCm}
            setHeightCm={setHeightCm}
            weightKg={weightKg}
            setWeightKg={setWeightKg}
            sex={sex}
            setSex={setSex}
            sexOptions={options.sex}
          />
        </View>
        <View style={[onboardingStyles.page, { width: screenWidth }]}>
          <GoalStep
            texts={texts}
            styles={onboardingStyles}
            goalType={goalType}
            goalTarget={goalTarget}
            setGoalTarget={setGoalTarget}
            goalRate={goalRate}
            setGoalRate={setGoalRate}
            goalRangeMin={goalRangeMin}
            setGoalRangeMin={setGoalRangeMin}
            goalRangeMax={goalRangeMax}
            setGoalRangeMax={setGoalRangeMax}
            activityLevel={activityLevel}
            setActivityLevel={setActivityLevel}
            goalTypeOptions={options.goalTypes}
            activityOptions={options.activity}
            weeklyPaceUnit={`kg/${texts.home.units.weeksShort}`}
            onGoalTypeChange={onGoalTypeChange}
          />
        </View>
      </Animated.ScrollView>
      <View style={onboardingStyles.actions}>
        {currentStep === 0 ? (
          <View />
        ) : (
          <Pressable style={onboardingStyles.navButton} onPress={handleBack}>
            <IconSymbol name="chevron.left" size={16} color={colors.inkMuted} />
          </Pressable>
        )}
        <Text style={onboardingStyles.stepIndicator}>
          {texts.onboarding.stepLabel
            .replace('{current}', String(currentStep + 1))
            .replace('{total}', String(STEP_COUNT))}
        </Text>
        {currentStep < STEP_COUNT - 1 ? (
          <Pressable
            style={[
              onboardingStyles.navButton,
              onboardingStyles.navButtonPrimary,
              (currentStep === 1 && !canContinueAge) ||
              (currentStep === 2 && !canContinueBody)
                ? onboardingStyles.navButtonDisabled
                : null,
            ]}
            onPress={handleNext}
            disabled={
              (currentStep === 1 && !canContinueAge) ||
              (currentStep === 2 && !canContinueBody)
            }>
            <IconSymbol name="chevron.right" size={16} color={colors.highlight} />
          </Pressable>
        ) : (
          <Pressable
            style={[
              onboardingStyles.navButton,
              onboardingStyles.navButtonPrimary,
              !canContinueGoal && onboardingStyles.navButtonDisabled,
            ]}
            onPress={handleFinish}
            disabled={!canContinueGoal}>
            <IconSymbol name="chevron.right" size={16} color={colors.highlight} />
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  )
}
