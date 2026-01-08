import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Redirect, Stack, useSegments, useRootNavigationState } from 'expo-router'
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
function RootStack({
  initialRouteName,
}: {
  initialRouteName: '(tabs)' | 'onboarding/index'
}) {
  const { texts } = useTexts()
  return (
    <Stack initialRouteName={initialRouteName}>
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
  const rootState = useRootNavigationState()
  useEffect(() => {
    try {
      console.log('firebase app', getApp().name)
    } catch {
      console.log('firebase app', 'not initialized')
    }
  }, [])
  const navigationReady = Boolean(rootState?.key && segments.length)
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
  const shouldShowOnboarding = !profile.onboardingComplete && !hasProfileData
  const initialRouteName = shouldShowOnboarding ? 'onboarding/index' : '(tabs)'
  const shouldBlockUI =
    !navigationReady ||
    (shouldShowOnboarding && !isOnboardingRoute) ||
    (!shouldShowOnboarding && isOnboardingRoute)
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
  if (navigationReady && shouldShowOnboarding && !isOnboardingRoute) {
    return <Redirect href="/onboarding" />
  }
  if (navigationReady && !shouldShowOnboarding && isOnboardingRoute) {
    return <Redirect href="/(tabs)" />
  }
  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <I18nSync />
          <RootStack
            key={initialRouteName}
            initialRouteName={initialRouteName}
          />
          <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
          {shouldBlockUI ? (
            <GestureHandlerRootView
              style={{
                backgroundColor: scheme === 'dark' ? '#000' : '#EFE4D7',
                bottom: 0,
                left: 0,
                position: 'absolute',
                right: 0,
                top: 0,
              }}
            />
          ) : null}
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
