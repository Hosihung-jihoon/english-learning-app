import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';

export default function SignUpScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const scale = Math.min(width / 375, 1) * 0.93;
  const heroHeight = 300 * scale;
  const horizontal = 24 * scale;
  const socialSize = 72 * scale;

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận chưa khớp');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const fallbackName = email.split('@')[0] || 'Student';
      await signUp({ name: fallbackName, email, password });
      router.replace('/(auth)/onboarding-step-1');
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
      <StatusBar style="light" backgroundColor="#58c767" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <LinearGradient colors={['#58c767', '#6fcd73']} style={[styles.hero, { height: heroHeight }]}>
          <Text style={[styles.logo, { fontSize: 46 * scale }]}>JHUDABEO</Text>
        </LinearGradient>

        <View
          style={[
            styles.sheet,
            {
              marginTop: -42 * scale,
              borderTopLeftRadius: 44 * scale,
              borderTopRightRadius: 44 * scale,
              paddingHorizontal: horizontal,
              paddingTop: 40 * scale,
              paddingBottom: 28 * scale,
            },
          ]}>
          <View style={[styles.heading, { marginBottom: 26 * scale }]}>
            <Text style={[styles.title, { fontSize: 24 * scale, marginBottom: 6 * scale }]}>Tạo tài khoản</Text>
            <Text style={[styles.subtitle, { fontSize: 15 * scale }]}>và bắt đầu học tập ngay hôm nay!</Text>
          </View>

          <TextInput
            style={[styles.input, { borderRadius: 24 * scale, paddingVertical: 24 * scale, paddingHorizontal: 20 * scale, fontSize: 16 * scale, marginBottom: 16 * scale }]}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#6f6d82"
            value={email}
            onChangeText={setEmail}
          />

          <View style={[styles.inputRow, { borderRadius: 24 * scale, paddingHorizontal: 20 * scale, marginBottom: 16 * scale }]}>
            <TextInput
              style={[styles.inputField, { paddingVertical: 24 * scale, fontSize: 16 * scale }]}
              placeholder="Mật khẩu"
              placeholderTextColor="#6f6d82"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
              <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20 * scale} color="#6f6d82" />
            </TouchableOpacity>
          </View>

          <View style={[styles.inputRow, { borderRadius: 24 * scale, paddingHorizontal: 20 * scale, marginBottom: 16 * scale }]}>
            <TextInput
              style={[styles.inputField, { paddingVertical: 24 * scale, fontSize: 16 * scale }]}
              placeholder="Nhập lại mật khẩu"
              placeholderTextColor="#6f6d82"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword((prev) => !prev)}>
              <Ionicons name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} size={20 * scale} color="#6f6d82" />
            </TouchableOpacity>
          </View>

          <View style={[styles.socialSection, { marginTop: 8 * scale, marginBottom: 44 * scale }]}>
            <Text style={[styles.socialTitle, { fontSize: 16 * scale }]}>Liên kết tài khoản</Text>
            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={[styles.socialButton, { width: socialSize, height: socialSize, borderRadius: 14 * scale }]}
                onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Facebook link' } } as never)}>
                <FontAwesome name="facebook-square" size={22 * scale} color="#1877F2" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.socialButton, { width: socialSize, height: socialSize, borderRadius: 14 * scale }]}
                onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Apple link' } } as never)}>
                <FontAwesome name="apple" size={22 * scale} color="#6d6b76" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.agreementRow, { marginBottom: 24 * scale }]}>
            <TouchableOpacity
              style={[
                styles.checkbox,
                { width: 38 * scale, height: 38 * scale, borderRadius: 8 * scale, marginRight: 14 * scale },
                agree && styles.checkboxActive,
              ]}
              onPress={() => setAgree((prev) => !prev)}>
              {agree ? <Ionicons name="checkmark" size={16 * scale} color="#ffffff" /> : null}
            </TouchableOpacity>
            <Text style={[styles.agreementText, { fontSize: 15 * scale, lineHeight: 22 * scale }]}>
              Tôi đã đọc và đồng ý với <Text style={styles.agreementLink}>Chính sách bảo mật</Text> của ứng dụng.
            </Text>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.primaryButton, { borderRadius: 24 * scale, paddingVertical: 22 * scale, marginBottom: 24 * scale }, !canSubmit && styles.primaryButtonDisabled]}
            disabled={!canSubmit}
            onPress={handleSubmit}>
            <Text style={[styles.primaryButtonText, { fontSize: 20 * scale }, !canSubmit && styles.primaryButtonTextDisabled]}>
              {submitting ? 'Đang tạo tài khoản...' : 'Đăng ký'}
            </Text>
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={[styles.footerText, { fontSize: 15 * scale }]}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in')}>
              <Text style={[styles.footerLink, { fontSize: 15 * scale }]}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  scrollContent: { flexGrow: 1, backgroundColor: '#ffffff' },
  hero: { alignItems: 'center', justifyContent: 'center' },
  logo: { fontFamily: Fonts.bold, color: '#ffffff' },
  sheet: { flex: 1, backgroundColor: '#ffffff' },
  heading: { alignItems: 'center' },
  title: { fontFamily: Fonts.bold, color: '#4a485f' },
  subtitle: { fontFamily: Fonts.regular, color: '#4a485f', textAlign: 'center' },
  input: { backgroundColor: '#f8f6f7', fontFamily: Fonts.semiBold, color: '#4a485f' },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f6f7' },
  inputField: { flex: 1, fontFamily: Fonts.semiBold, color: '#4a485f' },
  socialSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  socialTitle: { fontFamily: Fonts.regular, color: '#4a485f' },
  socialButtons: { flexDirection: 'row', gap: 14 },
  socialButton: { backgroundColor: '#f1f1f1', alignItems: 'center', justifyContent: 'center' },
  agreementRow: { flexDirection: 'row', alignItems: 'flex-start', paddingRight: 8 },
  checkbox: { borderWidth: 2, borderColor: '#6f6d82', alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: '#39c957', borderColor: '#39c957' },
  agreementText: { flex: 1, fontFamily: Fonts.regular, color: '#4a485f' },
  agreementLink: { fontFamily: Fonts.bold, color: '#39c957' },
  errorText: { fontFamily: Fonts.medium, fontSize: 13, color: '#ea573f', marginBottom: 16 },
  primaryButton: { backgroundColor: '#39c957', alignItems: 'center' },
  primaryButtonDisabled: { backgroundColor: '#c9c9cf' },
  primaryButtonText: { fontFamily: Fonts.bold, color: '#ffffff' },
  primaryButtonTextDisabled: { color: '#666272' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 18 },
  footerText: { fontFamily: Fonts.regular, color: '#4a485f' },
  footerLink: { fontFamily: Fonts.bold, color: '#39c957' },
});
