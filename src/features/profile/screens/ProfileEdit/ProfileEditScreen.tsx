import { useMemo } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import DateTimePicker from '@react-native-community/datetimepicker'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { Button } from '@/shared/components/Button'
import { Input } from '@/shared/components/Input'
import { useProfileStore } from '@/features/profile'
import { useWeightStore } from '@/features/weight'
import { themes, useAppTheme } from '@/theme'
import { createProfileEditStyles } from './ProfileEditScreen.styles'
import { localeLabels, useTexts } from '@/i18n'
import { useProfileEditScreen } from './UseProfileEditScreen'
export default function ProfileEditScreen() {
  const router = useRouter()
  const { profile, updateProfile } = useProfileStore()
  const { entries } = useWeightStore()
  const { texts, locale } = useTexts()
  const { colors, scheme } = useAppTheme()
  const profileEditStyles = useMemo(() => createProfileEditStyles(colors), [colors])
  const {
    latestWeight,
    editTab,
    setEditTab,
    birthDate,
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
    tabs,
    sexOptions,
    activityOptions,
    goalTypeOptions,
    unitOptions,
    languageOptions,
    themeOptions,
    defaultBirthDate,
  } = useProfileEditScreen({
    profile,
    entries,
    texts,
    locale,
    scheme,
    updateProfile,
    onDone: router.back,
  })
  return (
    <SafeAreaView style={profileEditStyles.screen} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={profileEditStyles.card}>
          <Text style={profileEditStyles.title}>{texts.profileEdit.title}</Text>
          <Text style={profileEditStyles.subtitle}>{texts.profileEdit.subtitle}</Text>
          <View style={profileEditStyles.tabsRow}>
            {tabs.map((tab) => (
              <Pressable
                key={tab}
                style={[
                  profileEditStyles.tabButton,
                  editTab === tab && profileEditStyles.tabButtonActive,
                ]}
                onPress={() => setEditTab(tab)}>
                <Text
                  style={[
                    profileEditStyles.tabText,
                    editTab === tab && profileEditStyles.tabTextActive,
                  ]}>
                  {tab === 'profile'
                    ? texts.profileEdit.tabs.profile
                    : texts.profileEdit.tabs.account}
                </Text>
              </Pressable>
            ))}
          </View>
          <Animated.View
            key={editTab}
            entering={FadeIn.duration(220)}
            exiting={FadeOut.duration(160)}>
            {editTab === 'profile' ? (
              <>
              <View style={profileEditStyles.section}>
                <Text style={profileEditStyles.label}>{texts.profileEdit.birthDate}</Text>
                <Pressable
                  style={profileEditStyles.inputRow}
                  onPress={() => setShowDatePicker(true)}>
                  <Text style={profileEditStyles.input}>
                    {birthDate
                      ? birthDate.toLocaleDateString(locale, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : texts.profileEdit.birthDatePlaceholder}
                  </Text>
                </Pressable>
                {showDatePicker && (
                  <DateTimePicker
                    value={birthDate ?? defaultBirthDate}
                    mode="date"
                    display="spinner"
                    maximumDate={new Date()}
                    onChange={onDateChange}
                  />
                )}
              </View>
              <View style={profileEditStyles.section}>
                <Text style={profileEditStyles.label}>{texts.profileEdit.sex}</Text>
                <View style={profileEditStyles.segmentedRow}>
                  {sexOptions.map((value) => (
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
                        {value === 'male'
                          ? texts.profile.values.sexMale
                          : texts.profile.values.sexFemale}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
              <View style={profileEditStyles.section}>
                <Text style={profileEditStyles.label}>{texts.profileEdit.height}</Text>
                <Input
                  variant="compact"
                  value={heightCm}
                  onChangeText={setHeightCm}
                  keyboardType="numeric"
                  placeholder="175"
                  inputStyle={profileEditStyles.input}
                  unit="cm"
                  unitStyle={profileEditStyles.unit}
                />
              </View>
              <View style={profileEditStyles.section}>
                <Text style={profileEditStyles.label}>{texts.profileEdit.activity}</Text>
                <View style={profileEditStyles.chipsRow}>
                  {activityOptions.map((level) => (
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
                  {goalTypeOptions.map((type) => (
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
                  <View style={profileEditStyles.goalRow}>
                    <View style={profileEditStyles.goalCol}>
                      <Text style={profileEditStyles.label}>{texts.profileEdit.goalTarget}</Text>
                      <Input
                        variant="compact"
                        value={goalTarget}
                        onChangeText={setGoalTarget}
                        keyboardType="numeric"
                        placeholder="110.0"
                        inputStyle={profileEditStyles.input}
                        unit="kg"
                        unitStyle={profileEditStyles.unit}
                      />
                    </View>
                    <View style={profileEditStyles.goalCol}>
                      <Text style={profileEditStyles.label}>{texts.profileEdit.goalRate}</Text>
                      <Input
                        variant="compact"
                        value={goalRate}
                        onChangeText={setGoalRate}
                        keyboardType="numeric"
                        placeholder="0.5"
                        inputStyle={profileEditStyles.input}
                        unit={`kg/${texts.home.units.weeksShort}`}
                        unitStyle={profileEditStyles.unit}
                      />
                    </View>
                  </View>
                </View>
              )}
              {goalType === 'maintain' && (
                <View style={profileEditStyles.section}>
                  <Text style={profileEditStyles.label}>{texts.profileEdit.goalRange}</Text>
                  <View style={profileEditStyles.rangeRow}>
                    <View style={profileEditStyles.rangeCol}>
                      <Input
                        variant="compact"
                        value={goalRangeMin}
                        onChangeText={setGoalRangeMin}
                        keyboardType="numeric"
                        placeholder="78.0"
                        inputStyle={profileEditStyles.input}
                        unit="kg"
                        unitStyle={profileEditStyles.unit}
                      />
                    </View>
                    <View style={profileEditStyles.rangeCurrent} pointerEvents="none">
                      <Text style={profileEditStyles.rangeCurrentLabel}>
                        {texts.profileEdit.currentWeight}
                      </Text>
                      <Text style={profileEditStyles.rangeCurrentValue}>
                        {latestWeight ? `${latestWeight.toFixed(1)} kg` : texts.profile.values.notSet}
                      </Text>
                    </View>
                    <View style={profileEditStyles.rangeCol}>
                      <Input
                        variant="compact"
                        value={goalRangeMax}
                        onChangeText={setGoalRangeMax}
                        keyboardType="numeric"
                        placeholder="81.0"
                        inputStyle={profileEditStyles.input}
                        unit="kg"
                        unitStyle={profileEditStyles.unit}
                      />
                    </View>
                  </View>
                </View>
              )}
              </>
            ) : (
              <>
              <View style={profileEditStyles.section}>
                <Text style={profileEditStyles.label}>{texts.profileEdit.language}</Text>
                <View style={profileEditStyles.segmentedRow}>
                  {languageOptions.map((option) => (
                    <Pressable
                      key={option}
                      style={[
                        profileEditStyles.segment,
                        language === option && profileEditStyles.segmentActive,
                      ]}
                      onPress={() => setLanguage(option)}>
                      <Text
                        style={[
                          profileEditStyles.segmentText,
                          language === option && profileEditStyles.segmentTextActive,
                        ]}>
                        {localeLabels[option]}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
              <View style={profileEditStyles.section}>
                <Text style={profileEditStyles.label}>{texts.profileEdit.theme}</Text>
                <View style={profileEditStyles.chipsRow}>
                  {themeOptions.map((option) => {
                    const optionColors = themes[option]
                    const isDark = option === 'dark'
                    return (
                      <Pressable
                        key={option}
                        style={[
                          profileEditStyles.themeChip,
                          {
                            backgroundColor: optionColors.creamWarm,
                            borderColor: isDark
                              ? optionColors.highlight
                              : optionColors.creamLine,
                          },
                          theme === option && profileEditStyles.themeChipActive,
                          theme === option && isDark && profileEditStyles.themeChipActiveDark,
                        ]}
                        onPress={() => setTheme(option)}>
                        <Text
                          style={[
                            profileEditStyles.themeChipText,
                            { color: optionColors.ink },
                            theme === option && profileEditStyles.themeChipTextActive,
                          ]}>
                          {themeLabel(option)}
                        </Text>
                      </Pressable>
                    )
                  })}
                </View>
              </View>
              <View style={profileEditStyles.section}>
                <Text style={profileEditStyles.label}>{texts.profileEdit.units}</Text>
                <View style={profileEditStyles.segmentedRow}>
                  {unitOptions.map((unit) => (
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
              </>
            )}
          </Animated.View>
          <View style={profileEditStyles.actionRow}>
            <Button
              title={texts.profileEdit.cancel}
              variant="inverse"
              onPress={() => router.back()}
              style={profileEditStyles.actionButton}
            />
            <Button
              title={texts.profileEdit.save}
              onPress={handleSave}
              disabled={!canSave}
              style={profileEditStyles.actionButton}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
