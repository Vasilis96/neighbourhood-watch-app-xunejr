
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'home',
      label: 'Feed',
    },
    {
      name: 'sos',
      route: '/(tabs)/sos',
      icon: 'warning',
      label: 'SOS',
    },
    {
      name: 'safety',
      route: '/(tabs)/safety',
      icon: 'shield',
      label: 'Safety',
    },
    {
      name: 'community',
      route: '/(tabs)/community',
      icon: 'people',
      label: 'Community',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      icon: 'person',
      label: 'Profile',
    },
  ];

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen key="home" name="(home)" />
        <Stack.Screen key="sos" name="sos" />
        <Stack.Screen key="safety" name="safety" />
        <Stack.Screen key="community" name="community" />
        <Stack.Screen key="profile" name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} containerWidth={380} />
    </>
  );
}
