import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const background = require('../../assets/images/figma-info-step-3.png');

const optionTops = ['30.2%', '39.4%', '48.6%', '57.8%'] as const;

export default function OnboardingStepThree() {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ImageBackground source={background} style={styles.background} resizeMode="stretch">
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.backHitbox} onPress={() => router.back()} />

          {optionTops.map((top, index) => (
            <React.Fragment key={top}>
              <TouchableOpacity style={[styles.optionHitbox, { top }]} onPress={() => setSelectedIndex(index)} />
              {selectedIndex === index ? <View pointerEvents="none" style={[styles.optionHighlight, { top }]} /> : null}
            </React.Fragment>
          ))}

          {selectedIndex !== null ? (
            <TouchableOpacity style={styles.bottomButton} onPress={() => router.push('/(auth)/onboarding-step-4')}>
              <Text style={styles.bottomButtonText}>Tiếp tục</Text>
            </TouchableOpacity>
          ) : null}
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
  optionHitbox: {
    position: 'absolute',
    left: '6.3%',
    right: '6.3%',
    height: '6.7%',
  },
  optionHighlight: {
    position: 'absolute',
    left: '6.3%',
    right: '6.3%',
    height: '6.7%',
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#55ba5d',
    backgroundColor: 'rgba(107, 226, 124, 0.12)',
  },
  bottomButton: {
    position: 'absolute',
    left: '6.3%',
    right: '6.3%',
    bottom: '4.7%',
    height: '6.2%',
    borderRadius: 32,
    backgroundColor: '#55ba5d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButtonText: { fontSize: 18, fontWeight: '700', color: '#ffffff' },
});
