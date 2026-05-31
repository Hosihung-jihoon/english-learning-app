import { Tabs } from 'expo-router';
import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Image, SafeAreaView, StyleSheet } from 'react-native';
import { HapticTab } from '@/components/haptic-tab';
import { useAuth } from '@/providers/auth-provider';

export default function TabLayout() {
  const { isLoading, token } = useAuth();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#00bd50" />
      </SafeAreaView>
    );
  }

  if (!token) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#ffffff',
        tabBarStyle: {
          backgroundColor: '#00bd50',
          borderTopWidth: 0,
          height: 72,
          paddingTop: 0,
          paddingBottom: 0,
          borderTopLeftRadius: 36,
          borderTopRightRadius: 36,
          position: 'absolute',
          overflow: 'hidden',
          elevation: 0,
          shadowOpacity: 0,
          shadowRadius: 0,
          shadowOffset: { width: 0, height: 0 },
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: () => <Image source={require('../../assets/images/tab-home.png')} style={styles.tabIcon} resizeMode="contain" />,
        }}
      />
      <Tabs.Screen
        name="target"
        options={{
          title: 'Target',
          tabBarIcon: () => <Image source={require('../../assets/images/tab-target.png')} style={styles.tabIcon} resizeMode="contain" />,
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: 'Collection',
          tabBarIcon: () => <Image source={require('../../assets/images/tab-collection.png')} style={styles.tabIcon} resizeMode="contain" />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: () => <Image source={require('../../assets/images/tab-categories.png')} style={styles.tabIcon} resizeMode="contain" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: () => <Image source={require('../../assets/images/tab-profile.png')} style={styles.tabIcon} resizeMode="contain" />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#faf8f8',
  },
  tabIcon: {
    width: 24,
    height: 24,
  },
});
