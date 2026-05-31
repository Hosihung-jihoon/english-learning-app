import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { CourseContent, LessonContent, TargetContent } from '../../../../shared/types';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';
import { getCourses, getLessons, getTargets } from '@/services/content-service';

export default function HomeScreen() {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const { width } = useWindowDimensions();
  const { token } = useAuth();
  const [expanded, setExpanded] = useState(true);
  const [targets, setTargets] = useState<TargetContent[]>([]);
  const [courses, setCourses] = useState<CourseContent[]>([]);
  const [lessons, setLessons] = useState<LessonContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError('Phiên đăng nhập đã hết hạn.');
      return;
    }

    const accessToken = token;
    let mounted = true;

    async function load() {
      try {
        const [targetList, courseList] = await Promise.all([getTargets(accessToken), getCourses(accessToken)]);
        if (!mounted) {
          return;
        }

        setTargets(targetList);
        setCourses(courseList);

        if (courseList[0]) {
          const lessonList = await getLessons(accessToken, courseList[0].id);
          if (!mounted) {
            return;
          }
          setLessons(lessonList);
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError instanceof Error ? loadError.message : 'Không tải được dữ liệu');
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
  }, [token]);

  const featuredCourse = courses[0];
  const featuredTarget = targets[0];
  const headlineLesson = useMemo(() => lessons[1] ?? lessons[0], [lessons]);
  const journeyLessons = lessons.slice(0, 2);
  const scale = Math.min(width / 375, 1) * 0.93;
  const horizontal = 24 * scale;
  const cardRadius = 28 * scale;
  const actionSize = 46 * scale;
  const ringSize = 88 * scale;
  const ringCore = 68 * scale;
  const bannerHeight = 196 * scale;

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#27ae60" />
      </SafeAreaView>
    );
  }

  if (!featuredCourse || !featuredTarget || !headlineLesson) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <Text style={styles.errorText}>{error || 'Chưa có dữ liệu học tập.'}</Text>
      </SafeAreaView>
    );
  }

  const totalLessons = Math.max(lessons.length, 1);
  const completedLessons = Math.max(1, Math.round((featuredCourse.progressPercent / 100) * totalLessons));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: tabBarHeight + 20, backgroundColor: '#faf8f8' }}>
        <View style={[styles.header, { paddingHorizontal: horizontal, paddingTop: 14 * scale }]}>
          <View style={[styles.levelCapsule, { borderRadius: 24 * scale, paddingHorizontal: 16 * scale, paddingVertical: 10 * scale }]}>
            <Ionicons name="flag" size={16 * scale} color="#27ae60" />
            <Text style={[styles.levelText, { fontSize: 15 * scale }]}>{featuredTarget.title}</Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.iconButton, { width: actionSize, height: actionSize, borderRadius: actionSize / 2 }]}
              onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Tìm kiếm' } } as never)}>
              <Ionicons name="search-outline" size={20 * scale} color="#292d32" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconButton, { width: actionSize, height: actionSize, borderRadius: actionSize / 2 }]}
              onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Thông báo' } } as never)}>
              <Ionicons name="notifications-outline" size={20 * scale} color="#292d32" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.activeCard, { marginHorizontal: horizontal, marginTop: 18 * scale, borderRadius: cardRadius, padding: 22 * scale }]}
          activeOpacity={0.92}
          onPress={() => router.push({ pathname: '/course', params: { courseId: featuredCourse.id } })}>
          <View style={styles.activeLessonSection}>
            <Image
              source={require('../../assets/images/figma-lamp.png')}
              style={{ width: 56 * scale, height: 56 * scale, marginRight: 14 * scale }}
              resizeMode="contain"
            />
            <View style={styles.activeLessonCopy}>
              <Text style={[styles.activeTitle, { fontSize: 22 * scale, lineHeight: 28 * scale }]}>{headlineLesson.title}</Text>
              <Text style={[styles.activeSubtitle, { fontSize: 14 * scale, marginTop: 6 * scale }]}>
                {headlineLesson.label} {'\u2022'} {headlineLesson.questionCount} câu hỏi
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { marginVertical: 18 * scale }]} />

          <View style={styles.courseRow}>
            <View style={{ flex: 1, paddingRight: 12 * scale }}>
              <Text style={[styles.eyebrow, { fontSize: 14 * scale, marginBottom: 6 * scale }]}>Khóa học</Text>
              <Text style={[styles.courseName, { fontSize: 17 * scale }]}>{featuredCourse.title}</Text>
            </View>

            <View style={[styles.progressRing, { width: ringSize, height: ringSize, borderRadius: ringSize / 2 }]}>
              <View style={[styles.progressRingCore, { width: ringCore, height: ringCore, borderRadius: ringCore / 2 }]}>
                <Text style={[styles.progressRingText, { fontSize: 12 * scale }]}>
                  {completedLessons}/{totalLessons}
                </Text>
              </View>
              <View
                style={[
                  styles.progressRingCap,
                  { top: 9 * scale, right: 14 * scale, width: 24 * scale, height: 10 * scale, borderRadius: 999 },
                ]}
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bannerContainer, { marginHorizontal: horizontal, marginTop: 22 * scale, borderRadius: cardRadius }]}
          activeOpacity={0.92}
          onPress={() => router.push({ pathname: '/assessment', params: { targetType: featuredTarget.type } })}>
          <LinearGradient
            colors={['#6f8fe3', '#21259a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ height: bannerHeight, paddingHorizontal: 20 * scale, paddingVertical: 18 * scale }}>
            <View style={styles.bannerLeft}>
              <Text style={[styles.bannerTitle, { fontSize: 22 * scale, lineHeight: 30 * scale, maxWidth: 160 * scale }]}>
                Bài đánh giá năng lực
              </Text>
              <View
                style={[
                  styles.bannerButton,
                  {
                    minWidth: 136 * scale,
                    borderRadius: 18 * scale,
                    paddingVertical: 14 * scale,
                    paddingHorizontal: 18 * scale,
                    marginTop: 18 * scale,
                  },
                ]}>
                <Text style={[styles.bannerButtonText, { fontSize: 16 * scale }]}>Test</Text>
              </View>
            </View>
            <Image
              source={require('../../assets/images/figma-assessment-art.png')}
              style={{ position: 'absolute', right: 16 * scale, bottom: 14 * scale, width: 118 * scale, height: 82 * scale }}
              resizeMode="contain"
            />
          </LinearGradient>
        </TouchableOpacity>

        <View style={[styles.sectionHeader, { marginHorizontal: horizontal, marginTop: 38 * scale }]}>
          <Text style={[styles.sectionTitle, { fontSize: 28 * scale }]}>Hành trình</Text>
          <TouchableOpacity onPress={() => router.push({ pathname: '/target-detail', params: { type: featuredTarget.type } })}>
            <Text style={[styles.sectionLink, { fontSize: 16 * scale }]}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.accordionHeader, { marginHorizontal: horizontal, marginTop: 18 * scale, borderRadius: cardRadius, paddingHorizontal: 18 * scale, paddingVertical: 18 * scale }]}
          activeOpacity={0.88}
          onPress={() => setExpanded((prev) => !prev)}>
          <View style={styles.accordionLeft}>
            <Image source={require('../../assets/images/figma-journey-course.png')} style={{ width: 38 * scale, height: 38 * scale }} resizeMode="contain" />
            <Text style={[styles.accordionTitle, { fontSize: 20 * scale }]}>Khóa học</Text>
          </View>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={24 * scale} color="#292d32" />
        </TouchableOpacity>

        {expanded ? (
          <View style={{ marginHorizontal: horizontal, marginTop: 16 * scale, gap: 16 * scale }}>
            {journeyLessons.map((lesson, index) => (
              <TouchableOpacity
                key={lesson.id}
                style={[styles.lessonCard, { borderRadius: cardRadius, paddingHorizontal: 18 * scale, paddingVertical: 18 * scale }]}
                activeOpacity={0.88}
                onPress={() => router.push({ pathname: '/lesson', params: { lessonId: lesson.id } })}>
                <View style={styles.lessonCardLeft}>
                  <Image
                    source={
                      index === 0
                        ? require('../../assets/images/figma-lesson-noun-types.png')
                        : require('../../assets/images/figma-level-test.png')
                    }
                    style={{ width: 38 * scale, height: 38 * scale }}
                    resizeMode="contain"
                  />

                  <View style={styles.lessonCopy}>
                    <Text style={[styles.lessonCardTitle, { fontSize: 18 * scale, marginBottom: 8 * scale }]}>{lesson.title}</Text>
                    <View style={[styles.lessonMetaRow, { gap: 6 * scale }]}>
                      <Ionicons name="shield-checkmark-outline" size={13 * scale} color="#a8a8a8" />
                      <Text style={[styles.lessonCardCaption, { fontSize: 13 * scale }]}>Loại từ</Text>
                      <Ionicons name="time-outline" size={13 * scale} color="#a8a8a8" />
                      <Text style={[styles.lessonCardCaption, { fontSize: 13 * scale }]}>{lesson.questionCount} câu hỏi</Text>
                    </View>
                  </View>
                </View>

                <Ionicons name="checkmark-circle" size={34 * scale} color="#08bd4e" />
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#faf8f8' },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#faf8f8' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  levelCapsule: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#ffffff' },
  levelText: { fontFamily: Fonts.bold, color: '#27ae60' },
  headerActions: { flexDirection: 'row', gap: 10 },
  iconButton: { backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  activeCard: { backgroundColor: '#ffffff' },
  activeLessonSection: { flexDirection: 'row', alignItems: 'center' },
  activeLessonCopy: { flex: 1 },
  activeTitle: { fontFamily: Fonts.bold, color: '#252525' },
  activeSubtitle: { fontFamily: Fonts.semiBold, color: '#9a8686' },
  divider: { height: 1, backgroundColor: '#e0dede' },
  courseRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { fontFamily: Fonts.semiBold, color: '#9a8686' },
  courseName: { fontFamily: Fonts.bold, color: '#252525' },
  progressRing: { backgroundColor: '#d7f8e5', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  progressRingCore: { backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  progressRingCap: { position: 'absolute', backgroundColor: '#1cb65d', transform: [{ rotate: '18deg' }] },
  progressRingText: { fontFamily: Fonts.bold, color: '#00bd50' },
  bannerContainer: { overflow: 'hidden' },
  bannerLeft: { flex: 1, justifyContent: 'center' },
  bannerTitle: { fontFamily: Fonts.bold, color: '#ffffff' },
  bannerButton: { alignSelf: 'flex-start', alignItems: 'center', backgroundColor: '#08bd4e' },
  bannerButtonText: { fontFamily: Fonts.bold, color: '#ffffff' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontFamily: Fonts.bold, color: '#080f05' },
  sectionLink: { fontFamily: Fonts.semiBold, color: '#8b88a5' },
  accordionHeader: { backgroundColor: '#ffffff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  accordionLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  accordionTitle: { fontFamily: Fonts.bold, color: '#000000' },
  lessonCard: { backgroundColor: '#ffffff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lessonCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  lessonCopy: { flex: 1 },
  lessonCardTitle: { fontFamily: Fonts.bold, color: '#000000' },
  lessonMetaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  lessonCardCaption: { fontFamily: Fonts.semiBold, color: '#a8a8a8' },
  errorText: { fontFamily: Fonts.medium, fontSize: 14, color: '#ea573f' },
});
