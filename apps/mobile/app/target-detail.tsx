import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Redirect, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { CourseContent, TargetContent, TargetType } from '../../../shared/types';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';
import { getCourses, getTarget } from '@/services/content-service';

const targetIllustration = require('../assets/images/figma-course-target-illustration-ab.png');
const nounCardAsset = require('../assets/images/figma-course-card-noun.png');
const verbCardAsset = require('../assets/images/figma-course-card-verb.png');

export default function TargetDetailScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { isLoading: authLoading, onboardingComplete, token } = useAuth();
  const { type } = useLocalSearchParams<{ type?: TargetType }>();
  const normalizedType = typeof type === 'string' ? type : undefined;
  const [activeTab, setActiveTab] = useState<'roadmap' | 'description'>('roadmap');
  const [target, setTarget] = useState<TargetContent | null>(null);
  const [courses, setCourses] = useState<CourseContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setTarget(null);
    setCourses([]);
    setError(null);
    setShowInfo(false);
    setSaved(false);
    setActiveTab('roadmap');

    if (!token || !onboardingComplete || !normalizedType) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const accessToken = token;
    const selectedType = normalizedType;
    let mounted = true;

    async function load() {
      try {
        const [targetData, allCourses] = await Promise.all([getTarget(accessToken, selectedType), getCourses(accessToken)]);

        if (!mounted) {
          return;
        }

        setTarget(targetData);
        setCourses(allCourses.filter((course) => targetData.courseIds.includes(course.id)));
      } catch (loadError) {
        if (mounted) {
          setError(loadError instanceof Error ? loadError.message : 'Không tải được thông tin mục tiêu');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [token, normalizedType]);

  const scale = Math.min(width / 375, 1) * 0.84;
  const horizontal = 20 * scale;
  const featuredCourses = useMemo(() => courses.slice(0, 2), [courses]);
  const insetBottom = Math.max(insets.bottom, 16);

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

  if (!normalizedType) {
    return <Redirect href="/(tabs)/target" />;
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={['top']}>
        <ActivityIndicator size="large" color="#00bd50" />
      </SafeAreaView>
    );
  }

  if (!target) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={['top']}>
        <Text style={styles.errorText}>{error || 'Không tải được thông tin mục tiêu.'}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 96 * scale + insetBottom }}>
          <View style={[styles.header, { paddingHorizontal: horizontal, paddingTop: 12 * scale }]}>
            <TouchableOpacity style={[styles.iconButton, { width: 38 * scale, height: 38 * scale, borderRadius: 19 * scale }]} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={21 * scale} color="#050018" />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { fontSize: 18 * scale }]}>Thông tin mục tiêu</Text>
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
                Lộ trình này tập trung vào {target.title}, giữ nhịp học theo từng cụm nội dung và đưa bạn vào khóa học phù hợp nhanh hơn.
              </Text>
            </View>
          ) : null}

          <View style={[styles.heroSection, { paddingHorizontal: horizontal, marginTop: 10 * scale }]}>
            <Image source={targetIllustration} style={{ width: 154 * scale, height: 154 * scale }} resizeMode="contain" />
            <Text style={[styles.eyebrow, { marginTop: 8 * scale, fontSize: 11 * scale }]}>Mục tiêu</Text>
            <Text style={[styles.heroTitle, { marginTop: 9 * scale, fontSize: 21 * scale, lineHeight: 27 * scale }]}>{target.title.toUpperCase()}</Text>
            <Text style={[styles.heroDescription, { marginTop: 16 * scale, fontSize: 13 * scale, lineHeight: 19 * scale }]}>{target.description}</Text>

            <View style={[styles.metaRow, { marginTop: 16 * scale, gap: 20 * scale }]}>
              <View style={styles.metaItem}>
                <Ionicons name="ribbon-outline" size={14 * scale} color="#00bd50" />
                <Text style={[styles.metaText, { marginLeft: 7 * scale, fontSize: 11 * scale }]}>{target.modules}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={14 * scale} color="#00bd50" />
                <Text style={[styles.metaText, { marginLeft: 7 * scale, fontSize: 11 * scale }]}>{target.hours}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.tabRow, { marginTop: 22 * scale, paddingHorizontal: horizontal }]}>
            <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('roadmap')}>
              <Text style={[styles.tabText, activeTab === 'roadmap' && styles.tabTextActive]}>Lộ trình</Text>
              {activeTab === 'roadmap' ? <View style={styles.tabIndicator} /> : null}
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('description')}>
              <Text style={[styles.tabText, activeTab === 'description' && styles.tabTextActive]}>Mô tả khóa học</Text>
              {activeTab === 'description' ? <View style={styles.tabIndicator} /> : null}
            </TouchableOpacity>
          </View>

          {activeTab === 'roadmap' ? (
            <View style={[styles.roadmapPanel, { marginHorizontal: horizontal, marginTop: 14 * scale, borderRadius: 26 * scale, padding: 15 * scale }]}>
              <View style={[styles.unitHeader, { borderRadius: 15 * scale, paddingHorizontal: 15 * scale, paddingVertical: 11 * scale }]}>
                <View>
                  <Text style={[styles.unitEyebrow, { fontSize: 11 * scale }]}>Học</Text>
                  <Text style={[styles.unitTitle, { marginTop: 4 * scale, fontSize: 15 * scale }]}>Unit 1: Loại từ trong tiếng Anh</Text>
                </View>
                <Ionicons name="chevron-down" size={20 * scale} color="#292d32" />
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 * scale, paddingTop: 14 * scale }}>
                {featuredCourses.map((course, index) => (
                  <TouchableOpacity key={course.id} activeOpacity={0.92} onPress={() => router.push({ pathname: '/course', params: { courseId: course.id } })}>
                    <Image source={index === 0 ? nounCardAsset : verbCardAsset} style={{ width: 224 * scale, height: 188 * scale, borderRadius: 24 * scale }} resizeMode="cover" />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ) : (
            <View style={[styles.descriptionCard, { marginHorizontal: horizontal, marginTop: 14 * scale, borderRadius: 20 * scale, padding: 17 * scale }]}>
              <Text style={[styles.descriptionTitle, { fontSize: 16 * scale }]}>Lộ trình học cho {target.title}</Text>
              <Text style={[styles.descriptionBody, { marginTop: 12 * scale, fontSize: 13 * scale, lineHeight: 21 * scale }]}>
                {target.description} Lộ trình này ưu tiên cách học từ kiến thức nền, khóa học theo chủ đề và bài kiểm tra theo từng cụm nội dung để giữ đúng nhịp như Figma.
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={[styles.bottomBar, { paddingHorizontal: 20 * scale, paddingTop: 14 * scale, paddingBottom: insetBottom + 8 * scale, gap: 12 * scale }]}>
          <TouchableOpacity style={[styles.secondaryButton, { width: 64 * scale, height: 48 * scale, borderRadius: 24 * scale }]} onPress={() => setSaved((current) => !current)}>
            <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={21 * scale} color={saved ? '#00bd50' : '#292d32'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.primaryButton, { flex: 1, height: 48 * scale, borderRadius: 999 }]}
            onPress={() => {
              const firstCourse = featuredCourses[0];
              if (firstCourse) {
                router.push({ pathname: '/course', params: { courseId: firstCourse.id } });
              }
            }}>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconButton: { backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: Fonts.bold, color: '#050018' },
  heroSection: { paddingBottom: 8 },
  eyebrow: { fontFamily: Fonts.medium, color: '#929292' },
  heroTitle: { fontFamily: Fonts.bold, color: '#000000' },
  heroDescription: { fontFamily: Fonts.regular, color: '#373346' },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontFamily: Fonts.medium, color: '#00bd50' },
  tabRow: { flexDirection: 'row', gap: 22 },
  tabItem: { paddingBottom: 4 },
  tabText: { fontFamily: Fonts.medium, fontSize: 13, color: '#bababa' },
  tabTextActive: { fontFamily: Fonts.semiBold, color: '#55ba5d' },
  tabIndicator: { marginTop: 6, height: 2, borderRadius: 2, backgroundColor: '#00bd50' },
  roadmapPanel: { backgroundColor: '#ffffff' },
  unitHeader: { backgroundColor: '#f2f0f0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  unitEyebrow: { fontFamily: Fonts.medium, color: '#929292' },
  unitTitle: { fontFamily: Fonts.bold, color: '#050018' },
  infoCard: { backgroundColor: '#ffffff' },
  infoCardTitle: { fontFamily: Fonts.bold, color: '#050018' },
  infoCardText: { fontFamily: Fonts.regular, color: '#4a4961' },
  descriptionCard: { backgroundColor: '#ffffff' },
  descriptionTitle: { fontFamily: Fonts.bold, color: '#050018' },
  descriptionBody: { fontFamily: Fonts.regular, color: '#373346' },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#faf8f8', flexDirection: 'row' },
  secondaryButton: { backgroundColor: '#eaeaea', alignItems: 'center', justifyContent: 'center' },
  primaryButton: { backgroundColor: '#55ba5d', alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { fontFamily: Fonts.bold, color: '#ffffff' },
});
