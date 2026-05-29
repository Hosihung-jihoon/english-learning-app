import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { CourseContent, LessonContent, TargetContent } from '../../../../shared/types';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';
import { getCourses, getLessons, getTargets } from '@/services/content-service';

export default function HomeScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const [expanded, setExpanded] = useState(true);
  const [targets, setTargets] = useState<TargetContent[]>([]);
  const [courses, setCourses] = useState<CourseContent[]>([]);
  const [lessons, setLessons] = useState<LessonContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
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
  const activeLesson = useMemo(() => lessons[1] ?? lessons[0], [lessons]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#27ae60" />
      </SafeAreaView>
    );
  }

  if (!featuredCourse || !featuredTarget) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <Text style={styles.errorText}>{error || 'Chưa có dữ liệu học tập.'}</Text>
      </SafeAreaView>
    );
  }

  const completedLessons = Math.round((featuredCourse.progressPercent / 100) * Math.max(lessons.length, 1));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <View style={styles.header}>
            <View style={styles.levelCapsule}>
              <MaterialCommunityIcons name="school-outline" size={18} color="#27ae60" />
              <Text style={styles.levelText}>{featuredTarget.title}</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Tìm kiếm' } } as never)}>
                <Ionicons name="search-outline" size={20} color="#292d32" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Thông báo' } } as never)}>
                <Ionicons name="notifications-outline" size={20} color="#292d32" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.activeCard}
            activeOpacity={0.92}
            onPress={() => router.push({ pathname: '/course', params: { courseId: featuredCourse.id } })}>
            <View style={styles.activeCardTop}>
              <View>
                <Text style={styles.eyebrow}>Khóa học</Text>
                <Text style={styles.activeTitle}>{featuredCourse.title}</Text>
              </View>
              <View style={styles.progressBadge}>
                <Text style={styles.progressBadgeText}>
                  {completedLessons}/{Math.max(lessons.length, 1)}
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
            {activeLesson ? (
              <View style={styles.lessonRow}>
                <View style={styles.lampWrap}>
                  <MaterialCommunityIcons name="lightbulb-on-outline" size={24} color="#ffa100" />
                </View>
                <View style={styles.lessonMeta}>
                  <Text style={styles.lessonName}>{activeLesson.title}</Text>
                  <Text style={styles.lessonSub}>
                    {activeLesson.label} • {activeLesson.duration}
                  </Text>
                </View>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.bannerContainer}
          activeOpacity={0.92}
          onPress={() => router.push({ pathname: '/assessment', params: { targetType: featuredTarget.type } })}>
          <LinearGradient colors={['#7e7bec', '#9b51e0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.banner}>
            <View style={styles.bannerLeft}>
              <Text style={styles.bannerTitle}>Bài đánh giá năng lực</Text>
              <View style={styles.bannerButton}>
                <Text style={styles.bannerButtonText}>Test</Text>
              </View>
            </View>
            <Image source={require('../../assets/images/menu_illustration.png')} style={styles.bannerImage} resizeMode="contain" />
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hành trình</Text>
          <TouchableOpacity onPress={() => router.push({ pathname: '/target', params: { type: featuredTarget.type } })}>
            <Text style={styles.sectionLink}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.accordionHeader} activeOpacity={0.85} onPress={() => setExpanded((prev) => !prev)}>
          <View style={styles.accordionLeft}>
            <MaterialCommunityIcons name="book-open-variant" size={22} color="#1954eb" />
            <Text style={styles.accordionTitle}>Khóa học</Text>
          </View>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color="#292d32" />
        </TouchableOpacity>

        {expanded && (
          <View style={styles.lessonList}>
            {lessons.map((lesson, index) => (
              <TouchableOpacity
                key={lesson.id}
                style={styles.lessonCard}
                activeOpacity={0.85}
                onPress={() => router.push({ pathname: '/lesson', params: { lessonId: lesson.id } })}>
                <View style={styles.lessonCardLeft}>
                  <View style={styles.lessonIconBubble}>
                    <Ionicons
                      name={index === lessons.length - 1 ? 'trophy-outline' : 'document-text-outline'}
                      size={20}
                      color={index === lessons.length - 1 ? '#ffa100' : '#7e7bec'}
                    />
                  </View>
                  <View>
                    <Text style={styles.lessonCardTitle}>{lesson.title}</Text>
                    <Text style={styles.lessonCardCaption}>
                      {lesson.label} • {lesson.duration}
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={index < completedLessons ? '#00bd50' : '#d7d7dc'}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#27ae60' },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#faf8f8' },
  scrollContent: { paddingBottom: 32, backgroundColor: '#faf8f8' },
  hero: {
    backgroundColor: '#27ae60',
    paddingBottom: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  levelCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  levelText: { fontFamily: Fonts.semiBold, fontSize: 14, color: '#27ae60' },
  headerActions: { flexDirection: 'row', gap: 12 },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeCard: {
    marginHorizontal: 24,
    marginTop: 20,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
  },
  activeCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eyebrow: { fontFamily: Fonts.medium, fontSize: 12, color: '#8d7979', marginBottom: 4 },
  activeTitle: { fontFamily: Fonts.bold, fontSize: 22, color: '#252525' },
  progressBadge: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 4,
    borderColor: '#e0fdec',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBadgeText: { fontFamily: Fonts.semiBold, fontSize: 12, color: '#00bd50' },
  divider: { height: 1, backgroundColor: '#e0dede', marginVertical: 14 },
  lessonRow: { flexDirection: 'row', alignItems: 'center' },
  lampWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff9e6',
  },
  lessonMeta: { marginLeft: 12, flex: 1 },
  lessonName: { fontFamily: Fonts.semiBold, fontSize: 16, color: '#252525' },
  lessonSub: { fontFamily: Fonts.medium, fontSize: 12, color: '#8d7979', marginTop: 2 },
  bannerContainer: { marginHorizontal: 24, marginTop: 24, borderRadius: 16, overflow: 'hidden' },
  banner: { height: 120, padding: 18, position: 'relative' },
  bannerLeft: { flex: 1, justifyContent: 'center' },
  bannerTitle: { fontFamily: Fonts.bold, fontSize: 18, color: '#ffffff', maxWidth: '64%' },
  bannerButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#00b94e',
    borderRadius: 13,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginTop: 12,
  },
  bannerButtonText: { fontFamily: Fonts.semiBold, fontSize: 14, color: '#ffffff' },
  bannerImage: { position: 'absolute', right: 18, bottom: 12, width: 124, height: 90 },
  sectionHeader: {
    marginHorizontal: 24,
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { fontFamily: Fonts.bold, fontSize: 20, color: '#080f05' },
  sectionLink: { fontFamily: Fonts.medium, fontSize: 14, color: '#807e94' },
  accordionHeader: {
    marginHorizontal: 24,
    marginTop: 16,
    backgroundColor: '#ffffff',
    borderRadius: 19,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accordionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  accordionTitle: { fontFamily: Fonts.bold, fontSize: 16, color: '#000000' },
  lessonList: { marginHorizontal: 24, marginTop: 8 },
  lessonCard: {
    marginTop: 12,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  lessonIconBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f0ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonCardTitle: { fontFamily: Fonts.bold, fontSize: 15, color: '#000000' },
  lessonCardCaption: { fontFamily: Fonts.medium, fontSize: 12, color: '#a8a8a8', marginTop: 4 },
  errorText: { fontFamily: Fonts.medium, fontSize: 14, color: '#ea573f' },
});
