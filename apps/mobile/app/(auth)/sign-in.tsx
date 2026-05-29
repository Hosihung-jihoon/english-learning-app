import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, FontAwesome5, AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#40D36B', '#24B75D']} style={styles.hero}>
        <Text style={styles.logo}>JHUDABEO</Text>
      </LinearGradient>

      <KeyboardAvoidingView style={styles.sheetWrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Đăng nhập</Text>
          <Text style={styles.subtitle}>để tiếp tục vươn tới mục tiêu!</Text>

          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              placeholderTextColor="#9ca3af"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
              <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={styles.forgotWrap}
            onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Quên mật khẩu' } } as never)}>
            <Text style={styles.forgotText}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryButton, (!email || !password || submitting) && styles.primaryButtonDisabled]}
            disabled={!email || !password || submitting}
            onPress={handleSubmit}>
            <Text style={styles.primaryButtonText}>{submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>hoặc tiếp tục với</Text>

          <View style={styles.socialRow}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Google sign-in' } } as never)}>
              <AntDesign name="google" size={22} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Facebook sign-in' } } as never)}>
              <FontAwesome5 name="facebook-f" size={20} color="#1877F2" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Apple sign-in' } } as never)}>
              <FontAwesome5 name="apple" size={22} color="#000000" />
            </TouchableOpacity>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
              <Text style={styles.footerLink}>Đăng ký ngay!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  hero: { height: '40%', alignItems: 'center', paddingTop: 84 },
  logo: { fontFamily: Fonts.bold, fontSize: 40, color: '#ffffff', letterSpacing: 3 },
  sheetWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 32,
    marginTop: -48,
  },
  title: { fontFamily: Fonts.bold, fontSize: 28, color: '#1e293b', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontFamily: Fonts.regular, fontSize: 15, color: '#64748b', textAlign: 'center', marginBottom: 35 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 55,
    marginBottom: 20,
  },
  input: { flex: 1, height: '100%', fontFamily: Fonts.regular, fontSize: 16, color: '#334155' },
  errorText: { fontFamily: Fonts.medium, fontSize: 13, color: '#ea573f', marginBottom: 10 },
  forgotWrap: { alignItems: 'flex-end', marginBottom: 20 },
  forgotText: { fontFamily: Fonts.medium, fontSize: 14, color: '#64748b' },
  primaryButton: { backgroundColor: '#34d399', borderRadius: 25, height: 55, alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  primaryButtonDisabled: { backgroundColor: '#b8d8c6' },
  primaryButtonText: { fontFamily: Fonts.bold, fontSize: 18, color: '#ffffff' },
  orText: { textAlign: 'center', fontFamily: Fonts.regular, fontSize: 15, color: '#64748b', marginBottom: 20 },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 25, marginBottom: 30 },
  socialButton: { width: 55, height: 55, borderRadius: 15, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontFamily: Fonts.regular, fontSize: 15, color: '#64748b' },
  footerLink: { fontFamily: Fonts.bold, fontSize: 15, color: '#34d399' },
});
