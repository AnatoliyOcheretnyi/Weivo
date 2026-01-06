import { Pressable, ScrollView, Text, View } from 'react-native'
import { Input } from '@/shared/components/Input'
import type { ActivityLevel, GoalType } from '@/features/profile'
import type { Texts } from '@/i18n'
type GoalStepProps = {
  texts: Texts
  styles: Record<string, any>
  goalType: GoalType
  goalTarget: string
  setGoalTarget: (_value: string) => void
  goalRate: string
  setGoalRate: (_value: string) => void
  goalRangeMin: string
  setGoalRangeMin: (_value: string) => void
  goalRangeMax: string
  setGoalRangeMax: (_value: string) => void
  activityLevel: ActivityLevel
  setActivityLevel: (_value: ActivityLevel) => void
  goalTypeOptions: readonly GoalType[]
  activityOptions: readonly ActivityLevel[]
  weeklyPaceUnit: string
  onGoalTypeChange: (_value: GoalType) => void
}
export function GoalStep({
  texts,
  styles,
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
  goalTypeOptions,
  activityOptions,
  weeklyPaceUnit,
  onGoalTypeChange,
}: GoalStepProps) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.pageContent}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{texts.onboarding.goalTitle}</Text>
        <Text style={styles.cardBody}>{texts.onboarding.goalBody}</Text>
        <View style={styles.section}>
          <Text style={styles.label}>{texts.onboarding.goalType}</Text>
          <View style={styles.segmentedRow}>
            {goalTypeOptions.map((type) => (
              <Pressable
                key={type}
                style={[
                  styles.segment,
                  goalType === type && styles.segmentActive,
                ]}
                onPress={() => {
                  onGoalTypeChange(type)
                }}>
                <Text
                  style={[
                    styles.segmentText,
                    goalType === type && styles.segmentTextActive,
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
          <View style={styles.section}>
            <View style={styles.goalRow}>
              <View style={styles.goalCol}>
                <Text style={styles.label}>{texts.onboarding.targetWeight}</Text>
                <Input
                  variant="compact"
                  value={goalTarget}
                  onChangeText={setGoalTarget}
                  keyboardType="numeric"
                  placeholder="80.0"
                  inputStyle={styles.input}
                  unit="kg"
                  unitStyle={styles.unit}
                />
              </View>
              <View style={styles.goalCol}>
                <Text style={styles.label}>{texts.onboarding.weeklyPace}</Text>
                <Input
                  variant="compact"
                  value={goalRate}
                  onChangeText={setGoalRate}
                  keyboardType="numeric"
                  placeholder="0.5"
                  inputStyle={styles.input}
                  unit={weeklyPaceUnit}
                  unitStyle={styles.unit}
                />
                <Text style={styles.helper}>
                  {goalType === 'gain'
                    ? texts.onboarding.weeklyPaceGainHelper
                    : texts.onboarding.weeklyPaceLoseHelper}
                </Text>
              </View>
            </View>
          </View>
        )}
        {goalType === 'maintain' && (
          <View style={styles.section}>
            <Text style={styles.label}>{texts.onboarding.targetRange}</Text>
            <View style={styles.segmentedRow}>
              <Input
                variant="compact"
                value={goalRangeMin}
                onChangeText={setGoalRangeMin}
                keyboardType="numeric"
                placeholder="78.0"
                inputStyle={styles.input}
                unit="kg"
                unitStyle={styles.unit}
                containerStyle={{ flex: 1 }}
              />
              <Input
                variant="compact"
                value={goalRangeMax}
                onChangeText={setGoalRangeMax}
                keyboardType="numeric"
                placeholder="81.0"
                inputStyle={styles.input}
                unit="kg"
                unitStyle={styles.unit}
                containerStyle={{ flex: 1 }}
              />
            </View>
          </View>
        )}
        <View style={styles.section}>
          <Text style={styles.label}>{texts.onboarding.activity}</Text>
          <View style={styles.segmentedRow}>
            {activityOptions.map((level) => (
              <Pressable
                key={level}
                style={[
                  styles.segment,
                  activityLevel === level && styles.segmentActive,
                ]}
                onPress={() => setActivityLevel(level)}>
                <Text
                  style={[
                    styles.segmentText,
                    activityLevel === level && styles.segmentTextActive,
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
          <Text style={styles.helper}>
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
  )
}
