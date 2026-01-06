import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  UIManager,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useProfileStore, type ActivityLevel, type GoalType, type Sex } from '@/features/profile';
import { useWeightStore } from '@/features/weight';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAppTheme } from '@/theme';
import { useTexts } from '@/i18n';
import { createOnboardingStyles } from './onboarding.styles';

const STEP_COUNT = 4;

export default function OnboardingScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useProfileStore();
  const { addEntry } = useWeightStore();
  const { texts } = useTexts();
  const { colors } = useAppTheme();
  const onboardingStyles = useMemo(() => createOnboardingStyles(colors), [colors]);
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentStep, setCurrentStep] = useState(0);
  const [birthDate, setBirthDate] = useState<Date | null>(
    profile.birthDateISO ? new Date(profile.birthDateISO) : null
  );
  const [showDatePicker, setShowDatePicker] = useState(true);
  const [sex, setSex] = useState<Sex>(profile.sex ?? 'male');
  const [heightCm, setHeightCm] = useState(
    profile.heightCm ? String(profile.heightCm) : ''
  );
  const [weightKg, setWeightKg] = useState('');
  const [goalType, setGoalType] = useState<GoalType>(profile.goalType ?? 'maintain');
  const [goalTarget, setGoalTarget] = useState(
    profile.goalTargetKg ? profile.goalTargetKg.toFixed(1) : ''
  );
  const [goalRate, setGoalRate] = useState(
    profile.goalRateKgPerWeek ? profile.goalRateKgPerWeek.toFixed(1) : ''
  );
  const [goalRangeMin, setGoalRangeMin] = useState(
    profile.goalRangeMinKg ? profile.goalRangeMinKg.toFixed(1) : ''
  );
  const [goalRangeMax, setGoalRangeMax] = useState(
    profile.goalRangeMaxKg ? profile.goalRangeMaxKg.toFixed(1) : ''
  );
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    profile.activityLevel ?? 'sedentary'
  );

  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const screenWidth = Dimensions.get('window').width;
  const trackWidth = screenWidth - 64;
  const progressWidth = scrollX.interpolate({
    inputRange: [0, screenWidth * (STEP_COUNT - 1)],
    outputRange: [0, trackWidth],
    extrapolate: 'clamp',
  });

  const canContinueAge = Boolean(birthDate);
  const canContinueBody = Boolean(Number(heightCm) > 0 && Number(weightKg) > 0 && sex);
  const canContinueGoal = (() => {
    if (goalType === 'maintain') {
      return Number(goalRangeMin) > 0 && Number(goalRangeMax) > 0 && Number(goalRangeMin) < Number(goalRangeMax);
    }
    const maxRate = goalType === 'gain' ? 0.5 : 1;
    const rate = Number(goalRate);
    return Number(goalTarget) > 0 && rate > 0 && rate <= maxRate;
  })();

  const goToStep = (nextStep: number) => {
    scrollRef.current?.scrollTo({ x: nextStep * screenWidth, animated: true });
  };

  const handleNext = () => {
    if (currentStep < STEP_COUNT - 1) {
      goToStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    const birthDateISO = birthDate ? birthDate.toISOString() : undefined;
    const nextProfile = {
      birthDateISO,
      heightCm: heightCm ? Number(heightCm) : undefined,
      sex,
      activityLevel,
      goalType,
      goalTargetKg: goalTarget ? Number(goalTarget) : undefined,
      goalRateKgPerWeek: goalRate ? Number(goalRate) : undefined,
      goalRangeMinKg: goalRangeMin ? Number(goalRangeMin) : undefined,
      goalRangeMaxKg: goalRangeMax ? Number(goalRangeMax) : undefined,
      onboardingComplete: true,
    };

    if (goalType === 'maintain') {
      nextProfile.goalTargetKg = undefined;
      nextProfile.goalRateKgPerWeek = undefined;
    } else {
      nextProfile.goalRangeMinKg = undefined;
      nextProfile.goalRangeMaxKg = undefined;
    }

    if (weightKg) {
      addEntry(Number(weightKg));
    }
    updateProfile(nextProfile);
    router.replace('/(tabs)');
  };

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
          const nextStep = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
          setCurrentStep(nextStep);
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}>
        <View style={[onboardingStyles.page, { width: screenWidth }]}>
          <ScrollView showsVerticalScrollIndicator={false} style={onboardingStyles.pageContent}>
            <View style={onboardingStyles.card}>
              <Text style={onboardingStyles.cardTitle}>{texts.onboarding.welcomeTitle}</Text>
              <Text style={onboardingStyles.cardBody}>{texts.onboarding.welcomeBody}</Text>
              <Text style={onboardingStyles.cardBody}>{texts.onboarding.welcomeExtra}</Text>
            </View>
          </ScrollView>
        </View>

        <View style={[onboardingStyles.page, { width: screenWidth }]}>
          <ScrollView showsVerticalScrollIndicator={false} style={onboardingStyles.pageContent}>
            <View style={onboardingStyles.card}>
            <Text style={onboardingStyles.cardTitle}>{texts.onboarding.ageTitle}</Text>
            <Text style={onboardingStyles.cardBody}>{texts.onboarding.ageBody}</Text>

            <View style={onboardingStyles.section}>
              <Text style={onboardingStyles.label}>{texts.onboarding.birthDate}</Text>
              <View style={onboardingStyles.inputRow}>
                <Text style={onboardingStyles.input}>
                  {birthDate
                    ? birthDate.toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : texts.onboarding.birthDatePlaceholder}
                </Text>
              </View>
              {showDatePicker && (
                <View style={onboardingStyles.datePickerWrap}>
                  <DateTimePicker
                    value={birthDate ?? new Date(2000, 0, 1)}
                    mode="date"
                    display="spinner"
                    maximumDate={new Date()}
                    onChange={(_, selectedDate) => {
                      if (selectedDate) {
                        setBirthDate(selectedDate);
                      }
                    }}
                  />
                </View>
              )}
              <Text style={onboardingStyles.helper}>{texts.onboarding.birthDateHelper}</Text>
            </View>

            </View>
          </ScrollView>
        </View>

        <View style={[onboardingStyles.page, { width: screenWidth }]}>
          <ScrollView showsVerticalScrollIndicator={false} style={onboardingStyles.pageContent}>
            <View style={onboardingStyles.card}>
            <Text style={onboardingStyles.cardTitle}>{texts.onboarding.bodyTitle}</Text>
            <Text style={onboardingStyles.cardBody}>{texts.onboarding.bodyBody}</Text>

            <View style={onboardingStyles.section}>
              <Text style={onboardingStyles.label}>{texts.onboarding.height}</Text>
              <View style={onboardingStyles.inputRow}>
                <TextInput
                  value={heightCm}
                  onChangeText={setHeightCm}
                  keyboardType="numeric"
                  placeholder="175"
                  placeholderTextColor={colors.inkAccent}
                  style={onboardingStyles.input}
                />
                <Text style={onboardingStyles.unit}>cm</Text>
              </View>
            </View>

            <View style={onboardingStyles.section}>
              <Text style={onboardingStyles.label}>{texts.onboarding.weight}</Text>
              <View style={onboardingStyles.inputRow}>
                <TextInput
                  value={weightKg}
                  onChangeText={setWeightKg}
                  keyboardType="numeric"
                  placeholder="85.0"
                  placeholderTextColor={colors.inkAccent}
                  style={onboardingStyles.input}
                />
                <Text style={onboardingStyles.unit}>kg</Text>
              </View>
              <Text style={onboardingStyles.helper}>{texts.onboarding.bodyHelper}</Text>
            </View>
            <Text style={onboardingStyles.scrollHint}>{texts.onboarding.activityHint}</Text>
            <View style={onboardingStyles.section}>
              <Text style={onboardingStyles.label}>{texts.onboarding.sex}</Text>
              <View style={onboardingStyles.segmentedRow}>
                {(['male', 'female'] as Sex[]).map((value) => (
                  <Pressable
                    key={value}
                    style={[
                      onboardingStyles.segment,
                      sex === value && onboardingStyles.segmentActive,
                    ]}
                    onPress={() => setSex(value)}>
                    <Text
                      style={[
                        onboardingStyles.segmentText,
                        sex === value && onboardingStyles.segmentTextActive,
                      ]}>
                      {value === 'male'
                        ? texts.profile.values.sexMale
                        : texts.profile.values.sexFemale}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            </View>
          </ScrollView>
        </View>

        <View style={[onboardingStyles.page, { width: screenWidth }]}>
          <ScrollView showsVerticalScrollIndicator={false} style={onboardingStyles.pageContent}>
            <View style={onboardingStyles.card}>
            <Text style={onboardingStyles.cardTitle}>{texts.onboarding.goalTitle}</Text>
            <Text style={onboardingStyles.cardBody}>{texts.onboarding.goalBody}</Text>

            <View style={onboardingStyles.section}>
              <Text style={onboardingStyles.label}>{texts.onboarding.goalType}</Text>
              <View style={onboardingStyles.segmentedRow}>
                {(['lose', 'maintain', 'gain'] as GoalType[]).map((type) => (
                  <Pressable
                    key={type}
                    style={[
                      onboardingStyles.segment,
                      goalType === type && onboardingStyles.segmentActive,
                    ]}
                    onPress={() => {
                      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                      setGoalType(type);
                    }}>
                    <Text
                      style={[
                        onboardingStyles.segmentText,
                        goalType === type && onboardingStyles.segmentTextActive,
                      ]}>
                      {type === 'lose'
                        ? texts.profile.values.goalLose
                        : type === 'gain'
                          ? texts.profile.values.goalGain
                          : texts.profile.values.goalMaintain}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {(goalType === 'lose' || goalType === 'gain') && (
              <View style={onboardingStyles.section}>
                <View style={onboardingStyles.goalRow}>
                  <View style={onboardingStyles.goalCol}>
                    <Text style={onboardingStyles.label}>{texts.onboarding.targetWeight}</Text>
                    <View style={[onboardingStyles.inputRow, onboardingStyles.inputRowCompact]}>
                      <TextInput
                        value={goalTarget}
                        onChangeText={setGoalTarget}
                        keyboardType="numeric"
                        placeholder="80.0"
                        placeholderTextColor={colors.inkAccent}
                        style={onboardingStyles.input}
                      />
                      <Text style={onboardingStyles.unit}>kg</Text>
                    </View>
                  </View>
                  <View style={onboardingStyles.goalCol}>
                    <Text style={onboardingStyles.label}>{texts.onboarding.weeklyPace}</Text>
                    <View style={[onboardingStyles.inputRow, onboardingStyles.inputRowCompact]}>
                      <TextInput
                        value={goalRate}
                        onChangeText={setGoalRate}
                        keyboardType="numeric"
                        placeholder="0.5"
                        placeholderTextColor={colors.inkAccent}
                        style={onboardingStyles.input}
                      />
                      <Text style={onboardingStyles.unit}>kg/{texts.home.units.weeksShort}</Text>
                    </View>
                    <Text style={onboardingStyles.helper}>
                      {goalType === 'gain'
                        ? texts.onboarding.weeklyPaceGainHelper
                        : texts.onboarding.weeklyPaceLoseHelper}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {goalType === 'maintain' && (
              <View style={onboardingStyles.section}>
                <Text style={onboardingStyles.label}>{texts.onboarding.targetRange}</Text>
                <View style={onboardingStyles.segmentedRow}>
                  <View style={[onboardingStyles.inputRow, { flex: 1 }]}>
                    <TextInput
                      value={goalRangeMin}
                      onChangeText={setGoalRangeMin}
                      keyboardType="numeric"
                      placeholder="78.0"
                      placeholderTextColor={colors.inkAccent}
                      style={onboardingStyles.input}
                    />
                    <Text style={onboardingStyles.unit}>kg</Text>
                  </View>
                  <View style={[onboardingStyles.inputRow, { flex: 1 }]}>
                    <TextInput
                      value={goalRangeMax}
                      onChangeText={setGoalRangeMax}
                      keyboardType="numeric"
                      placeholder="81.0"
                      placeholderTextColor={colors.inkAccent}
                      style={onboardingStyles.input}
                    />
                    <Text style={onboardingStyles.unit}>kg</Text>
                  </View>
                </View>
              </View>
            )}

            <View style={onboardingStyles.section}>
              <Text style={onboardingStyles.label}>{texts.onboarding.activity}</Text>
              <View style={onboardingStyles.segmentedRow}>
                {(
                  ['sedentary', 'light', 'moderate', 'active', 'veryActive'] as ActivityLevel[]
                ).map((level) => (
                  <Pressable
                    key={level}
                    style={[
                      onboardingStyles.segment,
                      activityLevel === level && onboardingStyles.segmentActive,
                    ]}
                    onPress={() => setActivityLevel(level)}>
                    <Text
                      style={[
                        onboardingStyles.segmentText,
                        activityLevel === level && onboardingStyles.segmentTextActive,
                      ]}>
                      {level === 'sedentary'
                        ? texts.profile.values.activitySedentary
                        : level === 'light'
                          ? texts.profile.values.activityLight
                          : level === 'moderate'
                            ? texts.profile.values.activityModerate
                            : level === 'active'
                              ? texts.profile.values.activityActive
                              : texts.profile.values.activityVeryActive}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Text style={onboardingStyles.helper}>
                {activityLevel === 'sedentary'
                  ? texts.profile.values.activitySedentaryDesc
                  : activityLevel === 'light'
                    ? texts.profile.values.activityLightDesc
                    : activityLevel === 'moderate'
                      ? texts.profile.values.activityModerateDesc
                      : activityLevel === 'active'
                        ? texts.profile.values.activityActiveDesc
                        : texts.profile.values.activityVeryActiveDesc}
              </Text>
            </View>
            </View>
          </ScrollView>
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
  );
}
