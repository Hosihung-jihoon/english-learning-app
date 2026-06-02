import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Redirect, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { CourseContent, LessonContent } from '../../../shared/types';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';
import { getCourse, getLessons } from '@/services/content-service';

const courseHero = require('../assets/images/figma-course-target-illustration-ab.png');

export default function CourseInfoScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { isLoading: authLoading, onboardingComplete, token } = useAuth();
  const { courseId } = useLocalSearchParams<{ courseId?: string }>();
  const normalizedCourseId = typeof courseId === 'string' && courseId.length > 0 ? courseId : undefined;
  const [activeTab, setActiveTab] = useState<'roadmap' | 'description'>('roadmap');
  const [course, setCourse] = useState<CourseContent | null>(null);
  const [lessons, setLessons] = useState<LessonContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setCourse(null);
    setLessons([]);
    setError(null);
    setSaved(false);
    setShowInfo(false);
    setActiveTab('roadmap');

    if (!token || !onboardingComplete || !normalizedCourseId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const accessToken = token;
    const selectedCourseId = normalizedCourseId;
    let mounted = true;

    async function load() {
      try {
        const [courseData, lessonList] = await Promise.all([getCourse(accessToken, selectedCourseId), getLessons(accessToken, selectedCourseId)]);

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
  }, [token, onboardingComplete, normalizedCourseId]);

  const scale = Math.min(width / 375, 1) * 0.84;
  const horizontal = 20 * scale;
  const completedLessonCount = useMemo(() => {
    if (!course) {
      return 0;
    }

    return Math.max(1, Math.round((course.progressPercent / 100) * Math.max(lessons.length, 1)));
  }, [course, lessons.length]);
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

  if (!normalizedCourseId) {
    return <Redirect href="/(tabs)/target" />;
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={['top']}>
        <ActivityIndicator size="large" color="#00bd50" />
      </SafeAreaView>
    );
  }

  if (!course) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={['top']}>
        <Text style={styles.errorText}>{error || 'Không tải được khóa học.'}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <View style={[styles.header, { paddingHorizontal: horizontal, paddingTop: 12 * scale, paddingBottom: 10 * scale }]}>
          <TouchableOpacity style={[styles.iconButton, { width: 38 * scale, height: 38 * scale, borderRadius: 19 * scale }]} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={21 * scale} color="#050018" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontSize: 18 * scale }]}>Thông tin khóa học</Text>
          <TouchableOpacity style={[styles.iconButton, { width: 38 * scale, height: 38 * scale, borderRadius: 19 * scale }]} onPress={() => setShowInfo((current) => !current)}>
            <Ionicons name="alert-circle" size={20 * scale} color="#292d32" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 96 * scale + insetBottom }}>
          {showInfo ? (
            <View style={[styles.infoCardInline, { marginHorizontal: horizontal, marginTop: 8 * scale, borderRadius: 16 * scale, padding: 15 * scale }]}>
              <Text style={[styles.infoCardInlineTitle, { fontSize: 14 * scale }]}>Thông tin khóa học</Text>
              <Text style={[styles.infoCardInlineText, { marginTop: 6 * scale, fontSize: 12 * scale, lineHeight: 19 * scale }]}>
                Khóa học này gom nội dung theo từng bài học ngắn, giữ progress rõ ràng và dẫn thẳng vào quiz ở cuối từng bài.
              </Text>
            </View>
          ) : null}

          <View style={[styles.heroSection, { paddingHorizontal: horizontal, paddingTop: 8 * scale }]}>
            <Image source={courseHero} style={{ width: 90 * scale, height: 90 * scale }} resizeMode="contain" />
            <Text style={[styles.eyebrow, { marginTop: 14 * scale, fontSize: 11 * scale }]}>Khóa học</Text>
            <Text style={[styles.title, { marginTop: 8 * scale, fontSize: 25 * scale, lineHeight: 31 * scale }]}>{course.title}</Text>
            <Text style={[styles.description, { marginTop: 14 * scale, fontSize: 13 * scale, lineHeight: 19 * scale }]}>{course.description}</Text>

            <View style={[styles.metaRow, { marginTop: 16 * scale, gap: 20 * scale }]}>
              <View style={styles.metaItem}>
                <Ionicons name="ribbon-outline" size={14 * scale} color="#00bd50" />
                <Text style={[styles.metaText, { marginLeft: 7 * scale, fontSize: 11 * scale }]}>{lessons.length} bài học</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={14 * scale} color="#00bd50" />
                <Text style={[styles.metaText, { marginLeft: 7 * scale, fontSize: 11 * scale }]}>{course.duration}</Text>
              </View>
            </View>

            <View style={[styles.progressWrap, { marginTop: 18 * scale }]}>
              <View style={[styles.progressTrack, { height: 10 * scale, borderRadius: 5 * scale }]}>
                <View style={[styles.progressFill, { width: `${course.progressPercent}%` }]} />
              </View>
              <View style={[styles.progressRow, { marginTop: 9 * scale }]}>
                <Text style={[styles.progressText, { fontSize: 10 * scale }]}>
                  {completedLessonCount}/{Math.max(lessons.length, 1)}
                </Text>
                <Text style={[styles.progressText, { fontSize: 10 * scale }]}>{course.progressPercent}%</Text>
              </View>
            </View>

            <View style={[styles.tabRow, { marginTop: 22 * scale }]}>
              <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab('roadmap')}>
                <Text style={[styles.tabText, { fontSize: 13 * scale }, activeTab === 'roadmap' && styles.tabTextActive]}>Lộ trình</Text>
                {activeTab === 'roadmap' ? <View style={[styles.tabIndicator, { marginTop: 8 * scale }]} /> : null}
              </TouchableOpacity>
              <TouchableOpacity style={styles.tabButton} onPress={() => setActiveTab('description')}>
                <Text style={[styles.tabText, { fontSize: 13 * scale }, activeTab === 'description' && styles.tabTextActive]}>Mô tả khóa học</Text>
                {activeTab === 'description' ? <View style={[styles.tabIndicator, { marginTop: 8 * scale }]} /> : null}
              </TouchableOpacity>
            </View>
          </View>

          {activeTab === 'roadmap' ? (
            <View style={[styles.panel, { marginTop: 14 * scale, borderTopLeftRadius: 28 * scale, borderTopRightRadius: 28 * scale, paddingHorizontal: horizontal, paddingTop: 18 * scale }]}>
              <View style={[styles.levelCard, { borderRadius: 16 * scale, paddingHorizontal: 15 * scale, paddingVertical: 13 * scale }]}>
                <View>
                  <Text style={[styles.levelLabel, { fontSize: 11 * scale }]}>Level 1</Text>
                  <Text style={[styles.levelTitle, { marginTop: 5 * scale, fontSize: 15 * scale }]}>{course.title}</Text>
                </View>
                <Ionicons name="chevron-down" size={20 * scale} color="#292d32" />
              </View>

              <View style={{ marginTop: 18 * scale, gap: 14 * scale }}>
                {lessons.map((lesson, index) => {
                  const isCompleted = index < completedLessonCount;

                  return (
                    <TouchableOpacity
                      key={lesson.id}
                      style={[
                        styles.lessonItem,
                        {
                          borderRadius: 22 * scale,
                          paddingHorizontal: 15 * scale,
                          paddingVertical: 15 * scale,
                          borderWidth: isCompleted && index === 0 ? 2.5 : 0,
                          borderColor: isCompleted && index === 0 ? '#55ba5d' : 'transparent',
                        },
                      ]}
                      activeOpacity={0.9}
                      onPress={() => router.push({ pathname: '/lesson', params: { lessonId: lesson.id } })}>
                      <View style={styles.lessonLeading}>
                        <View style={[styles.lessonIcon, { width: 46 * scale, height: 46 * scale, borderRadius: 23 * scale }]}>
                          <Text style={[styles.lessonIconText, { fontSize: 21 * scale }]}>{lesson.title.trim().charAt(0).toUpperCase()}</Text>
                        </View>

                        <View style={styles.lessonBody}>
                          <Text style={[styles.lessonName, { fontSize: 15 * scale, lineHeight: 20 * scale }]}>{lesson.title}</Text>
                          <View style={[styles.lessonMetaRow, { marginTop: 8 * scale }]}>
                            <View style={styles.lessonMetaItem}>
                              <Ionicons name="ribbon-outline" size={13 * scale} color="#b8b8b8" />
                              <Text style={[styles.lessonCaption, { marginLeft: 6 * scale, fontSize: 11 * scale }]}>{lesson.label}</Text>
                            </View>
                            <View style={styles.lessonMetaItem}>
                              <Ionicons name="time-outline" size={13 * scale} color="#b8b8b8" />
                              <Text style={[styles.lessonCaption, { marginLeft: 6 * scale, fontSize: 11 * scale }]}>{lesson.questionCount} câu hỏi</Text>
                            </View>
                          </View>
                        </View>
                      </View>

                      <View style={[styles.lessonStatus, { width: 34 * scale, height: 34 * scale, borderRadius: 17 * scale, backgroundColor: isCompleted ? '#08c857' : '#dfe5df' }]}>
                        <Ionicons name="checkmark" size={20 * scale} color="#ffffff" />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {course.lockedAssessmentTitle ? (
                <TouchableOpacity
                  style={[styles.lockedAssessment, { marginTop: 14 * scale, borderRadius: 22 * scale, paddingHorizontal: 15 * scale, paddingVertical: 15 * scale }]}
                  activeOpacity={0.9}
                  onPress={() => router.push({ pathname: '/assessment', params: { targetType: course.targetType } })}>
                  <View style={styles.lessonLeading}>
                    <View style={[styles.lessonIcon, { width: 46 * scale, height: 46 * scale, borderRadius: 23 * scale, backgroundColor: '#f2f0f0' }]}>
                      <Ionicons name="trophy-outline" size={20 * scale} color="#bebebe" />
                    </View>
                    <View style={styles.lessonBody}>
                      <Text style={[styles.lockedTitle, { fontSize: 15 * scale }]}>{course.lockedAssessmentTitle}</Text>
                      <Text style={[styles.lessonCaption, { marginTop: 6 * scale, fontSize: 11 * scale }]}>Vượt qua để học tiếp</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : (
            <View style={[styles.panel, { marginTop: 14 * scale, borderTopLeftRadius: 28 * scale, borderTopRightRadius: 28 * scale, paddingHorizontal: horizontal, paddingTop: 18 * scale }]}>
              <View style={[styles.descriptionCard, { borderRadius: 20 * scale, padding: 18 * scale }]}>
                <Text style={[styles.descriptionTitle, { fontSize: 16 * scale }]}>Mô tả khóa học</Text>
                <Text style={[styles.descriptionBody, { marginTop: 12 * scale, fontSize: 13 * scale, lineHeight: 21 * scale }]}>
                  {course.description} Khóa học này đi từ kiến thức nền đến bài học ứng dụng, giữ cách phân cấp nội dung và nhịp độ progress gần với Figma.
                </Text>
                <Text style={[styles.descriptionHint, { marginTop: 14 * scale, fontSize: 12 * scale, lineHeight: 19 * scale }]}>
                  Hoàn thành từng bài để mở khóa đánh giá và tiếp tục lên cấp độ tiếp theo.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {lessons[0] ? (
          <View style={[styles.bottomBar, { paddingHorizontal: horizontal, paddingTop: 12 * scale, paddingBottom: insetBottom + 8 * scale, gap: 12 * scale }]}>
            <TouchableOpacity style={[styles.secondaryButton, { width: 64 * scale, height: 48 * scale, borderRadius: 24 * scale }]} onPress={() => setSaved((current) => !current)}>
              <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={21 * scale} color={saved ? '#00bd50' : '#292d32'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.primaryButton, { flex: 1, height: 48 * scale, borderRadius: 999 }]}
              activeOpacity={0.9}
              onPress={() => router.push({ pathname: '/lesson', params: { lessonId: lessons[0].id } })}>
              <Text style={[styles.primaryButtonText, { fontSize: 15 * scale }]}>Bắt đầu</Text>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconButton: { backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: Fonts.bold, color: '#050018' },
  eyebrow: { fontFamily: Fonts.medium, color: '#979797' },
  title: { fontFamily: Fonts.bold, color: '#000000' },
  description: { fontFamily: Fonts.regular, color: '#4a4961' },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontFamily: Fonts.medium, color: '#00bd50' },
  progressTrack: { backgroundColor: '#ececf0', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#28b35b', borderRadius: 999 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { fontFamily: Fonts.semiBold, color: '#696674' },
  tabRow: { flexDirection: 'row', gap: 22 },
  tabButton: { alignItems: 'flex-start' },
  tabText: { fontFamily: Fonts.medium, color: '#bababa' },
  tabTextActive: { fontFamily: Fonts.bold, color: '#55ba5d' },
  tabIndicator: { width: '100%', height: 2, borderRadius: 2, backgroundColor: '#00bd50' },
  panel: { backgroundColor: '#ffffff', minHeight: 500 },
  levelCard: { backgroundColor: '#f2f0f0', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  levelLabel: { fontFamily: Fonts.medium, color: '#969696' },
  levelTitle: { fontFamily: Fonts.bold, color: '#050018' },
  lessonItem: { backgroundColor: '#f7f4f4', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lessonLeading: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  lessonIcon: { backgroundColor: '#fff9dc', alignItems: 'center', justifyContent: 'center' },
  lessonIconText: { fontFamily: Fonts.bold, color: '#f1cf1f' },
  lessonBody: { flex: 1, marginLeft: 13 },
  lessonName: { fontFamily: Fonts.bold, color: '#000000' },
  lessonMetaRow: { flexDirection: 'row', gap: 14 },
  lessonMetaItem: { flexDirection: 'row', alignItems: 'center' },
  lessonCaption: { fontFamily: Fonts.medium, color: '#a8a8a8' },
  lessonStatus: { alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  lockedAssessment: { backgroundColor: '#f1f0f0' },
  lockedTitle: { fontFamily: Fonts.bold, color: '#bebebe' },
  descriptionCard: { backgroundColor: '#f8f5f5' },
  descriptionTitle: { fontFamily: Fonts.bold, color: '#050018' },
  descriptionBody: { fontFamily: Fonts.regular, color: '#4a4961' },
  descriptionHint: { fontFamily: Fonts.medium, color: '#8f8aa0' },
  infoCardInline: { backgroundColor: '#ffffff' },
  infoCardInlineTitle: { fontFamily: Fonts.bold, color: '#050018' },
  infoCardInlineText: { fontFamily: Fonts.regular, color: '#4a4961' },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#faf8f8', flexDirection: 'row' },
  secondaryButton: { backgroundColor: '#e8e8e8', alignItems: 'center', justifyContent: 'center' },
  primaryButton: { backgroundColor: '#57be5d', alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { fontFamily: Fonts.bold, color: '#ffffff' },
  heroSection: {},
  progressWrap: {},
});
