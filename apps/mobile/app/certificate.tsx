import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import type { ProfileSummary } from '../../../shared/types';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';
import { getProfile } from '@/services/content-service';

export default function CertificateScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const [profile, setProfile] = useState<ProfileSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      return;
    }

    let mounted = true;
    getProfile(token)
      .then((data) => {
        if (mounted) {
          setProfile(data);
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
  }, [token]);

  const unlocked = useMemo(() => profile?.certificates.filter((item) => item.unlocked) ?? [], [profile]);

  if (loading || !profile) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#00bd50" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Text style={styles.iconText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Giấy chứng nhận</Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {profile.certificates.map((certificate) => (
          <View key={certificate.id} style={[styles.card, certificate.unlocked ? styles.cardUnlocked : styles.cardLocked]}>
            <Text style={styles.cardTitle}>{certificate.title}</Text>
            <Text style={styles.cardSubtitle}>{certificate.subtitle}</Text>
            <Text style={styles.statusText}>{certificate.unlocked ? 'Đã mở khóa' : 'Chưa mở khóa'}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/(tabs)/profile')}>
          <Text style={styles.primaryButtonText}>
            {unlocked.length ? 'Quay lại hồ sơ' : 'Tiếp tục học để mở khóa'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#faf8f8' },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#faf8f8' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24 },
  iconButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 20, color: '#050018' },
  headerTitle: { fontFamily: Fonts.bold, fontSize: 20, color: '#050018' },
  content: { paddingHorizontal: 24, paddingBottom: 32, gap: 12 },
  card: { borderRadius: 24, padding: 20 },
  cardUnlocked: { backgroundColor: '#e8f9eb' },
  cardLocked: { backgroundColor: '#ffffff' },
  cardTitle: { fontFamily: Fonts.bold, fontSize: 18, color: '#050018', marginBottom: 8 },
  cardSubtitle: { fontFamily: Fonts.regular, fontSize: 13, color: '#696674', marginBottom: 12 },
  statusText: { fontFamily: Fonts.semiBold, fontSize: 13, color: '#00bd50' },
  primaryButton: { marginTop: 16, backgroundColor: '#00bd50', borderRadius: 999, paddingVertical: 16, alignItems: 'center' },
  primaryButtonText: { fontFamily: Fonts.bold, fontSize: 16, color: '#ffffff' },
});
