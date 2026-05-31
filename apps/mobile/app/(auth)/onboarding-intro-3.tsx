import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';

export default function OnboardingIntroThree() {
  const router = useRouter();
  const { completeOnboarding } = useAuth();

  async function goToAuth(pathname: '/(auth)/sign-in' | '/(auth)/sign-up') {
    await completeOnboarding();
    router.replace(pathname);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" backgroundColor="#faf8f8" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color="#050018" />
          </TouchableOpacity>
          <View style={styles.pagination}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={[styles.dot, styles.dotActive]} />
          </View>
          <View style={styles.iconButtonGhost} />
        </View>

        <View style={[styles.hero, styles.heroAlt]}>
          <Image source={require('../../assets/images/react-logo.png')} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Đánh giá chuyên sâu</Text>
          <Text style={styles.description}>
            Theo dõi và đánh giá từng kỹ năng của bạn dựa trên từng loại bài tập để điều chỉnh lộ trình phù hợp hơn.
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => goToAuth('/(auth)/sign-in')}>
            <Text style={styles.secondaryButtonText}>Đăng nhập</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton} onPress={() => goToAuth('/(auth)/sign-up')}>
            <Text style={styles.primaryButtonText}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#faf8f8' },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonGhost: { width: 44, height: 44 },
  pagination: { flexDirection: 'row', justifyContent: 'center', gap: 10 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#d8d7de' },
  dotActive: { width: 44, backgroundColor: '#55ba5d' },
  hero: {
    flex: 1,
    minHeight: 320,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f0ff',
    borderRadius: 32,
  },
  heroAlt: { backgroundColor: '#f3f0ff' },
  image: { width: '72%', height: '72%' },
  content: { paddingTop: 32, paddingHorizontal: 8 },
  title: { fontFamily: Fonts.bold, fontSize: 34, lineHeight: 42, color: '#050018', textAlign: 'center', marginBottom: 16 },
  description: { fontFamily: Fonts.regular, fontSize: 16, lineHeight: 24, color: '#5c596a', textAlign: 'center' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 32 },
  primaryButton: {
    flex: 1,
    backgroundColor: '#55ba5d',
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: { fontFamily: Fonts.bold, fontSize: 16, color: '#ffffff' },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: { fontFamily: Fonts.bold, fontSize: 16, color: '#050018' },
});
