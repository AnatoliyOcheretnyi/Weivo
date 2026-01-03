import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { colors, dimensions } from '@/theme';
import { tabLayoutStyles } from './_layout.styles';
import { useTexts } from '@/i18n';

export default function TabLayout() {
  const router = useRouter();
  const { texts } = useTexts();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.inkAccent,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarStyle: tabLayoutStyles.tabBar,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: texts.tabs.home,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={dimensions.tabBar.iconSize} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: texts.tabs.add,
          tabBarButton: () => (
            <View style={tabLayoutStyles.addWrapper}>
              <Pressable style={tabLayoutStyles.addButton} onPress={() => router.push('/modal')}>
                <Text style={tabLayoutStyles.addIcon}>{texts.symbols.plus}</Text>
              </Pressable>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: texts.tabs.explore,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={dimensions.tabBar.iconSize} name="clock" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: texts.tabs.profile,
          tabBarIcon: ({ color }) => (
            <IconSymbol size={dimensions.tabBar.iconSize} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
