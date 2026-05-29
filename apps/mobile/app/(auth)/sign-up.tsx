import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận chưa khớp');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await signUp({ name, email, password });
      router.replace('/(tabs)');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Đăng ký thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = !!email && !!password && !!confirmPassword && agree && !submitting;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <LinearGradient colors={['#56C568', '#7ED957']} style={styles.hero}>
          <Text style={styles.logo}>JHUDABEO</Text>
        </LinearGradient>

        <View style={styles.sheet}>
          <View style={styles.heading}>
            <Text style={styles.title}>Tạo tài khoản</Text>
            <Text style={styles.subtitle}>và bắt đầu học tập ngay hôm nay!</Text>
          </View>

          <TextInput style={styles.input} placeholder="Tên hiển thị" placeholderTextColor="#A9A9A9" value={name} onChangeText={setName} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#A9A9A9"
            value={email}
            onChangeText={setEmail}
          />

          <View style={styles.inputRow}>
            <TextInput
              style={styles.inputField}
              placeholder="Mật khẩu"
              placeholderTextColor="#A9A9A9"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
              <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={22} color="#666666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.inputField}
              placeholder="Nhập lại mật khẩu"
              placeholderTextColor="#A9A9A9"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword((prev) => !prev)}>
              <Ionicons name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} size={22} color="#666666" />
            </TouchableOpacity>
          </View>

          <View style={styles.socialSection}>
            <Text style={styles.socialTitle}>Liên kết tài khoản</Text>
            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Facebook link' } } as never)}>
                <FontAwesome name="facebook-square" size={28} color="#1877F2" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Apple link' } } as never)}>
                <FontAwesome name="apple" size={28} color="#333333" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.agreementRow}>
            <TouchableOpacity style={[styles.checkbox, agree && styles.checkboxActive]} onPress={() => setAgree((prev) => !prev)}>
              {agree ? <Ionicons name="checkmark" size={18} color="#ffffff" /> : null}
            </TouchableOpacity>
            <Text style={styles.agreementText}>
              Tôi đã đọc và đồng ý với <Text style={styles.agreementLink}>Chính sách bảo mật</Text> của ứng dụng.
            </Text>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.primaryButton, !canSubmit && styles.primaryButtonDisabled]}
            disabled={!canSubmit}
            onPress={handleSubmit}>
            <Text style={[styles.primaryButtonText, !canSubmit && styles.primaryButtonTextDisabled]}>
              {submitting ? 'Đang tạo tài khoản...' : 'Đăng ký'}
            </Text>
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.replace('/(auth)/sign-in')}>
              <Text style={styles.footerLink}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  scrollContent: { flexGrow: 1 },
  hero: { height: 320, alignItems: 'center', justifyContent: 'center', paddingTop: 50 },
  logo: { fontFamily: Fonts.bold, fontSize: 48, color: '#ffffff', letterSpacing: 2 },
  sheet: { flex: 1, marginTop: -60, backgroundColor: '#ffffff', borderTopLeftRadius: 45, borderTopRightRadius: 45, paddingTop: 40, paddingHorizontal: 30 },
  heading: { alignItems: 'center', marginBottom: 35 },
  title: { fontFamily: Fonts.bold, fontSize: 28, color: '#333333', marginBottom: 10 },
  subtitle: { fontFamily: Fonts.regular, fontSize: 16, color: '#666666' },
  input: { backgroundColor: '#F8F8F8', borderRadius: 30, paddingVertical: 18, paddingHorizontal: 25, fontFamily: Fonts.regular, fontSize: 16, color: '#333333', marginBottom: 20 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F8F8', borderRadius: 30, paddingHorizontal: 25, marginBottom: 20 },
  inputField: { flex: 1, paddingVertical: 18, fontFamily: Fonts.regular, fontSize: 16, color: '#333333' },
  socialSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 },
  socialTitle: { fontFamily: Fonts.regular, fontSize: 16, color: '#666666' },
  socialButtons: { flexDirection: 'row', gap: 15 },
  socialButton: { backgroundColor: '#F2F2F2', padding: 12, borderRadius: 12 },
  agreementRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24, paddingRight: 10 },
  checkbox: { width: 26, height: 26, borderRadius: 6, borderWidth: 2, borderColor: '#D3D3D3', marginRight: 15, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: '#56C568', borderColor: '#56C568' },
  agreementText: { flex: 1, fontFamily: Fonts.regular, fontSize: 14, lineHeight: 22, color: '#666666' },
  agreementLink: { fontFamily: Fonts.bold, color: '#56C568' },
  errorText: { fontFamily: Fonts.medium, fontSize: 13, color: '#ea573f', marginBottom: 16 },
  primaryButton: { backgroundColor: '#56C568', borderRadius: 35, paddingVertical: 20, alignItems: 'center', marginBottom: 24 },
  primaryButtonDisabled: { backgroundColor: '#D0D0D0' },
  primaryButtonText: { fontFamily: Fonts.bold, fontSize: 18, color: '#ffffff' },
  primaryButtonTextDisabled: { color: '#808080' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
  footerText: { fontFamily: Fonts.regular, fontSize: 15, color: '#64748b' },
  footerLink: { fontFamily: Fonts.bold, fontSize: 15, color: '#34d399' },
});
