import { useRef } from 'react';
import { ImageBackground, PanResponder, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

const background = require('../../assets/images/figma-onboarding-intro-1.png');

const SWIPE_THRESHOLD = 60;

export default function OnboardingIntroOne() {
  const router = useRouter();

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 8,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -SWIPE_THRESHOLD) {
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
          <TouchableOpacity style={styles.primaryButtonHitbox} onPress={() => router.replace('/(auth)/onboarding-intro-2')} />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  background: { flex: 1, backgroundColor: '#ffffff' },
  overlay: { flex: 1 },
  primaryButtonHitbox: {
    position: 'absolute',
    left: '6.3%',
    right: '6.3%',
    bottom: '4.5%',
    height: '6.1%',
  },
});
