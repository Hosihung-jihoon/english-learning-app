import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { TargetContent, TargetType } from '../../../../shared/types';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';
import { getTargets } from '@/services/content-service';

export default function TargetSelectionScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const [targets, setTargets] = useState<TargetContent[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<TargetType>('toeic');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      return;
    }

    let mounted = true;
    getTargets(token)
      .then((items) => {
        if (!mounted) {
          return;
        }
        setTargets(items);
        if (items[0]) {
          setSelectedTarget(items[0].type);
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

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#00bd50" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.replace('/(tabs)')}>
            <Ionicons name="arrow-back" size={24} color="#050018" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lộ trình học</Text>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Thông tin lộ trình' } } as never)}>
            <Ionicons name="information-circle-outline" size={22} color="#292d32" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Chọn mục tiêu</Text>
          <Text style={styles.subtitle}>
            Lựa chọn mục tiêu phù hợp với bạn, SUMO sẽ giúp bạn đi đúng nhịp học ngay từ đầu.
          </Text>

          {targets.map((target, index) => {
            const active = target.type === selectedTarget;
            const gradient: [string, string] = index === 0 ? ['#fb6e52', '#ea573f'] : ['#a1d469', '#8dc050'];

            return (
              <TouchableOpacity
                key={target.type}
                style={[styles.card, active && styles.cardActive]}
                activeOpacity={0.92}
                onPress={() => setSelectedTarget(target.type)}>
                <View style={styles.cardMedia}>
                  <LinearGradient colors={gradient} style={styles.cardMediaGradient}>
                    <Ionicons name={index === 0 ? 'school-outline' : 'ribbon-outline'} size={30} color="#ffffff" />
                  </LinearGradient>
                </View>
                <View style={styles.cardBody}>
                  <View style={[styles.badge, index === 1 && styles.badgeSecondary]}>
                    <Text style={styles.badgeText}>{target.badge}</Text>
                  </View>
                  <Text style={styles.cardTitle}>{target.title}</Text>
                  <Text style={styles.cardDescription}>{target.description}</Text>
                  <Text style={styles.cardMeta}>
                    {target.modules} • {target.hours}
                  </Text>
                </View>
                {active && <Ionicons name="checkmark-circle" size={24} color="#00bd50" />}
              </TouchableOpacity>
            );
          })}
          <View style={{ height: 120 }} />
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.88}
            onPress={() => router.push({ pathname: '/target', params: { type: selectedTarget } })}>
            <Text style={styles.primaryButtonText}>Chọn mục tiêu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#faf8f8' },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#faf8f8' },
  container: { flex: 1, backgroundColor: '#faf8f8' },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontFamily: Fonts.bold, fontSize: 20, color: '#050018' },
  scrollContent: { paddingHorizontal: 24, paddingTop: 8 },
  title: { fontFamily: Fonts.bold, fontSize: 32, color: '#050018', marginBottom: 8 },
  subtitle: { fontFamily: Fonts.regular, fontSize: 14, color: '#373346', lineHeight: 21, marginBottom: 28 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 16,
  },
  cardActive: { borderColor: '#00bd50' },
  cardMedia: { width: 80, height: 80, borderRadius: 16, overflow: 'hidden' },
  cardMediaGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cardBody: { flex: 1 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#27ae60',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 8,
  },
  badgeSecondary: { backgroundColor: '#8dc050' },
  badgeText: { fontFamily: Fonts.bold, fontSize: 12, color: '#ffffff' },
  cardTitle: { fontFamily: Fonts.bold, fontSize: 18, color: '#130031', marginBottom: 6 },
  cardDescription: { fontFamily: Fonts.regular, fontSize: 12, color: '#6c5f80', lineHeight: 17, marginBottom: 8 },
  cardMeta: { fontFamily: Fonts.medium, fontSize: 12, color: '#6124c4' },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 24, paddingBottom: 40, backgroundColor: '#faf8f8' },
  primaryButton: {
    backgroundColor: '#00bd50',
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: { fontFamily: Fonts.bold, fontSize: 16, color: '#ffffff' },
});
