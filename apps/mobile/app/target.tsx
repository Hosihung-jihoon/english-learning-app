import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { CourseContent, TargetContent } from '../../../shared/types';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';
import { getCourses, getTarget } from '@/services/content-service';

export default function TargetInfoScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const { type } = useLocalSearchParams<{ type?: string }>();
  const [activeTab, setActiveTab] = useState<'Lộ trình' | 'Mô tả khóa học'>('Lộ trình');
  const [target, setTarget] = useState<TargetContent | null>(null);
  const [courses, setCourses] = useState<CourseContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !type) {
      return;
    }
    const accessToken = token;
    const selectedType = type;

    let mounted = true;
    async function load() {
      try {
        const [targetData, courseList] = await Promise.all([getTarget(accessToken, selectedType), getCourses(accessToken)]);
        if (!mounted) {
          return;
        }
        setTarget(targetData);
        setCourses(courseList.filter((course) => targetData.courseIds.includes(course.id)));
      } catch (loadError) {
        if (mounted) {
          setError(loadError instanceof Error ? loadError.message : 'Không tải được mục tiêu');
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
  }, [token, type]);

  const firstCourse = useMemo(() => courses[0], [courses]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#00bd50" />
      </SafeAreaView>
    );
  }

  if (!target) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <Text style={styles.errorText}>{error || 'Không tải được mục tiêu.'}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#050018" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thông tin mục tiêu</Text>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Thông tin mục tiêu' } } as never)}>
            <Ionicons name="information-circle-outline" size={22} color="#292d32" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.eyebrow}>Mục tiêu</Text>
          <Text style={styles.title}>{target.title}</Text>
          <Text style={styles.description}>{target.description}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <Ionicons name="trophy-outline" size={16} color="#00bd50" />
              <Text style={styles.metaChipText}>{target.modules}</Text>
            </View>
            <View style={styles.metaChipSecondary}>
              <Text style={styles.metaChipSecondaryText}>{target.hours}</Text>
            </View>
          </View>

          <View style={styles.tabRow}>
            {(['Lộ trình', 'Mô tả khóa học'] as const).map((tab) => (
              <TouchableOpacity key={tab} style={styles.tabButton} onPress={() => setActiveTab(tab)}>
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
                {activeTab === tab ? <View style={styles.tabIndicator} /> : null}
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === 'Lộ trình' ? (
            <View style={styles.sectionStack}>
              {courses.map((course) => (
                <View key={course.id} style={styles.unitCard}>
                  <View style={styles.unitHeader}>
                    <View>
                      <Text style={styles.unitLabel}>{course.unitLabel}</Text>
                      <Text style={styles.unitTitle}>{course.title}</Text>
                    </View>
                    <Ionicons name="chevron-down" size={22} color="#292d32" />
                  </View>

                  <TouchableOpacity
                    style={styles.courseCard}
                    activeOpacity={0.88}
                    onPress={() => router.push({ pathname: '/course', params: { courseId: course.id } })}>
                    <View style={styles.courseCardIcon}>
                      <Ionicons name="book-outline" size={24} color="#1954eb" />
                    </View>
                    <View style={styles.courseCardBody}>
                      <Text style={styles.courseCardType}>Khóa học</Text>
                      <Text style={styles.courseCardTitle}>{course.title}</Text>
                      <Text style={styles.courseCardDescription} numberOfLines={2}>
                        {course.description}
                      </Text>
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: `${course.progressPercent}%` }]} />
                      </View>
                    </View>
                  </TouchableOpacity>

                  {course.lockedAssessmentTitle ? (
                    <TouchableOpacity
                      style={styles.assessmentCard}
                      activeOpacity={0.88}
                      onPress={() => router.push({ pathname: '/assessment', params: { targetType: target.type } })}>
                      <View style={[styles.courseCardIcon, { backgroundColor: '#f0e8ff' }]}>
                        <Ionicons name="trophy-outline" size={24} color="#855ee6" />
                      </View>
                      <View style={styles.courseCardBody}>
                        <Text style={styles.courseCardType}>Assessment</Text>
                        <Text style={styles.courseCardTitle}>{course.lockedAssessmentTitle}</Text>
                        <Text style={styles.courseCardDescription}>Hoàn thành các bài học trong unit này để mở khóa.</Text>
                      </View>
                    </TouchableOpacity>
                  ) : null}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionCardTitle}>Giới thiệu khóa học</Text>
              <Text style={styles.descriptionCardBody}>
                {target.title} được chia thành các mô-đun ngắn, ưu tiên nội dung cốt lõi, quiz nhanh
                và tiến độ rõ ràng. Dữ liệu hiện đã lấy trực tiếp từ backend thay vì mock cục bộ.
              </Text>
            </View>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>

        {firstCourse ? (
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.88}
              onPress={() => router.push({ pathname: '/course', params: { courseId: firstCourse.id } })}>
              <Text style={styles.primaryButtonText}>Start Learning</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#faf8f8' },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#faf8f8' },
  errorText: { fontFamily: Fonts.medium, fontSize: 14, color: '#ea573f', textAlign: 'center', paddingHorizontal: 24 },
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
  scrollContent: { paddingHorizontal: 24, paddingTop: 12 },
  eyebrow: { fontFamily: Fonts.medium, fontSize: 12, color: '#929292', marginBottom: 4 },
  title: { fontFamily: Fonts.bold, fontSize: 28, color: '#050018', marginBottom: 8 },
  description: { fontFamily: Fonts.regular, fontSize: 14, color: '#373346', lineHeight: 20, marginBottom: 16 },
  metaRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  metaChipText: { fontFamily: Fonts.semiBold, fontSize: 12, color: '#00bd50' },
  metaChipSecondary: { backgroundColor: '#ffffff', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
  metaChipSecondaryText: { fontFamily: Fonts.semiBold, fontSize: 12, color: '#373346' },
  tabRow: { flexDirection: 'row', gap: 24, marginBottom: 24 },
  tabButton: { paddingVertical: 8 },
  tabText: { fontFamily: Fonts.medium, fontSize: 14, color: '#bababa' },
  tabTextActive: { fontFamily: Fonts.semiBold, color: '#00bd50' },
  tabIndicator: { marginTop: 8, height: 3, borderRadius: 2, backgroundColor: '#00bd50' },
  sectionStack: { gap: 16 },
  unitCard: { backgroundColor: '#f2f0f0', borderRadius: 24, padding: 16 },
  unitHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  unitLabel: { fontFamily: Fonts.medium, fontSize: 12, color: '#929292', marginBottom: 4 },
  unitTitle: { fontFamily: Fonts.bold, fontSize: 16, color: '#050018' },
  courseCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  assessmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    gap: 16,
    opacity: 0.88,
  },
  courseCardIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#d8e8ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseCardBody: { flex: 1 },
  courseCardType: { fontFamily: Fonts.medium, fontSize: 11, color: '#929292', textTransform: 'uppercase', marginBottom: 3 },
  courseCardTitle: { fontFamily: Fonts.bold, fontSize: 16, color: '#050018', marginBottom: 4 },
  courseCardDescription: { fontFamily: Fonts.regular, fontSize: 12, color: '#6c5f80', lineHeight: 16, marginBottom: 8 },
  progressTrack: { height: 6, borderRadius: 999, backgroundColor: '#f2f0f0', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999, backgroundColor: '#00bd50' },
  descriptionCard: { backgroundColor: '#ffffff', borderRadius: 24, padding: 20 },
  descriptionCardTitle: { fontFamily: Fonts.bold, fontSize: 18, color: '#050018', marginBottom: 12 },
  descriptionCardBody: { fontFamily: Fonts.regular, fontSize: 14, color: '#373346', lineHeight: 22 },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 24, paddingBottom: 40, backgroundColor: '#faf8f8' },
  primaryButton: {
    backgroundColor: '#00bd50',
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: { fontFamily: Fonts.bold, fontSize: 16, color: '#ffffff' },
});
