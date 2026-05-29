import { Redirect } from 'expo-router';
import { ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native';
import { useAuth } from '@/providers/auth-provider';

export default function AppEntry() {
  const { isLoading, onboardingComplete, token } = useAuth();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#00bd50" />
      </SafeAreaView>
    );
  }

  if (!onboardingComplete) {
    return <Redirect href="/(auth)/onboarding-step-1" />;
  }

  if (!token) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#faf8f8',
  },
});
