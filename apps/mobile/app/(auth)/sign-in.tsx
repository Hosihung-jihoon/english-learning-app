import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { AntDesign, Feather, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';

export default function SignInScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const scale = Math.min(width / 375, 1) * 0.93;
  const heroHeight = 300 * scale;
  const horizontal = 24 * scale;
  const socialSize = 72 * scale;

  const handleSubmit = async () => {
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
      <StatusBar style="light" backgroundColor="#58c767" />

      <KeyboardAvoidingView style={styles.keyboardWrap} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
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
            <Text style={[styles.title, { fontSize: 24 * scale, marginBottom: 6 * scale }]}>Đăng nhập</Text>
            <Text style={[styles.subtitle, { fontSize: 15 * scale, marginBottom: 28 * scale }]}>để tiếp tục vươn tới mục tiêu!</Text>

            <View style={[styles.inputWrap, { borderRadius: 24 * scale, paddingHorizontal: 20 * scale, height: 72 * scale, marginBottom: 16 * scale }]}>
              <TextInput
                style={[styles.input, { fontSize: 16 * scale }]}
                placeholder="Tên đăng nhập"
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor="#6f6d82"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={[styles.inputWrap, { borderRadius: 24 * scale, paddingHorizontal: 20 * scale, height: 72 * scale, marginBottom: 16 * scale }]}>
              <TextInput
                style={[styles.input, { fontSize: 16 * scale }]}
                placeholder="Mật khẩu"
                placeholderTextColor="#6f6d82"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
                <Feather name={showPassword ? 'eye' : 'eye-off'} size={20 * scale} color="#6f6d82" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.forgotWrap, { marginBottom: 18 * scale }]}
              onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Quên mật khẩu' } } as never)}>
              <Text style={[styles.forgotText, { fontSize: 15 * scale }]}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.primaryButton, { borderRadius: 24 * scale, height: 74 * scale, marginBottom: 38 * scale }, (!email || !password || submitting) && styles.primaryButtonDisabled]}
              disabled={!email || !password || submitting}
              onPress={handleSubmit}>
              <Text style={[styles.primaryButtonText, { fontSize: 20 * scale }]}>{submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}</Text>
            </TouchableOpacity>

            <Text style={[styles.orText, { fontSize: 16 * scale, marginBottom: 28 * scale }]}>hoặc tiếp tục với</Text>

            <View style={[styles.socialRow, { marginBottom: 54 * scale }]}>
              <TouchableOpacity
                style={[styles.socialButton, { width: socialSize, height: socialSize, borderRadius: 14 * scale }]}
                onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Google sign-in' } } as never)}>
                <AntDesign name="google" size={20 * scale} color="#DB4437" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.socialButton, { width: socialSize, height: socialSize, borderRadius: 14 * scale }]}
                onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Facebook sign-in' } } as never)}>
                <FontAwesome5 name="facebook-f" size={18 * scale} color="#1877F2" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.socialButton, { width: socialSize, height: socialSize, borderRadius: 14 * scale }]}
                onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Apple sign-in' } } as never)}>
                <FontAwesome5 name="apple" size={20 * scale} color="#6d6b76" />
              </TouchableOpacity>
            </View>

            <View style={styles.footerRow}>
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
  hero: { alignItems: 'center', justifyContent: 'center' },
  logo: { fontFamily: Fonts.bold, color: '#ffffff' },
  sheet: { flex: 1, backgroundColor: '#ffffff' },
  title: { fontFamily: Fonts.bold, color: '#4a485f', textAlign: 'center' },
  subtitle: { fontFamily: Fonts.regular, color: '#4a485f', textAlign: 'center' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f6f7' },
  input: { flex: 1, height: '100%', fontFamily: Fonts.semiBold, color: '#4a485f' },
  forgotWrap: { alignItems: 'flex-end' },
  forgotText: { fontFamily: Fonts.medium, color: '#6f6d82' },
  errorText: { fontFamily: Fonts.medium, fontSize: 13, color: '#ea573f', marginBottom: 14 },
  primaryButton: { backgroundColor: '#39c957', alignItems: 'center', justifyContent: 'center' },
  primaryButtonDisabled: { backgroundColor: '#bfc4bf' },
  primaryButtonText: { fontFamily: Fonts.bold, color: '#ffffff' },
  orText: { textAlign: 'center', fontFamily: Fonts.regular, color: '#4a485f' },
  socialRow: { flexDirection: 'row', justifyContent: 'space-evenly' },
  socialButton: { backgroundColor: '#f1f1f1', alignItems: 'center', justifyContent: 'center' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontFamily: Fonts.regular, color: '#4a485f' },
  footerLink: { fontFamily: Fonts.bold, color: '#39c957' },
});
