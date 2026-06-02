import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/providers/auth-provider';

const background = require('../../assets/images/figma-info-step-4.png');

export default function OnboardingStepFour() {
  const router = useRouter();
  const { completeOnboarding } = useAuth();
  const [selectedMode, setSelectedMode] = useState<'from-start' | 'placement-test'>('placement-test');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ImageBackground source={background} style={styles.background} resizeMode="stretch">
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.backHitbox} onPress={() => router.back()} />

          <TouchableOpacity style={styles.firstCardHitbox} onPress={() => setSelectedMode('from-start')} />
          <TouchableOpacity style={styles.secondCardHitbox} onPress={() => setSelectedMode('placement-test')} />

          {selectedMode === 'from-start' ? <View pointerEvents="none" style={styles.firstCardHighlight} /> : null}
          {selectedMode === 'placement-test' ? <View pointerEvents="none" style={styles.secondCardHighlight} /> : null}

          <TouchableOpacity
            style={styles.bottomButton}
            onPress={async () => {
              await completeOnboarding();
              router.replace('/(tabs)');
            }}>
            <Text style={styles.bottomButtonText}>Bắt đầu</Text>
          </TouchableOpacity>
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
  firstCardHitbox: {
    position: 'absolute',
    left: '6.3%',
    right: '6.3%',
    top: '30.1%',
    height: '12.1%',
  },
  secondCardHitbox: {
    position: 'absolute',
    left: '6.3%',
    right: '6.3%',
    top: '43.7%',
    height: '12.1%',
  },
  firstCardHighlight: {
    position: 'absolute',
    left: '6.3%',
    right: '6.3%',
    top: '30.1%',
    height: '12.1%',
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#55ba5d',
    backgroundColor: 'rgba(107, 226, 124, 0.08)',
  },
  secondCardHighlight: {
    position: 'absolute',
    left: '6.3%',
    right: '6.3%',
    top: '43.7%',
    height: '12.1%',
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#55ba5d',
    backgroundColor: 'rgba(107, 226, 124, 0.08)',
  },
  bottomButton: {
    position: 'absolute',
    left: '6.3%',
    right: '6.3%',
    bottom: '4.6%',
    height: '6.2%',
    borderRadius: 32,
    backgroundColor: '#55ba5d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButtonText: { fontSize: 18, fontWeight: '700', color: '#ffffff' },
});
