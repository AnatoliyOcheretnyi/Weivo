import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useWeightStore } from '@/features/weight';
import { useProfileStore } from '@/features/profile';
import { ExternalLink } from '@/components/external-link';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { colors } from '@/theme';
import { profileStyles } from '@/theme/styles/profile';
import { texts } from '@/texts';

export default function ProfileScreen() {
  const { entries } = useWeightStore();
  const { profile } = useProfileStore();
  const router = useRouter();
  const latestWeight = entries.length > 0 ? entries[entries.length - 1].weightKg : null;
  const birthDateISO = profile.birthDateISO ?? null;
  const heightCm = profile.heightCm ?? null;
  const goalType = profile.goalType ?? 'maintain';
  const goalTargetKg = profile.goalTargetKg ?? null;
  const goalRateKgPerWeek = profile.goalRateKgPerWeek ?? null;
  const goalRangeMinKg = profile.goalRangeMinKg ?? null;
  const goalRangeMaxKg = profile.goalRangeMaxKg ?? null;
  const sex = profile.sex ?? null;
  const activityLevel = profile.activityLevel ?? 'sedentary';

  const birthDateLabel = birthDateISO
    ? new Date(birthDateISO).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : texts.profile.values.notSet;
  const calculateAge = (dateISO: string) => {
    const birth = new Date(dateISO);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDelta = today.getMonth() - birth.getMonth();
    if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birth.getDate())) {
      age -= 1;
    }
    return Math.max(0, age);
  };
  const ageLabel = birthDateISO ? calculateAge(birthDateISO).toString() : texts.profile.values.notSet;
  const heightLabel = heightCm
    ? `${Math.floor(heightCm / 100)}m ${heightCm % 100}cm`
    : texts.profile.values.notSet;
  const sexLabel = sex
    ? sex === 'male'
      ? texts.profile.values.sexMale
      : texts.profile.values.sexFemale
    : texts.profile.values.notSet;
  const bmiValue =
    latestWeight && heightCm
      ? (latestWeight / Math.pow(heightCm / 100, 2)).toFixed(1)
      : texts.profile.values.notSet;
  const activityMultiplier = (() => {
    switch (activityLevel) {
      case 'light':
        return 1.375;
      case 'moderate':
        return 1.55;
      case 'active':
        return 1.725;
      case 'veryActive':
        return 1.9;
      default:
        return 1.2;
    }
  })();

  const caloriesLabel = (() => {
    if (!latestWeight || !heightCm || !birthDateISO || !sex) {
      return texts.profile.values.notSet;
    }
    const age = calculateAge(birthDateISO);
    const sexOffset = sex === 'male' ? 5 : -161;
    const bmr = 10 * latestWeight + 6.25 * heightCm - 5 * age + sexOffset;
    const tdee = bmr * activityMultiplier;
    if ((goalType === 'lose' || goalType === 'gain') && goalRateKgPerWeek) {
      const delta = (goalRateKgPerWeek * 7700) / 7;
      const target = goalType === 'lose' ? tdee - delta : tdee + delta;
      return `${texts.profile.values.caloriesMaintenance} ${Math.round(tdee)} / ${texts.profile.values.caloriesTarget} ${Math.round(target)} kcal`;
    }
    return `${texts.profile.values.caloriesMaintenance} ${Math.round(tdee)} kcal`;
  })();
  const goalTypeLabel =
    goalType === 'lose'
      ? texts.profile.values.goalLose
      : goalType === 'gain'
        ? texts.profile.values.goalGain
        : texts.profile.values.goalMaintain;
  const goalRateLabel =
    goalRateKgPerWeek && (goalType === 'lose' || goalType === 'gain')
      ? `${goalRateKgPerWeek.toFixed(1)} kg / week`
      : texts.profile.values.notSet;
  const goalRangeLabel =
    goalType === 'maintain' && goalRangeMinKg && goalRangeMaxKg
      ? `${goalRangeMinKg.toFixed(1)}–${goalRangeMaxKg.toFixed(1)} kg`
      : texts.profile.values.notSet;
  const predictionLabel = (() => {
    if (!latestWeight) {
      return texts.profile.values.notSet;
    }
    if (goalType === 'maintain') {
      if (goalRangeMinKg != null && goalRangeMaxKg != null) {
        if (latestWeight >= goalRangeMinKg && latestWeight <= goalRangeMaxKg) {
          return texts.profile.values.inRange;
        }
        if (goalRateKgPerWeek) {
          const target = latestWeight < goalRangeMinKg ? goalRangeMinKg : goalRangeMaxKg;
          const weeks = Math.ceil(Math.abs(latestWeight - target) / goalRateKgPerWeek);
          return `≈ ${weeks} weeks`;
        }
      }
      return texts.profile.values.notSet;
    }
    if (!goalTargetKg || !goalRateKgPerWeek) {
      return texts.profile.values.notSet;
    }
    const weeks = Math.ceil(Math.abs(latestWeight - goalTargetKg) / goalRateKgPerWeek);
    return `≈ ${weeks} weeks`;
  })();

  return (
    <SafeAreaView style={profileStyles.screen} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={profileStyles.headerRow}>
          <View>
            <Text style={profileStyles.title}>{texts.profile.title}</Text>
            <Text style={profileStyles.subtitle}>{texts.profile.subtitle}</Text>
          </View>
          <Pressable style={profileStyles.editButton} onPress={() => router.push('/profile-edit')}>
            <Text style={profileStyles.editText}>{texts.profile.edit}</Text>
          </Pressable>
        </View>

        <View style={profileStyles.section}>
          <Text style={profileStyles.sectionTitle}>{texts.profile.sections.basics}</Text>
          <View style={profileStyles.card}>
            <View style={profileStyles.row}>
              <Text style={profileStyles.label}>{texts.profile.fields.birthDate}</Text>
              <Text style={profileStyles.value}>{birthDateLabel}</Text>
            </View>
          <View style={profileStyles.row}>
            <Text style={profileStyles.label}>{texts.profile.fields.age}</Text>
            <Text style={profileStyles.value}>{ageLabel}</Text>
          </View>
          <View style={profileStyles.row}>
            <Text style={profileStyles.label}>{texts.profile.fields.sex}</Text>
            <Text style={profileStyles.value}>{sexLabel}</Text>
          </View>
            <View style={profileStyles.row}>
              <Text style={profileStyles.label}>{texts.profile.fields.height}</Text>
              <Text style={profileStyles.value}>{heightLabel}</Text>
            </View>
          <View style={profileStyles.row}>
            <Text style={profileStyles.label}>{texts.profile.fields.currentWeight}</Text>
            <Text style={profileStyles.value}>
              {latestWeight ? `${latestWeight.toFixed(1)} kg` : texts.profile.values.notSet}
            </Text>
          </View>
        </View>
      </View>

        <View style={profileStyles.section}>
          <Text style={profileStyles.sectionTitle}>{texts.profile.sections.metrics}</Text>
          <View style={profileStyles.card}>
            <View style={profileStyles.row}>
              <Text style={profileStyles.label}>{texts.profile.fields.bmi}</Text>
              <Text style={profileStyles.value}>{bmiValue}</Text>
            </View>
            <View style={profileStyles.row}>
              <Text style={profileStyles.label}>{texts.profile.fields.activity}</Text>
              <Text style={profileStyles.value}>
                {activityLevel === 'sedentary'
                  ? texts.profile.values.activitySedentary
                  : activityLevel === 'light'
                    ? texts.profile.values.activityLight
                    : activityLevel === 'moderate'
                      ? texts.profile.values.activityModerate
                      : activityLevel === 'active'
                        ? texts.profile.values.activityActive
                        : texts.profile.values.activityVeryActive}
              </Text>
            </View>
            <View style={profileStyles.row}>
              <Text style={profileStyles.label}>{texts.profile.fields.calories}</Text>
              <Text style={profileStyles.value}>{caloriesLabel}</Text>
            </View>
          </View>
        </View>

        <View style={profileStyles.section}>
          <Text style={profileStyles.sectionTitle}>{texts.profile.sections.goal}</Text>
          <View style={profileStyles.card}>
            <View style={profileStyles.row}>
              <Text style={profileStyles.label}>{texts.profile.fields.goalType}</Text>
              <Text style={profileStyles.value}>{goalTypeLabel}</Text>
            </View>
            {goalType !== 'maintain' && (
              <>
                <View style={profileStyles.row}>
                  <Text style={profileStyles.label}>{texts.profile.fields.goalTarget}</Text>
                  <Text style={profileStyles.value}>
                    {goalTargetKg ? `${goalTargetKg.toFixed(1)} kg` : texts.profile.values.notSet}
                  </Text>
                </View>
                <View style={profileStyles.row}>
                  <Text style={profileStyles.label}>{texts.profile.fields.goalRate}</Text>
                  <Text style={profileStyles.value}>{goalRateLabel}</Text>
                </View>
              </>
            )}
            {goalType === 'maintain' && (
              <View style={profileStyles.row}>
                <Text style={profileStyles.label}>{texts.profile.fields.goalRange}</Text>
                <Text style={profileStyles.value}>{goalRangeLabel}</Text>
              </View>
            )}
            <View style={profileStyles.row}>
              <Text style={profileStyles.label}>{texts.profile.fields.prediction}</Text>
              <Text style={profileStyles.value}>{predictionLabel}</Text>
            </View>
          </View>
        </View>

        <View style={profileStyles.section}>
          <Text style={profileStyles.sectionTitle}>{texts.profile.sections.preferences}</Text>
          <View style={profileStyles.card}>
            <View style={profileStyles.row}>
              <Text style={profileStyles.label}>{texts.profile.fields.units}</Text>
              <Text style={profileStyles.value}>
                {profile.units === 'imperial'
                  ? texts.profile.values.unitsImperial
                  : texts.profile.values.unitsMetric}
              </Text>
            </View>
            <View style={profileStyles.row}>
              <Text style={profileStyles.label}>{texts.profile.fields.language}</Text>
              <Text style={profileStyles.value}>{texts.profile.values.languageSoon}</Text>
            </View>
            <View style={profileStyles.row}>
              <Text style={profileStyles.label}>{texts.profile.fields.theme}</Text>
              <Text style={profileStyles.value}>{texts.profile.values.themeSoon}</Text>
            </View>
          </View>
        </View>

        <View style={profileStyles.section}>
          <Text style={profileStyles.sectionTitle}>{texts.profile.sections.support}</Text>
          <View style={profileStyles.card}>
            <View style={profileStyles.row}>
              <Text style={profileStyles.label}>{texts.profile.fields.feedback}</Text>
              <ExternalLink href="https://t.me/Gokotto" style={profileStyles.linkRow}>
                <Text style={profileStyles.value}>{texts.profile.values.feedbackLink}</Text>
                <View style={profileStyles.linkIcon}>
                  <IconSymbol size={14} name="arrow.up.right" color={colors.inkMuted} />
                </View>
              </ExternalLink>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
