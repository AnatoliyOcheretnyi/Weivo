import { useRouter } from 'expo-router'
import { useEffect, useMemo } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from '@/shared/components/Button'
import { ExternalLink } from '@/shared/components/ExternalLink'
import { IconSymbol } from '@/shared/components/Icon'
import { useProfileStore } from '@/features/profile'
import { GoalSegmentTrack, useGoalSegments, useWeightStore } from '@/features/weight'
import { useTexts } from '@/i18n'
import { useAppTheme } from '@/theme'
import { createProfileStyles } from './ProfileScreen.styles'
import { useProfileScreen } from './UseProfileScreen'
import { Actions, Screens, analyticsService } from '@/shared/services/analytics'
export default function ProfileScreen() {
  const { entries } = useWeightStore()
  const { segments } = useGoalSegments()
  const { profile } = useProfileStore()
  const router = useRouter()
  const { texts, locale } = useTexts()
  const { colors, scheme } = useAppTheme()
  const profileStyles = useMemo(() => createProfileStyles(colors), [colors])
  useEffect(() => {
    analyticsService.createAnalyticEvent({
      screen: Screens.Profile,
      action: Actions.View,
    })
  }, [])
  const {
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
  } = useProfileScreen({
    entries,
    profile,
    texts,
    locale,
    scheme,
  })
  return (
    <SafeAreaView style={profileStyles.screen} edges={['top', 'left', 'right']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={profileStyles.content}
      >
        <View style={profileStyles.headerRow}>
          <View style={profileStyles.headerContent}>
            <Text style={profileStyles.title}>{texts.profile.title}</Text>
            <Text style={profileStyles.subtitle}>{texts.profile.subtitle}</Text>
          </View>
          <Button
            title={texts.profile.edit}
            variant="inverseSmall"
            onPress={() => router.push('/profile-edit')}
            style={profileStyles.editButton}
            textStyle={profileStyles.editText}
          />
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
              {latestWeight
                ? `${latestWeight.toFixed(1)} ${texts.home.units.kg}`
                : texts.profile.values.notSet}
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
            </View>
            <View style={[profileStyles.row, profileStyles.subRow]}>
              <Text style={profileStyles.subLabel}>{texts.profile.fields.caloriesMaintenance}</Text>
              <Text style={profileStyles.subValue}>
                {calories.maintenance != null
                  ? `${calories.maintenance} kcal`
                  : texts.profile.values.notSet}
              </Text>
            </View>
            <View style={[profileStyles.row, profileStyles.subRow]}>
              <Text style={profileStyles.subLabel}>{texts.profile.fields.caloriesTarget}</Text>
              <Text style={profileStyles.subValue}>
                {calories.target != null ? `${calories.target} kcal` : texts.profile.values.notSet}
              </Text>
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
                    {goalTargetKg
                      ? `${goalTargetKg.toFixed(1)} ${texts.home.units.kg}`
                      : texts.profile.values.notSet}
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
          <View style={profileStyles.sectionHeader}>
            <Text style={profileStyles.sectionTitle}>{texts.profile.sections.segments}</Text>
            <Button
              title={texts.profile.actions.addSegment}
              variant="inverseSmall"
              onPress={() => router.push('/segment-create')}
              style={profileStyles.sectionAction}
              textStyle={profileStyles.sectionActionText}
            />
          </View>
          <View style={profileStyles.card}>
            <GoalSegmentTrack segments={segments} currentKg={latestWeight ?? undefined} />
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
              <Text style={profileStyles.value}>{languageLabel}</Text>
            </View>
            <View style={profileStyles.row}>
              <Text style={profileStyles.label}>{texts.profile.fields.theme}</Text>
              <Text style={profileStyles.value}>{themeLabel}</Text>
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
  )
}
