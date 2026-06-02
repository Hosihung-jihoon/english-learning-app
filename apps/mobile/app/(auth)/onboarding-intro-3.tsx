import { useRef } from 'react';
import { ImageBackground, PanResponder, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/providers/auth-provider';

const background = require('../../assets/images/figma-onboarding-intro-3.png');

const SWIPE_THRESHOLD = 60;

export default function OnboardingIntroThree() {
  const router = useRouter();
  const { completeIntro } = useAuth();

  async function goToAuth(pathname: '/(auth)/sign-in' | '/(auth)/sign-up') {
    await completeIntro();
    router.replace(pathname);
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 8,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD) {
          router.replace('/(auth)/onboarding-intro-2');
        }
      },
    }),
  ).current;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="dark" backgroundColor="#faf8f8" />
      <ImageBackground source={background} style={styles.background} resizeMode="stretch">
        <View style={styles.overlay} {...panResponder.panHandlers}>
          <TouchableOpacity style={styles.backHitbox} onPress={() => router.replace('/(auth)/onboarding-intro-2')} />
          <TouchableOpacity style={styles.signInHitbox} onPress={() => goToAuth('/(auth)/sign-in')} />
          <TouchableOpacity style={styles.signUpHitbox} onPress={() => goToAuth('/(auth)/sign-up')} />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  background: { flex: 1, backgroundColor: '#ffffff' },
  overlay: { flex: 1 },
  backHitbox: {
    position: 'absolute',
    left: '6.1%',
    top: '6%',
    width: '13%',
    height: '7%',
  },
  signInHitbox: {
    position: 'absolute',
    left: '6.3%',
    width: '43.5%',
    bottom: '4.6%',
    height: '6.2%',
  },
  signUpHitbox: {
    position: 'absolute',
    right: '6.3%',
    width: '43.5%',
    bottom: '4.6%',
    height: '6.2%',
  },
});

