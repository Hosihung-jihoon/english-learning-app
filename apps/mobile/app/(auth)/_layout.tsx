import { ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect, Stack, useSegments } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/providers/auth-provider';

const onboardingIntroRoutes = new Set(['onboarding-intro-1', 'onboarding-intro-2', 'onboarding-intro-3']);
const onboardingStepRoutes = new Set(['onboarding-step-1', 'onboarding-step-2', 'onboarding-step-3', 'onboarding-step-4']);

// Routes that are safe to show even when the user has a token but hasn't
// completed onboarding. Redirecting away from these would create an infinite loop.
const tokenSafeRoutes = new Set(['sign-in', 'sign-up', ...onboardingIntroRoutes, ...onboardingStepRoutes]);

export default function AuthLayout() {
  const { introComplete, isLoading, onboardingComplete, token } = useAuth();
  const segments = useSegments();
  const currentRoute = segments[segments.length - 1];
  const isOnboardingIntroRoute = onboardingIntroRoutes.has(currentRoute);
  const isOnboardingStepRoute = onboardingStepRoutes.has(currentRoute);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={['top']}>
        <ActivityIndicator size="large" color="#00bd50" />
      </SafeAreaView>
    );
  }

  // Fully authenticated → go to main app
  if (token && onboardingComplete) {
    return <Redirect href="/(tabs)" />;
  }

  // No token + hasn't seen intro + not already on an intro screen → show intro
  if (!token && !introComplete && !isOnboardingIntroRoute) {
    return <Redirect href="/(auth)/onboarding-intro-1" />;
  }

  // No token trying to access onboarding steps (protected) → back to sign-up
  if (!token && isOnboardingStepRoute) {
    return <Redirect href="/(auth)/sign-up" />;
  }

  // Has token but onboarding incomplete — only redirect if NOT on a safe route.
  // Safe routes include sign-in, sign-up, intro screens, and step screens themselves.
  // Redirecting from sign-in/sign-up here would loop: back on step-1 → sign-up → redirect to step-1 → loop.
  if (token && !onboardingComplete && !tokenSafeRoutes.has(currentRoute)) {
    return <Redirect href="/(auth)/onboarding-step-1" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#faf8f8',
  },
});

