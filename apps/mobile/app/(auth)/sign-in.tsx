import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { AntDesign, Feather, FontAwesome5 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';

export default function SignInScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [helpMode, setHelpMode] = useState<'forgot' | 'social' | null>(null);

  const scale = Math.min(width / 375, 1) * 0.92;
  const heroHeight = 292 * scale;
  const horizontal = 24 * scale;
  const socialSize = 72 * scale;
  const insetBottom = Math.max(insets.bottom, 16);

  const handleSubmit = async () => {
    if (submitting) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await signIn({ email, password });
      router.replace('/(tabs)');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Đăng nhập thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen options={{ headerShown: false, title: 'Đăng nhập' }} />
      <StatusBar style="light" backgroundColor="#5fc865" />

      <KeyboardAvoidingView style={styles.keyboardWrap} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insetBottom }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={[styles.hero, { height: heroHeight }]}>
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
            <Text style={[styles.title, { fontSize: 27 * scale }]}>Đăng nhập</Text>
            <Text style={[styles.subtitle, { fontSize: 15 * scale, marginTop: 8 * scale }]}>để tiếp tục vươn tới mục tiêu!</Text>

            <View style={{ marginTop: 28 * scale }}>
              <View style={[styles.inputWrap, { borderRadius: 25 * scale, height: 72 * scale, paddingHorizontal: 24 * scale }]}>
                <TextInput
                  style={[styles.input, { fontSize: 16 * scale }]}
                  placeholder="Email"
                  placeholderTextColor="#6e6d81"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={[styles.inputWrap, { borderRadius: 25 * scale, height: 72 * scale, paddingHorizontal: 24 * scale, marginTop: 14 * scale }]}>
                <TextInput
                  style={[styles.input, { fontSize: 16 * scale }]}
                  placeholder="Mật khẩu"
                  placeholderTextColor="#6e6d81"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
                  <Feather name={showPassword ? 'eye' : 'eye-off'} size={20 * scale} color="#7b7688" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={[styles.forgotWrap, { marginTop: 12 * scale }]} onPress={() => setHelpMode(helpMode === 'forgot' ? null : 'forgot')}>
                <Text style={[styles.forgotText, { fontSize: 14 * scale }]}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>

            {error ? <Text style={[styles.errorText, { marginTop: 16 * scale }]}>{error}</Text> : null}
            {helpMode === 'forgot' ? (
              <Text style={[styles.helperText, { marginTop: 14 * scale, fontSize: 13 * scale, lineHeight: 19 * scale }]}>
                Tính năng đặt lại mật khẩu chưa mở trong app. BOSS hãy đăng nhập bằng tài khoản thử nghiệm ở dưới để tiếp tục test flow.
              </Text>
            ) : null}

            <View style={[styles.mockInfoCard, { marginTop: 16 * scale, borderRadius: 16 * scale, padding: 14 * scale }]}>
              <Text style={styles.mockInfoTitle}>Tài khoản dùng thử offline:</Text>
              <Text style={styles.mockInfoText}>Email: hosihung2@gmail.com</Text>
              <Text style={styles.mockInfoText}>Mật khẩu: 123456</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                { borderRadius: 25 * scale, height: 74 * scale, marginTop: 24 * scale },
                (!email || !password || submitting) && styles.primaryButtonDisabled,
              ]}
              disabled={!email || !password || submitting}
              onPress={handleSubmit}>
              <Text style={[styles.primaryButtonText, { fontSize: 18 * scale }]}>{submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}</Text>
            </TouchableOpacity>

            <Text style={[styles.orText, { fontSize: 16 * scale, marginTop: 62 * scale }]}>hoặc tiếp tục với</Text>

            <View style={[styles.socialRow, { marginTop: 26 * scale }]}>
              <TouchableOpacity style={[styles.socialButton, { width: socialSize, height: socialSize, borderRadius: 14 * scale }]} onPress={() => setHelpMode('social')}>
                <AntDesign name="google" size={22 * scale} color="#DB4437" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialButton, { width: socialSize, height: socialSize, borderRadius: 14 * scale }]} onPress={() => setHelpMode('social')}>
                <FontAwesome5 name="facebook-f" size={20 * scale} color="#1877F2" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialButton, { width: socialSize, height: socialSize, borderRadius: 14 * scale }]} onPress={() => setHelpMode('social')}>
                <FontAwesome5 name="apple" size={21 * scale} color="#7a7882" />
              </TouchableOpacity>
            </View>

            {helpMode === 'social' ? (
              <Text style={[styles.helperText, { marginTop: 16 * scale, textAlign: 'center', fontSize: 13 * scale, lineHeight: 19 * scale }]}>
                Đăng nhập mạng xã hội chưa được bật. BOSS vui lòng sử dụng tài khoản thử nghiệm ở trên.
              </Text>
            ) : null}

            <View style={[styles.footerRow, { marginTop: 198 * scale }]}>
              <Text style={[styles.footerText, { fontSize: 16 * scale }]}>Chưa có tài khoản? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
                <Text style={[styles.footerLink, { fontSize: 16 * scale }]}>Đăng ký ngay!</Text>
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
  logo: { fontFamily: Fonts.bold, color: '#ffffff' },
  sheet: { flex: 1, backgroundColor: '#ffffff' },
  title: { fontFamily: Fonts.bold, color: '#4d4a63', textAlign: 'center' },
  subtitle: { fontFamily: Fonts.regular, color: '#5e5c73', textAlign: 'center' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f5f5' },
  input: { flex: 1, height: '100%', fontFamily: Fonts.medium, color: '#4a485f' },
  forgotWrap: { alignItems: 'flex-end' },
  forgotText: { fontFamily: Fonts.medium, color: '#706d80' },
  errorText: { fontFamily: Fonts.medium, fontSize: 13, color: '#ea573f' },
  helperText: { fontFamily: Fonts.regular, color: '#706d80' },
  primaryButton: { backgroundColor: '#34ca53', alignItems: 'center', justifyContent: 'center' },
  primaryButtonDisabled: { backgroundColor: '#c5c8c5' },
  primaryButtonText: { fontFamily: Fonts.bold, color: '#ffffff' },
  orText: { textAlign: 'center', fontFamily: Fonts.regular, color: '#5e5c73' },
  socialRow: { flexDirection: 'row', justifyContent: 'space-evenly' },
  socialButton: { backgroundColor: '#f1f1f1', alignItems: 'center', justifyContent: 'center' },
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
