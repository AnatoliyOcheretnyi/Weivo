import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack, useRouter, useSegments, useRootNavigationState, type Href } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Provider as JotaiProvider } from 'jotai'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useProfileStore } from '@/features/profile'
import { useGoalSegments, useWeightStore } from '@/features/weight'
import { useI18nSync, useTexts } from '@/i18n'
import { useAppTheme } from '@/theme'
import { crashlytics } from '@/shared/services/crashlytics'
import { analyticsService } from '@/shared/services/analytics'
import { getApp } from '@react-native-firebase/app'
crashlytics.init({ dsn: process.env.EXPO_PUBLIC_SENTRY_DSN })
// TODO: Disable analytics in dev before release.
void analyticsService.init({ enabled: true })
export const unstable_settings = {
  anchor: '(tabs)',
}
function I18nSync() {
  const { profile } = useProfileStore()
  useI18nSync(profile.language)
  return null
}
function RootStack() {
  const { texts } = useTexts()
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
      <Stack.Screen
        name="segment-create/index"
        options={{
          presentation: 'modal',
          title: texts.segments.createTitle,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="segment-detail/index"
        options={{
          presentation: 'modal',
          title: texts.segments.detailTitle,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile-edit/index"
        options={{
          presentation: 'modal',
          title: texts.profileEdit.title,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="modal/index"
        options={{
          presentation: 'modal',
          title: texts.modal.addEntryTitle,
          headerShown: false,
        }}
      />
    </Stack>
  )
}
function RootLayoutContent() {
  const { scheme } = useAppTheme()
  const { profile } = useProfileStore()
  const { entries } = useWeightStore()
  const { segments: goalSegments } = useGoalSegments()
  const segments = useSegments()
  const router = useRouter()
  const rootState = useRootNavigationState()
  useEffect(() => {
    try {
      console.log('firebase app', getApp().name)
    } catch {
      console.log('firebase app', 'not initialized')
    }
  }, [])
  useEffect(() => {
    if (!rootState?.key || !segments.length) {
      return
    }
    const isOnboardingRoute = segments[0] === 'onboarding'
    const hasProfileData = Boolean(
      profile.birthDateISO ||
        profile.heightCm ||
        profile.sex ||
        profile.goalType ||
        profile.goalTargetKg ||
        profile.goalRangeMinKg ||
        profile.goalRangeMaxKg ||
        profile.activityLevel
    )
    if (!profile.onboardingComplete && !hasProfileData && !isOnboardingRoute) {
      requestAnimationFrame(() => router.replace('/onboarding'))
      return
    }
    if (profile.onboardingComplete && isOnboardingRoute) {
      const tabsHref = '/(tabs)' as Href
      requestAnimationFrame(() => router.replace(tabsHref))
    }
  }, [profile.activityLevel, profile.birthDateISO, profile.goalRangeMaxKg, profile.goalRangeMinKg, profile.goalTargetKg, profile.goalType, profile.heightCm, profile.onboardingComplete, profile.sex, rootState?.key, router, segments])
  useEffect(() => {
    void analyticsService.ensureUserId()
    analyticsService.setUserProperties({
      goal_type: profile.goalType ?? null,
      units: profile.units ?? null,
      language: profile.language ?? null,
      onboarding_complete: profile.onboardingComplete ? 'true' : 'false',
      has_segments: goalSegments.length > 0 ? 'true' : 'false',
      has_entries: entries.length > 0 ? 'true' : 'false',
      theme: profile.theme ?? null,
      activity_level: profile.activityLevel ?? null,
      sex: profile.sex ?? null,
    })
  }, [
    entries.length,
    profile.activityLevel,
    profile.goalType,
    profile.language,
    profile.onboardingComplete,
    profile.sex,
    profile.theme,
    profile.units,
    goalSegments.length,
  ])
  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <I18nSync />
          <RootStack />
          <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ThemeProvider>
  )
}
export default function RootLayout() {
  return (
    <JotaiProvider>
      <RootLayoutContent />
    </JotaiProvider>
  )
}