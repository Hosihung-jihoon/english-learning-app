import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Fonts } from '@/constants/theme';
import { onboardingOptions } from '@/data/onboarding-options';

export default function OnboardingStepThree() {
  const router = useRouter();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#504D5D" />
          </TouchableOpacity>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '70%' }]} />
            <View style={styles.badgeThree}><Text style={styles.badgeThreeText}>3</Text></View>
            <View style={styles.badgeFour}><Text style={styles.badgeFourText}>4</Text></View>
          </View>
        </View>

        <View style={styles.bubbleRow}>
          <View style={styles.pointer} />
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>Thời gian học tập hằng ngày của bạn là:</Text>
          </View>
        </View>

        <View style={styles.optionsWrap}>
          {onboardingOptions.dailyTime.map((option) => {
            const active = option === selectedTime;
            return (
              <TouchableOpacity key={option} style={[styles.optionButton, active && styles.optionButtonActive]} onPress={() => setSelectedTime(option)}>
                <Text style={[styles.optionText, active && styles.optionTextActive]}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={[styles.primaryButton, !selectedTime && styles.primaryButtonDisabled]} disabled={!selectedTime} onPress={() => router.push('/(auth)/onboarding-step-4')}>
          <Text style={[styles.primaryButtonText, !selectedTime && styles.primaryButtonTextDisabled]}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  scrollContent: { paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, marginBottom: 20 },
  backButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F7F7F8', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  progressTrack: { flex: 1, height: 12, borderRadius: 6, backgroundColor: '#F7F7F8', position: 'relative', justifyContent: 'center' },
  progressFill: { height: '100%', borderRadius: 6, backgroundColor: '#55BA5D' },
  badgeThree: { position: 'absolute', left: '70%', marginLeft: -18, width: 36, height: 36, borderRadius: 18, backgroundColor: '#55BA5D', alignItems: 'center', justifyContent: 'center' },
  badgeThreeText: { fontFamily: Fonts.bold, fontSize: 16, color: '#ffffff' },
  badgeFour: { position: 'absolute', right: 0, width: 36, height: 36, borderRadius: 18, backgroundColor: '#F2F2F4', alignItems: 'center', justifyContent: 'center' },
  badgeFourText: { fontFamily: Fonts.bold, fontSize: 16, color: '#CDCCD1' },
  bubbleRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 24, marginBottom: 20 },
  pointer: { width: 0, height: 0, borderRightWidth: 10, borderTopWidth: 10, borderBottomWidth: 10, borderRightColor: '#55BA5D', borderTopColor: 'transparent', borderBottomColor: 'transparent' },
  bubble: { flex: 1, backgroundColor: '#55BA5D', borderRadius: 16, padding: 16 },
  bubbleText: { fontFamily: Fonts.medium, fontSize: 16, color: '#ffffff' },
  optionsWrap: { marginHorizontal: 24, marginBottom: 40 },
  optionButton: { alignItems: 'center', backgroundColor: '#FAF8F8', borderRadius: 50, paddingVertical: 14, marginBottom: 12, borderWidth: 2, borderColor: 'transparent' },
  optionButtonActive: { backgroundColor: '#55BA5D', borderColor: '#55BA5D' },
  optionText: { fontFamily: Fonts.medium, fontSize: 16, color: '#504D5D' },
  optionTextActive: { fontFamily: Fonts.bold, color: '#ffffff' },
  bottomBar: { paddingHorizontal: 24, paddingBottom: 20, backgroundColor: '#ffffff' },
  primaryButton: { alignItems: 'center', borderRadius: 50, paddingVertical: 16, backgroundColor: '#55BA5D' },
  primaryButtonDisabled: { backgroundColor: '#CDCCD1' },
  primaryButtonText: { fontFamily: Fonts.bold, fontSize: 18, color: '#ffffff' },
  primaryButtonTextDisabled: { color: '#696674' },
});
