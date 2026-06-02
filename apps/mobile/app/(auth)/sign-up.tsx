import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';

export default function SignUpScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showLinkInfo, setShowLinkInfo] = useState(false);

  const scale = Math.min(width / 375, 1) * 0.92;
  const heroHeight = 292 * scale;
  const horizontal = 24 * scale;
  const socialSize = 72 * scale;
  const insetBottom = Math.max(insets.bottom, 16);

  const handleSubmit = async () => {
    if (submitting) {
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận chưa khớp');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const fallbackName = email.split('@')[0] || 'Student';
      await signUp({ name: fallbackName, email, password });
      router.replace('/(tabs)');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Đăng ký thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = !!email && !!password && !!confirmPassword && agree && !submitting;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen options={{ headerShown: false, title: 'Đăng ký' }} />
      <StatusBar style="light" backgroundColor="#5fc865" />

      <KeyboardAvoidingView style={styles.keyboardWrap} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.scrollContent, { paddingBottom: insetBottom }]}>
          <View style={[styles.hero, { height: heroHeight }]}>
            <TouchableOpacity
              style={[styles.heroBackButton, { top: insets.top + 12 * scale, left: 18 * scale, width: 40 * scale, height: 40 * scale, borderRadius: 20 * scale }]}
              onPress={() => router.replace('/(auth)/sign-in')}>
              <Ionicons name="chevron-back" size={22 * scale} color="#ffffff" />
            </TouchableOpacity>
            <Text style={[styles.logo, { fontSize: 48 * scale }]}>JHUDABEO</Text>
          </View>

          <View
            style={[
              styles.sheet,
              {
                marginTop: -42 * scale,
                borderTopLeftRadius: 52 * scale,
                borderTopRightRadius: 52 * scale,
                paddingHorizontal: horizontal,
                paddingTop: 40 * scale,
                paddingBottom: insetBottom + 20 * scale,
              },
            ]}>
            <Text style={[styles.title, { fontSize: 27 * scale }]}>Tạo tài khoản</Text>
            <Text style={[styles.subtitle, { fontSize: 15 * scale, marginTop: 8 * scale }]}>và bắt đầu học tập ngay hôm nay!</Text>

            <View style={{ marginTop: 26 * scale }}>
              <TextInput
                style={[styles.input, { borderRadius: 25 * scale, height: 72 * scale, paddingHorizontal: 24 * scale, fontSize: 16 * scale }]}
                placeholder="Email"
                placeholderTextColor="#6e6d81"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />

              <View style={[styles.inputRow, { borderRadius: 25 * scale, height: 72 * scale, paddingHorizontal: 24 * scale, marginTop: 14 * scale }]}>
                <TextInput
                  style={[styles.inputField, { fontSize: 16 * scale }]}
                  placeholder="Mật khẩu"
                  placeholderTextColor="#6e6d81"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
                  <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20 * scale} color="#7b7688" />
                </TouchableOpacity>
              </View>

              <View style={[styles.inputRow, { borderRadius: 25 * scale, height: 72 * scale, paddingHorizontal: 24 * scale, marginTop: 14 * scale }]}>
                <TextInput
                  style={[styles.inputField, { fontSize: 16 * scale }]}
                  placeholder="Nhập lại mật khẩu"
                  placeholderTextColor="#6e6d81"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword((prev) => !prev)}>
                  <Ionicons name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} size={20 * scale} color="#7b7688" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.socialRow, { marginTop: 28 * scale }]}>
              <Text style={[styles.socialLabel, { fontSize: 16 * scale }]}>Liên kết tài khoản</Text>
              <View style={{ flexDirection: 'row', gap: 18 * scale }}>
                <TouchableOpacity style={[styles.socialButton, { width: socialSize, height: socialSize, borderRadius: 14 * scale }]} onPress={() => setShowLinkInfo(true)}>
                  <FontAwesome name="facebook-square" size={22 * scale} color="#1877F2" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.socialButton, { width: socialSize, height: socialSize, borderRadius: 14 * scale }]} onPress={() => setShowLinkInfo(true)}>
                  <FontAwesome name="apple" size={22 * scale} color="#7a7882" />
                </TouchableOpacity>
              </View>
            </View>

            {showLinkInfo ? (
              <Text style={[styles.helperText, { marginTop: 14 * scale, fontSize: 13 * scale, lineHeight: 19 * scale }]}>
                Liên kết mạng xã hội chưa bật. BOSS vui lòng sử dụng tài khoản thử nghiệm ở dưới.
              </Text>
            ) : null}

            <View style={[styles.mockInfoCard, { marginTop: 16 * scale, borderRadius: 16 * scale, padding: 14 * scale }]}>
              <Text style={styles.mockInfoTitle}>Thông tin đăng ký bắt buộc:</Text>
              <Text style={styles.mockInfoText}>Email: hosihung2@gmail.com</Text>
              <Text style={styles.mockInfoText}>Mật khẩu: 123456</Text>
            </View>

            <View style={[styles.agreementRow, { marginTop: 168 * scale }]}>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  { width: 42 * scale, height: 42 * scale, borderRadius: 8 * scale, marginTop: 2 * scale, marginRight: 16 * scale },
                  agree && styles.checkboxActive,
                ]}
                onPress={() => setAgree((prev) => !prev)}>
                {agree ? <Ionicons name="checkmark" size={18 * scale} color="#ffffff" /> : null}
              </TouchableOpacity>

              <Text style={[styles.agreementText, { fontSize: 15 * scale, lineHeight: 22 * scale }]}>
                Tôi đã đọc và đồng ý với <Text style={styles.agreementLink}>Chính sách bảo mật</Text> của ứng dụng.
              </Text>
            </View>

            {error ? <Text style={[styles.errorText, { marginTop: 16 * scale }]}>{error}</Text> : null}

            <TouchableOpacity
              style={[
                styles.primaryButton,
                { borderRadius: 25 * scale, height: 74 * scale, marginTop: 26 * scale },
                !canSubmit && styles.primaryButtonDisabled,
              ]}
              disabled={!canSubmit}
              onPress={handleSubmit}>
              <Text style={[styles.primaryButtonText, { fontSize: 18 * scale }, !canSubmit && styles.primaryButtonTextDisabled]}>
                {submitting ? 'Đang tạo tài khoản...' : 'Đăng ký'}
              </Text>
            </TouchableOpacity>

            <View style={[styles.footerRow, { marginTop: 22 * scale }]}>
              <Text style={[styles.footerText, { fontSize: 15 * scale }]}>Đã có tài khoản? </Text>
              <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in')}>
                <Text style={[styles.footerLink, { fontSize: 15 * scale }]}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  keyboardWrap: { flex: 1 },
  scrollContent: { flexGrow: 1, backgroundColor: '#ffffff' },
  hero: { backgroundColor: '#5fc865', alignItems: 'center', justifyContent: 'center' },
  heroBackButton: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  logo: { fontFamily: Fonts.bold, color: '#ffffff' },
  sheet: { flex: 1, backgroundColor: '#ffffff' },
  title: { fontFamily: Fonts.bold, color: '#4d4a63', textAlign: 'center' },
  subtitle: { fontFamily: Fonts.regular, color: '#5e5c73', textAlign: 'center' },
  input: { backgroundColor: '#f8f5f5', fontFamily: Fonts.medium, color: '#4a485f' },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f5f5' },
  inputField: { flex: 1, fontFamily: Fonts.medium, color: '#4a485f' },
  socialRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  socialLabel: { fontFamily: Fonts.regular, color: '#4d4a63' },
  socialButton: { backgroundColor: '#f1f1f1', alignItems: 'center', justifyContent: 'center' },
  helperText: { fontFamily: Fonts.regular, color: '#6c697b' },
  agreementRow: { flexDirection: 'row', alignItems: 'flex-start' },
  checkbox: { borderWidth: 2, borderColor: '#6f6d82', alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: '#34ca53', borderColor: '#34ca53' },
  agreementText: { flex: 1, fontFamily: Fonts.regular, color: '#4d4a63' },
  agreementLink: { fontFamily: Fonts.bold, color: '#34ca53' },
  errorText: { fontFamily: Fonts.medium, fontSize: 13, color: '#ea573f' },
  primaryButton: { backgroundColor: '#34ca53', alignItems: 'center', justifyContent: 'center' },
  primaryButtonDisabled: { backgroundColor: '#cfcfd6' },
  primaryButtonText: { fontFamily: Fonts.bold, color: '#ffffff' },
  primaryButtonTextDisabled: { color: '#666272' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontFamily: Fonts.regular, color: '#4d4a63' },
  footerLink: { fontFamily: Fonts.bold, color: '#34ca53' },
  mockInfoCard: {
    backgroundColor: '#f0faf1',
    borderWidth: 1,
    borderColor: '#d2f3d5',
  },
  mockInfoTitle: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: '#34ca53',
    marginBottom: 4,
  },
  mockInfoText: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: '#4d4a63',
  },
});
