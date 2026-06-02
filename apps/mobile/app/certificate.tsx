import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Redirect, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ProfileSummary } from '../../../shared/types';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';
import { getProfile } from '@/services/content-service';

export default function CertificateScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { isLoading: authLoading, onboardingComplete, token } = useAuth();
  const [profile, setProfile] = useState<ProfileSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setProfile(null);
    setError(null);

    if (!token || !onboardingComplete) {
      setLoading(false);
      return;
    }

    setLoading(true);
    let mounted = true;

    getProfile(token)
      .then((data) => {
        if (mounted) {
          setProfile(data);
        }
      })
      .catch((loadError) => {
        if (mounted) {
          setError(loadError instanceof Error ? loadError.message : 'Không tải được chứng nhận');
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [onboardingComplete, token]);

  const scale = Math.min(width / 375, 1) * 0.88;
  const horizontal = 22 * scale;
  const insetBottom = Math.max(insets.bottom, 16);
  const unlocked = useMemo(() => profile?.certificates.filter((item) => item.unlocked) ?? [], [profile]);

  if (authLoading) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={['top']}>
        <ActivityIndicator size="large" color="#00bd50" />
      </SafeAreaView>
    );
  }

  if (!token) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (!onboardingComplete) {
    return <Redirect href="/(auth)/onboarding-intro-1" />;
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={['top']}>
        <ActivityIndicator size="large" color="#00bd50" />
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={['top']}>
        <Text style={styles.errorText}>{error || 'Không tải được chứng nhận.'}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { paddingHorizontal: horizontal, paddingTop: 14 * scale }]}>
        <TouchableOpacity style={[styles.iconButton, { width: 42 * scale, height: 42 * scale, borderRadius: 21 * scale }]} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22 * scale} color="#050018" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontSize: 19 * scale }]}>Giấy chứng nhận</Text>
        <View style={{ width: 42 * scale }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: horizontal, paddingTop: 16 * scale, paddingBottom: insetBottom + 18 * scale }} showsVerticalScrollIndicator={false}>
        <View style={[styles.heroCard, { borderRadius: 30 * scale, paddingHorizontal: 22 * scale, paddingVertical: 24 * scale }]}>
          <View style={[styles.heroBadge, { width: 54 * scale, height: 54 * scale, borderRadius: 27 * scale }]}>
            <Ionicons name="ribbon" size={26 * scale} color="#f4b43e" />
          </View>
          <Text style={[styles.heroTitle, { fontSize: 26 * scale, marginTop: 18 * scale }]}>Thành tựu của bạn</Text>
          <Text style={[styles.heroCaption, { fontSize: 14 * scale, lineHeight: 21 * scale, marginTop: 10 * scale }]}>
            Tích lũy chứng nhận theo từng mục tiêu học tập. Mỗi chứng nhận mở khóa khi bạn hoàn thành đủ tiến độ.
          </Text>
          <View style={[styles.heroStatRow, { marginTop: 20 * scale, gap: 12 * scale }]}>
            <View style={[styles.heroStatCard, { borderRadius: 18 * scale, paddingVertical: 14 * scale }]}>
              <Text style={[styles.heroStatValue, { fontSize: 19 * scale }]}>{unlocked.length}</Text>
              <Text style={[styles.heroStatLabel, { fontSize: 13 * scale, marginTop: 4 * scale }]}>Đã mở</Text>
            </View>
            <View style={[styles.heroStatCard, { borderRadius: 18 * scale, paddingVertical: 14 * scale }]}>
              <Text style={[styles.heroStatValue, { fontSize: 19 * scale }]}>{profile.certificates.length}</Text>
              <Text style={[styles.heroStatLabel, { fontSize: 13 * scale, marginTop: 4 * scale }]}>Tổng số</Text>
            </View>
          </View>
        </View>

        <View style={{ gap: 14 * scale, marginTop: 22 * scale }}>
          {profile.certificates.map((certificate, index) => (
            <View
              key={certificate.id}
              style={[
                styles.certificateCard,
                {
                  borderRadius: 24 * scale,
                  paddingHorizontal: 18 * scale,
                  paddingVertical: 18 * scale,
                  backgroundColor: certificate.unlocked ? '#e8f9eb' : '#ffffff',
                },
              ]}>
              <View style={styles.certificateHeader}>
                <View
                  style={[
                    styles.certificateIcon,
                    { width: 52 * scale, height: 52 * scale, borderRadius: 16 * scale, backgroundColor: certificate.unlocked ? '#ffffff' : '#f2f0f0' },
                  ]}>
                  <Ionicons name={certificate.unlocked ? 'ribbon' : 'lock-closed'} size={24 * scale} color={certificate.unlocked ? '#f4b43e' : '#9b99a3'} />
                </View>
                <View style={{ flex: 1, marginLeft: 14 * scale }}>
                  <Text style={[styles.certificateTitle, { fontSize: 17 * scale }]}>{certificate.title}</Text>
                  <Text style={[styles.certificateSubtitle, { fontSize: 13 * scale, lineHeight: 19 * scale, marginTop: 6 * scale }]}>{certificate.subtitle}</Text>
                </View>
                <View
                  style={[
                    styles.certificateBadge,
                    { borderRadius: 14 * scale, paddingHorizontal: 10 * scale, paddingVertical: 6 * scale, backgroundColor: certificate.unlocked ? '#55ba5d' : '#eceaf0' },
                  ]}>
                  <Text style={[styles.certificateBadgeText, { fontSize: 12 * scale, color: certificate.unlocked ? '#ffffff' : '#7e7b88' }]}>
                    {certificate.unlocked ? 'Mở khóa' : 'Khóa'}
                  </Text>
                </View>
              </View>

              <View style={[styles.progressStub, { borderRadius: 999, marginTop: 16 * scale }]}>
                <View
                  style={[
                    styles.progressStubFill,
                    {
                      width: `${certificate.unlocked ? 100 : Math.max(22, 35 + index * 18)}%`,
                      borderRadius: 999,
                      backgroundColor: certificate.unlocked ? '#55ba5d' : '#d7d5df',
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={[styles.primaryButton, { borderRadius: 26 * scale, height: 54 * scale, marginTop: 26 * scale }]} onPress={() => router.replace('/(tabs)/profile')}>
          <Text style={[styles.primaryButtonText, { fontSize: 16 * scale }]}>{unlocked.length ? 'Quay lại hồ sơ' : 'Tiếp tục học để mở khóa'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#faf8f8' },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#faf8f8' },
  errorText: { fontFamily: Fonts.medium, fontSize: 14, color: '#ea573f', textAlign: 'center', paddingHorizontal: 24 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconButton: { backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: Fonts.bold, color: '#050018' },
  heroCard: { backgroundColor: '#ffffff', alignItems: 'center' },
  heroBadge: { backgroundColor: '#fff6db', alignItems: 'center', justifyContent: 'center' },
  heroTitle: { fontFamily: Fonts.bold, color: '#050018' },
  heroCaption: { fontFamily: Fonts.regular, color: '#696674', textAlign: 'center' },
  heroStatRow: { flexDirection: 'row', width: '100%' },
  heroStatCard: { flex: 1, backgroundColor: '#faf8f8', alignItems: 'center' },
  heroStatValue: { fontFamily: Fonts.bold, color: '#050018' },
  heroStatLabel: { fontFamily: Fonts.medium, color: '#8f8aa0' },
  certificateHeader: { flexDirection: 'row', alignItems: 'center' },
  certificateIcon: { alignItems: 'center', justifyContent: 'center' },
  certificateTitle: { fontFamily: Fonts.bold, color: '#050018' },
  certificateSubtitle: { fontFamily: Fonts.regular, color: '#696674' },
  certificateBadge: { alignItems: 'center', justifyContent: 'center' },
  certificateBadgeText: { fontFamily: Fonts.bold },
  progressStub: { height: 10, backgroundColor: '#eceaf0', overflow: 'hidden' },
  progressStubFill: { height: '100%' },
  primaryButton: { backgroundColor: '#55ba5d', alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { fontFamily: Fonts.bold, color: '#ffffff' },
  certificateCard: {},
});
