import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';

export default function OnboardingStepOne() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  const [name, setName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nam');

  const scale = Math.min(width / 375, 1) * 0.9;
  const horizontal = 22 * scale;
  const isValid = name.trim().length > 0 && day.length > 0 && month.length > 0 && year.length === 4;
  const insetBottom = Math.max(insets.bottom, 16);

  function handleBack() {
    Alert.alert(
      'Quay lại?',
      'Bạn sẽ bị đăng xuất và quay về màn hình đầu tiên.',
      [
        { text: 'Ở lại', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/onboarding-intro-1');
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insetBottom + 18 * scale }}>
        <View style={[styles.header, { paddingHorizontal: horizontal, paddingTop: 14 * scale }]}>
          <TouchableOpacity style={[styles.backButton, { width: 44 * scale, height: 44 * scale, borderRadius: 22 * scale }]} onPress={handleBack}>
            <Ionicons name="chevron-back" size={22 * scale} color="#504d5d" />
          </TouchableOpacity>

          <View style={[styles.progressTrack, { height: 13 * scale, borderRadius: 6.5 * scale, marginLeft: 12 * scale }]}>
            <View style={[styles.progressFill, { width: '25%', borderRadius: 6.5 * scale }]} />
            <View style={[styles.progressBadgeStart, { width: 32 * scale, height: 32 * scale, borderRadius: 16 * scale }]}>
              <Text style={[styles.progressBadgeText, { fontSize: 15 * scale }]}>1</Text>
            </View>
            <View style={[styles.progressBadgeEnd, { width: 32 * scale, height: 32 * scale, borderRadius: 16 * scale }]}>
              <Text style={[styles.progressBadgeMuted, { fontSize: 15 * scale }]}>4</Text>
            </View>
          </View>
        </View>

        <View style={[styles.bubbleRow, { paddingHorizontal: horizontal, marginTop: 24 * scale }]}>
          <View style={[styles.avatarBubble, { width: 102 * scale, height: 102 * scale, borderRadius: 51 * scale }]}>
            <Ionicons name="happy-outline" size={54 * scale} color="#484151" />
          </View>

          <View style={[styles.messageWrap, { marginLeft: 16 * scale }]}>
            <View style={[styles.pointer, { left: -12 * scale }]} />
            <View style={[styles.messageBubble, { borderRadius: 26 * scale, paddingHorizontal: 22 * scale, paddingVertical: 20 * scale }]}>
              <Text style={[styles.messageText, { fontSize: 15 * scale, lineHeight: 22 * scale }]}>Điền thêm thông tin để chúng tôi hiểu hơn về bạn!</Text>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: horizontal, marginTop: 26 * scale }}>
          <Text style={[styles.label, { fontSize: 15 * scale, marginBottom: 12 * scale }]}>Chúng tôi có thể gọi bạn là gì?</Text>
          <TextInput
            style={[styles.input, { borderRadius: 23 * scale, height: 66 * scale, paddingHorizontal: 22 * scale, fontSize: 15 * scale }]}
            placeholder="Tên của bạn"
            placeholderTextColor="#6f6d82"
            value={name}
            onChangeText={setName}
          />

          <Text style={[styles.label, { fontSize: 15 * scale, marginTop: 30 * scale, marginBottom: 12 * scale }]}>Ngày sinh của bạn:</Text>
          <View style={[styles.dateRow, { borderRadius: 23 * scale, height: 66 * scale, paddingHorizontal: 16 * scale }]}>
            <TextInput
              style={[styles.dateInput, { fontSize: 15 * scale }]}
              placeholder="DD"
              placeholderTextColor="#6f6d82"
              keyboardType="numeric"
              maxLength={2}
              value={day}
              onChangeText={setDay}
            />
            <Text style={[styles.separator, { fontSize: 18 * scale }]}>/</Text>
            <TextInput
              style={[styles.dateInput, { fontSize: 15 * scale }]}
              placeholder="MM"
              placeholderTextColor="#6f6d82"
              keyboardType="numeric"
              maxLength={2}
              value={month}
              onChangeText={setMonth}
            />
            <Text style={[styles.separator, { fontSize: 18 * scale }]}>/</Text>
            <TextInput
              style={[styles.dateInput, { flex: 1.3, fontSize: 15 * scale }]}
              placeholder="YYYY"
              placeholderTextColor="#6f6d82"
              keyboardType="numeric"
              maxLength={4}
              value={year}
              onChangeText={setYear}
            />
          </View>

          <Text style={[styles.label, { fontSize: 15 * scale, marginTop: 30 * scale, marginBottom: 12 * scale }]}>Giới tính:</Text>
          <View style={[styles.genderRow, { gap: 12 * scale }]}>
            {(['Nam', 'Nữ'] as const).map((option) => {
              const active = gender === option;

              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.genderButton,
                    {
                      borderRadius: 23 * scale,
                      height: 66 * scale,
                    },
                    active && styles.genderButtonActive,
                  ]}
                  onPress={() => setGender(option)}>
                  <Text style={[styles.genderButtonText, { fontSize: 15 * scale }, active && styles.genderButtonTextActive]}>{option}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={[styles.successBox, { marginHorizontal: horizontal, marginTop: 144 * scale, borderRadius: 24 * scale, paddingHorizontal: 18 * scale, paddingVertical: 20 * scale }]}>
          <View style={[styles.successIcon, { width: 54 * scale, height: 54 * scale, borderRadius: 27 * scale }]}>
            <Ionicons name="happy-outline" size={29 * scale} color="#4bae53" />
          </View>
          <View style={{ flex: 1, marginLeft: 14 * scale }}>
            <Text style={[styles.successTitle, { fontSize: 15 * scale }]}>Đăng ký thành công!</Text>
            <Text style={[styles.successText, { fontSize: 13 * scale, lineHeight: 20 * scale, marginTop: 6 * scale }]}>
              Trả lời thêm một số câu hỏi cơ bản để hoàn thành cài đặt tài khoản.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.primaryButton,
            { marginHorizontal: horizontal, marginTop: 28 * scale, borderRadius: 23 * scale, height: 68 * scale },
            !isValid && styles.primaryButtonDisabled,
          ]}
          disabled={!isValid}
          onPress={() => router.push('/(auth)/onboarding-step-2')}>
          <Text style={[styles.primaryButtonText, { fontSize: 17 * scale }, !isValid && styles.primaryButtonTextDisabled]}>Tiếp tục</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', alignItems: 'center' },
  backButton: { backgroundColor: '#f7f4f4', alignItems: 'center', justifyContent: 'center' },
  progressTrack: { flex: 1, backgroundColor: '#f7f4f4', position: 'relative', justifyContent: 'center' },
  progressFill: { height: '100%', backgroundColor: '#55ba5d' },
  progressBadgeStart: { position: 'absolute', left: 0, backgroundColor: '#55ba5d', alignItems: 'center', justifyContent: 'center' },
  progressBadgeEnd: { position: 'absolute', right: 0, backgroundColor: '#f1f1f1', alignItems: 'center', justifyContent: 'center' },
  progressBadgeText: { fontFamily: Fonts.bold, color: '#ffffff' },
  progressBadgeMuted: { fontFamily: Fonts.bold, color: '#bcbcbc' },
  bubbleRow: { flexDirection: 'row', alignItems: 'center' },
  avatarBubble: { backgroundColor: '#fff4ec', alignItems: 'center', justifyContent: 'center' },
  messageWrap: { flex: 1, position: 'relative' },
  pointer: {
    position: 'absolute',
    top: '50%',
    marginTop: -12,
    width: 0,
    height: 0,
    borderTopWidth: 12,
    borderBottomWidth: 12,
    borderRightWidth: 14,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#55ba5d',
  },
  messageBubble: { backgroundColor: '#55ba5d' },
  messageText: { fontFamily: Fonts.medium, color: '#ffffff' },
  label: { fontFamily: Fonts.bold, color: '#514e64' },
  input: { backgroundColor: '#f8f5f5', fontFamily: Fonts.medium, color: '#514e64' },
  dateRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f5f5' },
  dateInput: { flex: 1, textAlign: 'center', fontFamily: Fonts.medium, color: '#514e64' },
  separator: { color: '#6f6d82' },
  genderRow: { flexDirection: 'row' },
  genderButton: { flex: 1, backgroundColor: '#f8f5f5', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'transparent' },
  genderButtonActive: { backgroundColor: '#f6fff6', borderColor: '#49a55a' },
  genderButtonText: { fontFamily: Fonts.medium, color: '#5e5c73' },
  genderButtonTextActive: { fontFamily: Fonts.bold, color: '#4f4c60' },
  successBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#d8ffd8' },
  successIcon: { backgroundColor: '#c4f8c4', alignItems: 'center', justifyContent: 'center' },
  successTitle: { fontFamily: Fonts.bold, color: '#439e4a' },
  successText: { fontFamily: Fonts.regular, color: '#3f8d46' },
  primaryButton: { backgroundColor: '#34ca53', alignItems: 'center', justifyContent: 'center' },
  primaryButtonDisabled: { backgroundColor: '#cfcfd6' },
  primaryButtonText: { fontFamily: Fonts.bold, color: '#ffffff' },
  primaryButtonTextDisabled: { color: '#676374' },
});
