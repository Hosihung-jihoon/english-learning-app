import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Fonts } from '@/constants/theme';
import { onboardingOptions } from '@/data/onboarding-options';

export default function OnboardingStepTwo() {
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const toggleOption = (option: string) => {
    setSelectedOptions((prev) => (prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#504D5D" />
          </TouchableOpacity>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '50%' }]} />
            <View style={styles.progressBadgeMid}><Text style={styles.progressText}>2</Text></View>
            <View style={styles.progressBadgeEnd}><Text style={styles.progressTextMuted}>4</Text></View>
          </View>
        </View>

        <View style={styles.bubbleRow}>
          <View style={styles.pointer} />
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>Bạn học tiếng Anh để phục vụ cho điều gì?</Text>
          </View>
        </View>

        <View style={styles.optionsWrap}>
          {onboardingOptions.goals.map((option) => {
            const active = selectedOptions.includes(option);
            return (
              <TouchableOpacity key={option} style={[styles.optionButton, active && styles.optionButtonActive]} onPress={() => toggleOption(option)}>
                <Text style={[styles.optionText, active && styles.optionTextActive]}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={[styles.primaryButton, selectedOptions.length === 0 && styles.primaryButtonDisabled]} disabled={selectedOptions.length === 0} onPress={() => router.push('/(auth)/onboarding-step-3')}>
          <Text style={[styles.primaryButtonText, selectedOptions.length === 0 && styles.primaryButtonTextDisabled]}>Tiếp tục</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  scrollContent: { paddingVertical: 40 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, marginBottom: 20 },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F7F7F8', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  progressTrack: { flex: 1, height: 14, backgroundColor: '#FAF8F8', borderRadius: 100, position: 'relative', justifyContent: 'center' },
  progressFill: { height: '100%', borderRadius: 100, backgroundColor: '#55BA5D' },
  progressBadgeMid: { position: 'absolute', left: '33%', marginLeft: -15, width: 30, height: 30, borderRadius: 15, backgroundColor: '#55BA5D', alignItems: 'center', justifyContent: 'center' },
  progressBadgeEnd: { position: 'absolute', right: 0, width: 30, height: 30, borderRadius: 15, backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center' },
  progressText: { fontFamily: Fonts.bold, fontSize: 14, color: '#ffffff' },
  progressTextMuted: { fontFamily: Fonts.bold, fontSize: 14, color: '#AAAAAA' },
  bubbleRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 24, marginBottom: 20 },
  pointer: { width: 0, height: 0, borderRightWidth: 10, borderTopWidth: 10, borderBottomWidth: 10, borderRightColor: '#55BA5D', borderTopColor: 'transparent', borderBottomColor: 'transparent' },
  bubble: { flex: 1, backgroundColor: '#55BA5D', borderRadius: 16, padding: 16 },
  bubbleText: { fontFamily: Fonts.medium, fontSize: 16, color: '#ffffff' },
  optionsWrap: { marginHorizontal: 24, marginBottom: 40 },
  optionButton: { alignItems: 'center', backgroundColor: '#FAF8F8', borderRadius: 50, paddingVertical: 14, marginBottom: 12, borderWidth: 2, borderColor: 'transparent' },
  optionButtonActive: { backgroundColor: '#E8F5E9', borderColor: '#55BA5D' },
  optionText: { fontFamily: Fonts.regular, fontSize: 16, color: '#504D5D' },
  optionTextActive: { fontFamily: Fonts.bold, color: '#2E7D32' },
  primaryButton: { marginHorizontal: 24, borderRadius: 50, paddingVertical: 14, alignItems: 'center', backgroundColor: '#55BA5D' },
  primaryButtonDisabled: { backgroundColor: '#CDCCD1' },
  primaryButtonText: { fontFamily: Fonts.bold, fontSize: 16, color: '#ffffff' },
  primaryButtonTextDisabled: { color: '#696674' },
});
