import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as JotaiProvider } from 'jotai';

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
      <Stack.Screen
        name="profile-edit"
        options={{
          presentation: 'modal',
          title: texts.profileEdit.title,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="modal"
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
