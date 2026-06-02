import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { TargetContent, TargetType } from '../../../../shared/types';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';
import { getTargets } from '@/services/content-service';

const targetIllustration = require('../../assets/images/figma-target-illustration-ab.png');

function getDifficulty(type: TargetType) {
  return type === 'toeic' ? 'Dễ' : 'Nâng cao';
}

export default function TargetSelectionScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const { width } = useWindowDimensions();
  const tabBarHeight = useBottomTabBarHeight();
  const [targets, setTargets] = useState<TargetContent[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let mounted = true;

    getTargets(token)
      .then((items) => {
        if (mounted) {
          setTargets(items);
        }
      })
      .catch((loadError) => {
        if (mounted) {
          setError(loadError instanceof Error ? loadError.message : 'Không tải được mục tiêu học tập.');
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

  const selectedTarget = useMemo(() => targets[selectedIndex] ?? targets[0], [selectedIndex, targets]);
  const scale = Math.min(width / 375, 1) * 0.84;
  const horizontal = 20 * scale;

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={['top']}>
        <ActivityIndicator size="large" color="#00bd50" />
      </SafeAreaView>
    );
  }

  if (!selectedTarget) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={['top']}>
        <Text style={styles.errorText}>{error || 'Chưa có dữ liệu mục tiêu.'}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: tabBarHeight + 96 * scale }}>
          <View style={[styles.header, { paddingHorizontal: horizontal, paddingTop: 12 * scale }]}>
            <TouchableOpacity style={[styles.iconButton, { width: 38 * scale, height: 38 * scale, borderRadius: 19 * scale }]} onPress={() => router.replace('/(tabs)')}>
              <Ionicons name="chevron-back" size={21 * scale} color="#050018" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconButton, { width: 38 * scale, height: 38 * scale, borderRadius: 19 * scale }]}
              onPress={() => setShowInfo((current) => !current)}>
              <Ionicons name="alert-circle" size={20 * scale} color="#292d32" />
            </TouchableOpacity>
          </View>

          {showInfo ? (
            <View style={[styles.infoCard, { marginHorizontal: horizontal, marginTop: 12 * scale, borderRadius: 16 * scale, padding: 15 * scale }]}>
              <Text style={[styles.infoCardTitle, { fontSize: 14 * scale }]}>Thông tin mục tiêu</Text>
              <Text style={[styles.infoCardText, { marginTop: 6 * scale, fontSize: 12 * scale, lineHeight: 19 * scale }]}>
                Hãy chọn mục tiêu gần nhất với bạn. Sau đó app sẽ gợi ý lộ trình, khóa học và bài đánh giá phù hợp để bắt đầu nhanh hơn.
              </Text>
            </View>
          ) : null}

          <View style={{ paddingHorizontal: horizontal, marginTop: 14 * scale }}>
            <Text style={[styles.title, { fontSize: 27 * scale, lineHeight: 34 * scale }]}>Chọn mục tiêu</Text>
            <Text style={[styles.subtitle, { fontSize: 13 * scale, lineHeight: 19 * scale, marginTop: 12 * scale }]}>
              Lựa chọn mục tiêu phù hợp với bạn, SUMO sẽ giúp bạn đạt được mục tiêu đó.
            </Text>
          </View>

          <View
            style={[
              styles.cardWrap,
              {
                marginHorizontal: 26 * scale,
                marginTop: 22 * scale,
                borderRadius: 34 * scale,
                paddingHorizontal: 18 * scale,
                paddingTop: 22 * scale,
                paddingBottom: 24 * scale,
              },
            ]}>
            <Image source={targetIllustration} style={{ width: 182 * scale, height: 182 * scale, alignSelf: 'center' }} resizeMode="contain" />

            <View style={[styles.difficultyChip, { marginTop: 12 * scale, borderRadius: 22 * scale, paddingHorizontal: 22 * scale, paddingVertical: 8 * scale }]}>
              <Text style={[styles.difficultyText, { fontSize: 14 * scale }]}>{getDifficulty(selectedTarget.type)}</Text>
            </View>

            <Text style={[styles.cardTitle, { fontSize: 20 * scale, lineHeight: 26 * scale, marginTop: 24 * scale }]}>{selectedTarget.title.toUpperCase()}</Text>
            <Text style={[styles.cardDescription, { fontSize: 13 * scale, lineHeight: 19 * scale, marginTop: 12 * scale }]}>{selectedTarget.description}</Text>
            <Text style={[styles.cardMeta, { fontSize: 13 * scale, marginTop: 22 * scale }]}>
              {selectedTarget.modules} {'\u2022'} {selectedTarget.hours}
            </Text>
          </View>

          {targets.length > 1 ? (
            <View style={[styles.switchRow, { marginTop: 16 * scale }]}>
              {targets.map((item, index) => {
                const active = index === selectedIndex;

                return <TouchableOpacity key={item.type} style={[styles.switchDot, active && styles.switchDotActive]} onPress={() => setSelectedIndex(index)} />;
              })}
            </View>
          ) : null}
        </ScrollView>

        <View style={[styles.bottomBar, { paddingHorizontal: 52 * scale, paddingBottom: tabBarHeight + 8 * scale, paddingTop: 10 * scale }]}>
          <TouchableOpacity
            style={[styles.primaryButton, { height: 50 * scale, borderRadius: 999 }]}
            activeOpacity={0.9}
            onPress={() => router.push({ pathname: '/target-detail', params: { type: selectedTarget.type } })}>
            <Text style={[styles.primaryButtonText, { fontSize: 15 * scale }]}>Chọn mục tiêu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#faf8f8' },
  container: { flex: 1, backgroundColor: '#faf8f8' },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#faf8f8' },
  errorText: { fontFamily: Fonts.medium, fontSize: 14, color: '#ea573f', textAlign: 'center', paddingHorizontal: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconButton: { backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  infoCard: { backgroundColor: '#ffffff' },
  infoCardTitle: { fontFamily: Fonts.bold, color: '#050018' },
  infoCardText: { fontFamily: Fonts.regular, color: '#666272' },
  title: { fontFamily: Fonts.bold, color: '#050018' },
  subtitle: { fontFamily: Fonts.regular, color: '#373346' },
  cardWrap: { backgroundColor: '#ffffff' },
  difficultyChip: { alignSelf: 'center', backgroundColor: '#27ae60' },
  difficultyText: { fontFamily: Fonts.semiBold, color: '#ffffff' },
  cardTitle: { fontFamily: Fonts.bold, color: '#130031', textAlign: 'center' },
  cardDescription: { fontFamily: Fonts.regular, color: '#6c5f80', textAlign: 'center' },
  cardMeta: { fontFamily: Fonts.medium, color: '#6124c4', textAlign: 'center' },
  switchRow: { flexDirection: 'row', alignSelf: 'center', gap: 8 },
  switchDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#d9d9d9' },
  switchDotActive: { width: 18, backgroundColor: '#55ba5d' },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#faf8f8' },
  primaryButton: { backgroundColor: '#55ba5d', alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { fontFamily: Fonts.bold, color: '#ffffff' },
});
