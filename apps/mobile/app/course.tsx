import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { CourseContent, LessonContent } from '../../../shared/types';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';
import { getCourse, getLessons } from '@/services/content-service';

export default function CourseInfoScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const { courseId } = useLocalSearchParams<{ courseId?: string }>();
  const [activeTab, setActiveTab] = useState<'Lộ trình' | 'Mô tả khóa học'>('Lộ trình');
  const [course, setCourse] = useState<CourseContent | null>(null);
  const [lessons, setLessons] = useState<LessonContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !courseId) {
      return;
    }
    const accessToken = token;
    const selectedCourseId = courseId;

    let mounted = true;
    async function load() {
      try {
        const [courseData, lessonList] = await Promise.all([
          getCourse(accessToken, selectedCourseId),
          getLessons(accessToken, selectedCourseId),
        ]);
        if (!mounted) {
          return;
        }
        setCourse(courseData);
        setLessons(lessonList);
      } catch (loadError) {
        if (mounted) {
          setError(loadError instanceof Error ? loadError.message : 'Không tải được khóa học');
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
  }, [token, courseId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#00bd50" />
      </SafeAreaView>
    );
  }

  if (!course) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <Text style={styles.errorText}>{error || 'Không tải được khóa học.'}</Text>
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
          <Text style={styles.headerTitle}>Thông tin khóa học</Text>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Thông tin khóa học' } } as never)}>
            <Ionicons name="information-circle-outline" size={22} color="#292d32" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.eyebrow}>Khóa học</Text>
          <Text style={styles.title}>{course.title}</Text>
          <Text style={styles.description}>{course.description}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaBadge}>
              <Ionicons name="trophy-outline" size={16} color="#00bd50" />
              <Text style={styles.metaBadgeText}>{lessons.length} bài học</Text>
            </View>
            <View style={styles.metaBadgeOutline}>
              <Text style={styles.metaBadgeOutlineText}>{course.duration}</Text>
            </View>
          </View>

          <View style={styles.progressCard}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${course.progressPercent}%` }]} />
            </View>
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>
                {Math.round((course.progressPercent / 100) * Math.max(lessons.length, 1))}/{Math.max(lessons.length, 1)}
              </Text>
              <Text style={styles.progressText}>{course.progressPercent}%</Text>
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
            <View style={styles.levelCard}>
              <View style={styles.levelHeader}>
                <View>
                  <Text style={styles.levelLabel}>{course.unitLabel}</Text>
                  <Text style={styles.levelTitle}>{course.title}</Text>
                </View>
                <Ionicons name="chevron-down" size={22} color="#292d32" />
              </View>

              {lessons.map((lesson, index) => (
                <TouchableOpacity
                  key={lesson.id}
                  style={styles.lessonItem}
                  activeOpacity={0.88}
                  onPress={() => router.push({ pathname: '/lesson', params: { lessonId: lesson.id } })}>
                  <View style={styles.lessonLeading}>
                    <View style={styles.lessonIcon}>
                      <Ionicons
                        name={index === lessons.length - 1 ? 'flash-outline' : 'document-text-outline'}
                        size={20}
                        color={index === lessons.length - 1 ? '#ffa100' : '#7e7bec'}
                      />
                    </View>
                    <View style={styles.lessonBody}>
                      <Text style={styles.lessonName}>{lesson.title}</Text>
                      <Text style={styles.lessonCaption}>
                        {lesson.label} • {lesson.duration}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="checkmark-circle" size={24} color={index === 0 ? '#00bd50' : '#d7d7dc'} />
                </TouchableOpacity>
              ))}

              {course.lockedAssessmentTitle ? (
                <TouchableOpacity
                  style={styles.lockedAssessment}
                  activeOpacity={0.88}
                  onPress={() => router.push({ pathname: '/assessment', params: { targetType: course.targetType } })}>
                  <View style={styles.lessonLeading}>
                    <View style={[styles.lessonIcon, { backgroundColor: '#e4e4e7' }]}>
                      <Ionicons name="trophy-outline" size={20} color="#a8a8a8" />
                    </View>
                    <View style={styles.lessonBody}>
                      <Text style={styles.lockedTitle}>{course.lockedAssessmentTitle}</Text>
                      <Text style={styles.lessonCaption}>Vượt qua để học tiếp</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : (
            <View style={styles.courseDescriptionCard}>
              <Text style={styles.courseDescriptionBody}>
                Template course hiện đã lấy dữ liệu trực tiếp từ backend và tính progress theo tiến độ học
                của người dùng. Các node `Khóa Học1-6` trong Figma được gom thành một cấu trúc course detail
                thống nhất.
              </Text>
            </View>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>

        {lessons[0] ? (
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.88}
              onPress={() => router.push({ pathname: '/lesson', params: { lessonId: lessons[0].id } })}>
              <Text style={styles.primaryButtonText}>Bắt đầu</Text>
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
  header: { paddingHorizontal: 24, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: Fonts.bold, fontSize: 20, color: '#050018' },
  scrollContent: { paddingHorizontal: 24, paddingTop: 12 },
  eyebrow: { fontFamily: Fonts.medium, fontSize: 12, color: '#929292', marginBottom: 4 },
  title: { fontFamily: Fonts.bold, fontSize: 24, color: '#000000', marginBottom: 8 },
  description: { fontFamily: Fonts.regular, fontSize: 14, color: '#373346', lineHeight: 20, marginBottom: 16 },
  metaRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  metaBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ffffff', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  metaBadgeText: { fontFamily: Fonts.medium, fontSize: 12, color: '#00bd50' },
  metaBadgeOutline: { backgroundColor: '#ffffff', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  metaBadgeOutlineText: { fontFamily: Fonts.medium, fontSize: 12, color: '#00bd50' },
  progressCard: { marginBottom: 24 },
  progressTrack: { height: 8, backgroundColor: '#eeedef', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', backgroundColor: '#27ae60', borderRadius: 4 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { fontFamily: Fonts.medium, fontSize: 12, color: '#696674' },
  tabRow: { flexDirection: 'row', gap: 24, marginBottom: 24 },
  tabButton: { paddingVertical: 8 },
  tabText: { fontFamily: Fonts.medium, fontSize: 14, color: '#bababa' },
  tabTextActive: { fontFamily: Fonts.semiBold, color: '#00bd50' },
  tabIndicator: { marginTop: 8, height: 2, borderRadius: 2, backgroundColor: '#00bd50' },
  levelCard: { borderRadius: 16, padding: 16, backgroundColor: '#faf8f8' },
  levelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  levelLabel: { fontFamily: Fonts.medium, fontSize: 12, color: '#929292', marginBottom: 4 },
  levelTitle: { fontFamily: Fonts.bold, fontSize: 16, color: '#050018' },
  lessonItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  lessonLeading: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  lessonIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  lessonBody: { flex: 1 },
  lessonName: { fontFamily: Fonts.bold, fontSize: 16, color: '#000000', marginBottom: 4 },
  lessonCaption: { fontFamily: Fonts.medium, fontSize: 12, color: '#a8a8a8' },
  lockedAssessment: { marginTop: 8, backgroundColor: '#e1e1e1', borderRadius: 16, padding: 16 },
  lockedTitle: { fontFamily: Fonts.bold, fontSize: 16, color: '#bebebe', marginBottom: 4 },
  courseDescriptionCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 20 },
  courseDescriptionBody: { fontFamily: Fonts.regular, fontSize: 14, color: '#373346', lineHeight: 22 },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 24, paddingBottom: 40, backgroundColor: '#faf8f8' },
  primaryButton: { backgroundColor: '#00bd50', borderRadius: 999, paddingVertical: 16, alignItems: 'center' },
  primaryButtonText: { fontFamily: Fonts.bold, fontSize: 16, color: '#ffffff' },
});
