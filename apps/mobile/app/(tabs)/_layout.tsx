import { Tabs } from 'expo-router';
import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { HapticTab } from '@/components/haptic-tab';
import { useAuth } from '@/providers/auth-provider';

export default function TabLayout() {
  const { isLoading, onboardingComplete, token } = useAuth();
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 8);
  const capsuleHeight = 62;
  const capsuleBottom = Math.max(bottomInset - 3, 4);
  const tabBarHeight = capsuleHeight + capsuleBottom + 8;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={['top']}>
        <ActivityIndicator size="large" color="#00bd50" />
      </SafeAreaView>
    );
  }

  if (!token) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (!onboardingComplete) {
    return <Redirect href="/(auth)/onboarding-intro-1" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#ffffff',
        tabBarItemStyle: {
          paddingTop: 6,
          paddingBottom: bottomInset + 4,
        },
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          height: tabBarHeight,
          paddingTop: 0,
          paddingBottom: 0,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          elevation: 0,
          shadowOpacity: 0,
          shadowRadius: 0,
          shadowOffset: { width: 0, height: 0 },
        },
        tabBarBackground: () => (
          <View style={styles.tabBarBackdrop}>
            <View
              style={[
                styles.tabBarCapsule,
                {
                  height: capsuleHeight,
                  left: 18,
                  right: 18,
                  bottom: capsuleBottom,
                  borderTopLeftRadius: 30,
                  borderTopRightRadius: 30,
                  borderBottomLeftRadius: 28,
                  borderBottomRightRadius: 28,
                },
              ]}
            />
          </View>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Image source={require('../../assets/images/tab-home.png')} style={[styles.tabIcon, styles.homeIcon, !focused && styles.inactiveIcon]} resizeMode="contain" />
          ),
        }}
      />
      <Tabs.Screen
        name="target"
        options={{
          title: 'Target',
          tabBarIcon: ({ focused }) => (
            <Image source={require('../../assets/images/tab-target.png')} style={[styles.tabIcon, styles.targetIcon, !focused && styles.inactiveIcon]} resizeMode="contain" />
          ),
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: 'Collection',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/tab-collection.png')}
              style={[styles.tabIcon, styles.collectionIcon, !focused && styles.inactiveIcon]}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/images/tab-categories.png')}
              style={[styles.tabIcon, styles.categoriesIcon, !focused && styles.inactiveIcon]}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Image source={require('../../assets/images/tab-profile.png')} style={[styles.tabIcon, styles.profileIcon, !focused && styles.inactiveIcon]} resizeMode="contain" />
          ),
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
  tabBarBackdrop: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  tabBarCapsule: {
    position: 'absolute',
    backgroundColor: '#08bd4e',
  },
  tabIcon: {
    opacity: 1,
  },
  homeIcon: {
    width: 25,
    height: 25,
  },
  targetIcon: {
    width: 20,
    height: 25,
  },
  collectionIcon: {
    width: 25,
    height: 25,
  },
  categoriesIcon: {
    width: 25,
    height: 25,
  },
  profileIcon: {
    width: 22,
    height: 25,
  },
  inactiveIcon: {
    opacity: 0.94,
  },
});
