import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Fonts } from '@/constants/theme';

export default function OnboardingIntroOne() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" backgroundColor="#faf8f8" />
      <View style={styles.container}>
        <View style={styles.pagination}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <View style={styles.hero}>
          <Image source={require('../../assets/images/menu_illustration.png')} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Lộ trình linh hoạt</Text>
          <Text style={styles.description}>
            Cung cấp những nội dung học riêng cho mỗi mục tiêu khác nhau để giúp bạn đạt được thành quả tốt nhất.
          </Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/(auth)/onboarding-intro-2')}>
          <Text style={styles.primaryButtonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#faf8f8' },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32 },
  pagination: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 24 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#d8d7de' },
  dotActive: { width: 44, backgroundColor: '#55ba5d' },
  hero: {
    flex: 1,
    minHeight: 320,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eef9f0',
    borderRadius: 32,
  },
  image: { width: '78%', height: '78%' },
  content: { paddingTop: 32, paddingHorizontal: 8 },
  title: { fontFamily: Fonts.bold, fontSize: 34, lineHeight: 42, color: '#050018', textAlign: 'center', marginBottom: 16 },
  description: { fontFamily: Fonts.regular, fontSize: 16, lineHeight: 24, color: '#5c596a', textAlign: 'center' },
  primaryButton: {
    marginTop: 32,
    backgroundColor: '#55ba5d',
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: { fontFamily: Fonts.bold, fontSize: 16, color: '#ffffff' },
});
