import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useProfileStore } from '@/features/profile';
import { useWeightStore } from '@/features/weight';
import type { ActivityLevel, GoalType, Sex, Units } from '@/features/profile';
import { profileEditStyles } from '@/theme/styles/profile-edit';
import { texts } from '@/texts';

export default function ProfileEditScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useProfileStore();
  const { entries } = useWeightStore();
  const latestWeight = entries.length > 0 ? entries[entries.length - 1].weightKg : null;
  const [birthDate, setBirthDate] = useState<Date | null>(
    profile.birthDateISO ? new Date(profile.birthDateISO) : null
  );
  const [heightCm, setHeightCm] = useState(
    profile.heightCm ? String(profile.heightCm) : ''
  );
  const [sex, setSex] = useState<Sex>(profile.sex ?? 'male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    profile.activityLevel ?? 'sedentary'
  );
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
  const [goalType, setGoalType] = useState<GoalType>(profile.goalType ?? 'maintain');
  const [units, setUnits] = useState<Units>(profile.units ?? 'metric');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const canSave = useMemo(() => {
    if (heightCm && Number.isNaN(Number(heightCm))) {
      return false;
    }
    if (goalTarget && Number.isNaN(Number(goalTarget))) {
      return false;
    }
    if (goalRate && Number.isNaN(Number(goalRate))) {
      return false;
    }
    if (goalRangeMin && Number.isNaN(Number(goalRangeMin))) {
      return false;
    }
    if (goalRangeMax && Number.isNaN(Number(goalRangeMax))) {
      return false;
    }
    if (goalType === 'lose' || goalType === 'gain') {
      if (goalRate) {
        const rate = Number(goalRate);
        const maxRate = goalType === 'gain' ? 0.5 : 1;
        if (rate <= 0 || rate > maxRate) {
          return false;
        }
      }
    }
    if (goalType === 'maintain' && goalRangeMin && goalRangeMax) {
      if (Number(goalRangeMin) >= Number(goalRangeMax)) {
        return false;
      }
    }
    return true;
  }, [heightCm, goalTarget, goalRate, goalRangeMin, goalRangeMax, goalType]);

  const handleSave = () => {
    if (!canSave) {
      return;
    }
    updateProfile({
      birthDateISO: birthDate ? birthDate.toISOString() : undefined,
      heightCm: heightCm ? Number(heightCm) : undefined,
      goalTargetKg: goalTarget ? Number(goalTarget) : undefined,
      goalRateKgPerWeek: goalRate ? Number(goalRate) : undefined,
      goalRangeMinKg: goalRangeMin ? Number(goalRangeMin) : undefined,
      goalRangeMaxKg: goalRangeMax ? Number(goalRangeMax) : undefined,
      goalType,
      sex,
      activityLevel,
      units,
    });
    router.back();
  };

  return (
    <SafeAreaView style={profileEditStyles.screen} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={profileEditStyles.card}>
          <Text style={profileEditStyles.title}>{texts.profileEdit.title}</Text>
          <Text style={profileEditStyles.subtitle}>{texts.profileEdit.subtitle}</Text>

          <View style={profileEditStyles.section}>
            <Text style={profileEditStyles.label}>{texts.profileEdit.birthDate}</Text>
            <Pressable
              style={profileEditStyles.inputRow}
              onPress={() => setShowDatePicker(true)}>
              <Text style={profileEditStyles.input}>
                {birthDate
                  ? birthDate.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : texts.profileEdit.birthDatePlaceholder}
              </Text>
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={birthDate ?? new Date(2000, 0, 1)}
                mode="date"
                display="spinner"
                maximumDate={new Date()}
                onChange={(_, selectedDate) => {
                  if (Platform.OS !== 'ios') {
                    setShowDatePicker(false);
                  }
                  if (selectedDate) {
                    setBirthDate(selectedDate);
                  }
                }}
              />
            )}
          </View>

          <View style={profileEditStyles.section}>
            <Text style={profileEditStyles.label}>{texts.profileEdit.sex}</Text>
            <View style={profileEditStyles.segmentedRow}>
              {(['male', 'female'] as Sex[]).map((value) => (
                <Pressable
                  key={value}
                  style={[
                    profileEditStyles.segment,
                    sex === value && profileEditStyles.segmentActive,
                  ]}
                  onPress={() => setSex(value)}>
                  <Text
                    style={[
                      profileEditStyles.segmentText,
                      sex === value && profileEditStyles.segmentTextActive,
                    ]}>
                    {value === 'male' ? texts.profile.values.sexMale : texts.profile.values.sexFemale}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={profileEditStyles.section}>
            <Text style={profileEditStyles.label}>{texts.profileEdit.height}</Text>
            <View style={profileEditStyles.inputRow}>
              <TextInput
                value={heightCm}
                onChangeText={setHeightCm}
                keyboardType="numeric"
                placeholder="175"
                placeholderTextColor="#B8A594"
                style={profileEditStyles.input}
              />
              <Text style={profileEditStyles.unit}>cm</Text>
            </View>
          </View>

          <View style={profileEditStyles.section}>
            <Text style={profileEditStyles.label}>{texts.profileEdit.activity}</Text>
            <View style={profileEditStyles.chipsRow}>
              {(
                ['sedentary', 'light', 'moderate', 'active', 'veryActive'] as ActivityLevel[]
              ).map((level) => (
                <Pressable
                  key={level}
                  style={[
                    profileEditStyles.segment,
                    activityLevel === level && profileEditStyles.segmentActive,
                  ]}
                  onPress={() => setActivityLevel(level)}>
                  <Text
                    style={[
                      profileEditStyles.segmentText,
                      activityLevel === level && profileEditStyles.segmentTextActive,
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
            <Text style={profileEditStyles.helper}>
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

          <View style={profileEditStyles.section}>
            <Text style={profileEditStyles.label}>{texts.profileEdit.goalType}</Text>
            <View style={profileEditStyles.segmentedRow}>
              {(['lose', 'maintain', 'gain'] as GoalType[]).map((type) => (
                <Pressable
                  key={type}
                  style={[
                    profileEditStyles.segment,
                    goalType === type && profileEditStyles.segmentActive,
                  ]}
                  onPress={() => setGoalType(type)}>
                  <Text
                    style={[
                      profileEditStyles.segmentText,
                      goalType === type && profileEditStyles.segmentTextActive,
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
            <View style={profileEditStyles.section}>
              <Text style={profileEditStyles.label}>{texts.profileEdit.goalTarget}</Text>
              <View style={profileEditStyles.inputRow}>
                <TextInput
                  value={goalTarget}
                  onChangeText={setGoalTarget}
                  keyboardType="numeric"
                  placeholder="110.0"
                  placeholderTextColor="#B8A594"
                  style={profileEditStyles.input}
                />
                <Text style={profileEditStyles.unit}>kg</Text>
              </View>
            </View>
          )}

          {(goalType === 'lose' || goalType === 'gain') && (
            <View style={profileEditStyles.section}>
              <Text style={profileEditStyles.label}>{texts.profileEdit.goalRate}</Text>
              <View style={profileEditStyles.inputRow}>
                <TextInput
                  value={goalRate}
                  onChangeText={setGoalRate}
                  keyboardType="numeric"
                  placeholder="0.5"
                  placeholderTextColor="#B8A594"
                  style={profileEditStyles.input}
                />
                <Text style={profileEditStyles.unit}>kg/week</Text>
              </View>
            </View>
          )}

          {goalType === 'maintain' && (
            <View style={profileEditStyles.section}>
              <Text style={profileEditStyles.label}>{texts.profileEdit.goalRange}</Text>
              <View style={profileEditStyles.segmentedRow}>
                <View style={[profileEditStyles.inputRow, { flex: 1 }]}>
                  <TextInput
                    value={goalRangeMin}
                    onChangeText={setGoalRangeMin}
                    keyboardType="numeric"
                    placeholder="78.0"
                    placeholderTextColor="#B8A594"
                    style={profileEditStyles.input}
                  />
                  <Text style={profileEditStyles.unit}>kg</Text>
                </View>
                <View style={profileEditStyles.rangeCurrent}>
                  <Text style={profileEditStyles.rangeCurrentText}>
                    {texts.profileEdit.currentWeight}{' '}
                    {latestWeight ? `${latestWeight.toFixed(1)} kg` : texts.profile.values.notSet}
                  </Text>
                </View>
                <View style={[profileEditStyles.inputRow, { flex: 1 }]}>
                  <TextInput
                    value={goalRangeMax}
                    onChangeText={setGoalRangeMax}
                    keyboardType="numeric"
                    placeholder="81.0"
                    placeholderTextColor="#B8A594"
                    style={profileEditStyles.input}
                  />
                  <Text style={profileEditStyles.unit}>kg</Text>
                </View>
              </View>
            </View>
          )}

          <View style={profileEditStyles.section}>
            <Text style={profileEditStyles.label}>{texts.profileEdit.units}</Text>
            <View style={profileEditStyles.segmentedRow}>
              {(['metric', 'imperial'] as Units[]).map((unit) => (
                <Pressable
                  key={unit}
                  style={[
                    profileEditStyles.segment,
                    units === unit && profileEditStyles.segmentActive,
                  ]}
                  onPress={() => setUnits(unit)}>
                  <Text
                    style={[
                      profileEditStyles.segmentText,
                      units === unit && profileEditStyles.segmentTextActive,
                    ]}>
                    {unit === 'metric'
                      ? texts.profile.values.unitsMetric
                      : texts.profile.values.unitsImperial}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={profileEditStyles.actionRow}>
            <Pressable style={profileEditStyles.cancelButton} onPress={() => router.back()}>
              <Text style={profileEditStyles.cancelText}>{texts.profileEdit.cancel}</Text>
            </Pressable>
            <Pressable style={profileEditStyles.saveButton} onPress={handleSave} disabled={!canSave}>
              <Text style={profileEditStyles.saveText}>{texts.profileEdit.save}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
