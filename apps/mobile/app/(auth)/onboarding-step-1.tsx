import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Fonts } from '@/constants/theme';

export default function OnboardingStepOne() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nam');
  const isValid = name.trim().length > 0 && day.length > 0 && month.length > 0 && year.length === 4;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(auth)/sign-up')}>
            <Ionicons name="chevron-back" size={24} color="#504D5D" />
          </TouchableOpacity>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '25%' }]} />
            <View style={styles.progressBadgeLeft}><Text style={styles.progressBadgeText}>1</Text></View>
            <View style={styles.progressBadgeRight}><Text style={styles.progressBadgeTextMuted}>4</Text></View>
          </View>
        </View>

        <View style={styles.bubbleRow}>
          <View style={styles.bubblePointer} />
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>Điền thêm thông tin để chúng tôi hiểu hơn về bạn!</Text>
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Chúng tôi có thể gọi bạn là gì?</Text>
          <TextInput style={styles.input} placeholder="Tên của bạn" placeholderTextColor="#BDBDBD" value={name} onChangeText={setName} />

          <Text style={styles.label}>Ngày sinh của bạn:</Text>
          <View style={styles.dateRow}>
            <TextInput style={styles.dateInput} placeholder="DD" placeholderTextColor="#BDBDBD" keyboardType="numeric" value={day} onChangeText={setDay} maxLength={2} />
            <Text style={styles.separator}>/</Text>
            <TextInput style={styles.dateInput} placeholder="MM" placeholderTextColor="#BDBDBD" keyboardType="numeric" value={month} onChangeText={setMonth} maxLength={2} />
            <Text style={styles.separator}>/</Text>
            <TextInput style={[styles.dateInput, { flex: 1.5 }]} placeholder="YYYY" placeholderTextColor="#BDBDBD" keyboardType="numeric" value={year} onChangeText={setYear} maxLength={4} />
          </View>

          <Text style={styles.label}>Giới tính:</Text>
          <View style={styles.genderRow}>
            {(['Nam', 'Nữ'] as const).map((option) => (
              <TouchableOpacity key={option} style={[styles.genderButton, gender === option && styles.genderButtonActive]} onPress={() => setGender(option)}>
                <Text style={[styles.genderButtonText, gender === option && styles.genderButtonTextActive]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.successBox}>
          <Ionicons name="happy-outline" size={30} color="#48A05D" />
          <View style={styles.successBody}>
            <Text style={styles.successTitle}>Đăng ký thành công!</Text>
            <Text style={styles.successText}>Trả lời thêm một số câu hỏi cơ bản để hoàn thành cài đặt tài khoản.</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.primaryButton, !isValid && styles.primaryButtonDisabled]} disabled={!isValid} onPress={() => router.push('/(auth)/onboarding-step-2')}>
          <Text style={styles.primaryButtonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  scrollContent: { paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16 },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F2F2F2', alignItems: 'center', justifyContent: 'center', marginRight: 20 },
  progressTrack: { flex: 1, height: 10, borderRadius: 5, backgroundColor: '#F2F2F2', position: 'relative', justifyContent: 'center' },
  progressFill: { height: '100%', borderRadius: 5, backgroundColor: '#55BA5D' },
  progressBadgeLeft: { position: 'absolute', left: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: '#55BA5D', alignItems: 'center', justifyContent: 'center' },
  progressBadgeRight: { position: 'absolute', right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: '#F2F2F2', alignItems: 'center', justifyContent: 'center' },
  progressBadgeText: { fontFamily: Fonts.bold, fontSize: 14, color: '#ffffff' },
  progressBadgeTextMuted: { fontFamily: Fonts.bold, fontSize: 14, color: '#BDBDBD' },
  bubbleRow: { marginHorizontal: 24, marginTop: 12, marginBottom: 30, flexDirection: 'row', alignItems: 'center' },
  bubblePointer: { width: 0, height: 0, borderTopWidth: 10, borderBottomWidth: 10, borderRightWidth: 10, borderTopColor: 'transparent', borderBottomColor: 'transparent', borderRightColor: '#55BA5D' },
  bubble: { flex: 1, backgroundColor: '#55BA5D', borderRadius: 20, padding: 16 },
  bubbleText: { fontFamily: Fonts.semiBold, fontSize: 15, lineHeight: 22, color: '#ffffff' },
  form: { paddingHorizontal: 24 },
  label: { fontFamily: Fonts.bold, fontSize: 16, color: '#333333', marginBottom: 12, marginTop: 12 },
  input: { backgroundColor: '#F9F9F9', borderRadius: 25, paddingHorizontal: 20, paddingVertical: 15, fontFamily: Fonts.regular, fontSize: 16, color: '#333333' },
  dateRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F9F9', borderRadius: 25, paddingHorizontal: 15 },
  dateInput: { flex: 1, paddingVertical: 15, textAlign: 'center', fontFamily: Fonts.regular, fontSize: 16, color: '#333333' },
  separator: { marginHorizontal: 5, fontSize: 18, color: '#BDBDBD' },
  genderRow: { flexDirection: 'row', gap: 12 },
  genderButton: { flex: 1, backgroundColor: '#F9F9F9', borderRadius: 25, paddingVertical: 15, alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
  genderButtonActive: { backgroundColor: '#F9FFF8', borderColor: '#55BA5D' },
  genderButtonText: { fontFamily: Fonts.semiBold, fontSize: 16, color: '#828282' },
  genderButtonTextActive: { color: '#333333' },
  successBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', borderRadius: 20, marginHorizontal: 24, marginTop: 24, padding: 16 },
  successBody: { flex: 1, marginLeft: 12 },
  successTitle: { fontFamily: Fonts.bold, fontSize: 16, color: '#2E7D32', marginBottom: 4 },
  successText: { fontFamily: Fonts.regular, fontSize: 13, lineHeight: 18, color: '#2E7D32' },
  primaryButton: { marginHorizontal: 24, marginTop: 30, backgroundColor: '#55BA5D', borderRadius: 25, paddingVertical: 16, alignItems: 'center' },
  primaryButtonDisabled: { opacity: 0.7 },
  primaryButtonText: { fontFamily: Fonts.bold, fontSize: 16, color: '#ffffff' },
});
