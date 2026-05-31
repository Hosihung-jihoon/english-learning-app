import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Fonts } from '@/constants/theme';

export default function OnboardingIntroTwo() {
  const router = useRouter();

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
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
          </View>
          <View style={styles.iconButtonGhost} />
        </View>

        <View style={[styles.hero, styles.heroAlt]}>
          <Image source={require('../../assets/images/partial-react-logo.png')} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Học tập mọi lúc, mọi nơi</Text>
          <Text style={styles.description}>
            Không tiện học phát âm ở nơi đông người? Không có thời gian để hoàn thành bài học dài? Chúng tôi luôn có lựa chọn
            khác cho bạn!
          </Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/(auth)/onboarding-intro-3')}>
          <Text style={styles.primaryButtonText}>Tiếp tục</Text>
        </TouchableOpacity>
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
    backgroundColor: '#eef3ff',
    borderRadius: 32,
  },
  heroAlt: { backgroundColor: '#eef3ff' },
  image: { width: '72%', height: '72%' },
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
