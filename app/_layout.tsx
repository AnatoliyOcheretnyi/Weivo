import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider as JotaiProvider } from 'jotai';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useProfileStore } from '@/features/profile';
import { useI18nSync, useTexts } from '@/i18n';
import { useAppTheme } from '@/theme';

export const unstable_settings = {
  anchor: '(tabs)',
};

function I18nSync() {
  const { profile } = useProfileStore();
  useI18nSync(profile.language);
  return null;
}

function RootStack() {
  const { texts } = useTexts();

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
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
  );
}

function RootLayoutContent() {
  const { scheme } = useAppTheme();
  const { profile } = useProfileStore();
  const segments = useSegments();
  const router = useRouter();
  const rootState = useRootNavigationState();

  useEffect(() => {
    if (!rootState?.key || !segments.length) {
      return;
    }
    const isOnboardingRoute = segments[0] === 'onboarding';
    if (!profile.onboardingComplete && !isOnboardingRoute) {
      requestAnimationFrame(() => router.replace('/onboarding'));
      return;
    }
    if (profile.onboardingComplete && isOnboardingRoute) {
      requestAnimationFrame(() => router.replace('/(tabs)'));
    }
  }, [profile.onboardingComplete, rootState?.key, router, segments]);

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
  );
}

export default function RootLayout() {
  return (
    <JotaiProvider>
      <RootLayoutContent />
    </JotaiProvider>
  );
}
