import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Fonts } from '@/constants/theme';
import { onboardingOptions } from '@/data/onboarding-options';
import { useAuth } from '@/providers/auth-provider';

export default function OnboardingStepFour() {
  const router = useRouter();
  const { completeOnboarding } = useAuth();
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#373346" />
          </TouchableOpacity>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
            <View style={styles.badge}><Text style={styles.badgeText}>4</Text></View>
          </View>
        </View>

        <View style={styles.bubbleRow}>
          <View style={styles.pointer} />
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>Bạn muốn bắt đầu học cùng SUMO thế nào?</Text>
          </View>
        </View>

        <View style={styles.optionStack}>
          {onboardingOptions.learningModes.map((mode) => {
            const active = mode.id === selectedMode;
            return (
              <TouchableOpacity key={mode.id} style={[styles.modeCard, active && styles.modeCardActive]} onPress={() => setSelectedMode(mode.id)}>
                <View style={styles.modeIcon}>
                  <Ionicons name={mode.id === 'from-start' ? 'rocket-outline' : 'analytics-outline'} size={26} color="#55BA5D" />
                </View>
                <View style={styles.modeBody}>
                  <Text style={styles.modeTitle}>{mode.label}</Text>
                  <Text style={styles.modeDescription}>{mode.description}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.primaryButton, !selectedMode && styles.primaryButtonDisabled]}
          disabled={!selectedMode}
          onPress={async () => {
            await completeOnboarding();
            router.replace('/(auth)/sign-in');
          }}>
          <Text style={[styles.primaryButtonText, !selectedMode && styles.primaryButtonTextDisabled]}>Bắt đầu</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  scrollContent: { paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, marginBottom: 20 },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F8F8F8', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  progressTrack: { flex: 1, height: 12, backgroundColor: '#E0E0E0', borderRadius: 100, position: 'relative' },
  progressFill: { width: '100%', height: '100%', backgroundColor: '#55BA5D', borderRadius: 100 },
  badge: { position: 'absolute', right: -13, top: -7, width: 26, height: 26, borderRadius: 13, backgroundColor: '#55BA5D', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#ffffff' },
  badgeText: { fontFamily: Fonts.bold, fontSize: 12, color: '#ffffff' },
  bubbleRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 24, marginBottom: 20 },
  pointer: { width: 0, height: 0, borderRightWidth: 10, borderTopWidth: 10, borderBottomWidth: 10, borderRightColor: '#55BA5D', borderTopColor: 'transparent', borderBottomColor: 'transparent' },
  bubble: { flex: 1, backgroundColor: '#55BA5D', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 16 },
  bubbleText: { fontFamily: Fonts.medium, fontSize: 16, color: '#ffffff' },
  optionStack: { marginHorizontal: 24, marginBottom: 100 },
  modeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F8F8', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 20, marginBottom: 12, borderWidth: 2, borderColor: 'transparent' },
  modeCardActive: { backgroundColor: '#F0F9F1', borderColor: '#55BA5D' },
  modeIcon: { width: 64, height: 64, borderRadius: 16, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  modeBody: { flex: 1 },
  modeTitle: { fontFamily: Fonts.bold, fontSize: 16, color: '#373346', marginBottom: 2 },
  modeDescription: { fontFamily: Fonts.regular, fontSize: 12, color: '#696674', lineHeight: 18 },
  bottomBar: { paddingHorizontal: 24, paddingBottom: 20, backgroundColor: '#ffffff' },
  primaryButton: { alignItems: 'center', backgroundColor: '#55BA5D', borderRadius: 100, paddingVertical: 16 },
  primaryButtonDisabled: { backgroundColor: '#D1D1D6' },
  primaryButtonText: { fontFamily: Fonts.bold, fontSize: 18, color: '#ffffff' },
  primaryButtonTextDisabled: { color: '#696674' },
});
