import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { ProfileSummary } from '../../../../shared/types';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';
import { getProfile } from '@/services/content-service';

export default function ProfileScreen() {
  const router = useRouter();
  const { token, signOut } = useAuth();
  const [activeSegment, setActiveSegment] = useState<'progress' | 'achievements'>('progress');
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
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.userCard}>
            <View style={styles.userInfoRow}>
              <Image
                source={{
                  uri:
                    profile.user.avatarUrl ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop',
                }}
                style={styles.avatar}
              />
              <View style={styles.userMeta}>
                <Text style={styles.userName}>{profile.user.name}</Text>
                <Text style={styles.userPlan}>{profile.user.planLabel}</Text>
              </View>
              <View style={styles.pointsBadge}>
                <Ionicons name="star" size={16} color="#fda085" />
                <Text style={styles.pointsText}>{profile.user.scoreLabel}</Text>
              </View>
            </View>
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Hồ sơ' } } as never)}>
                <Ionicons name="person-outline" size={18} color="#00bd50" />
                <Text style={styles.actionButtonText}>Hồ sơ</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => signOut().then(() => router.replace('/(auth)/sign-in'))}>
                <Ionicons name="log-out-outline" size={18} color="#00bd50" />
                <Text style={styles.actionButtonText}>Đăng xuất</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.segmentContainer}>
            <TouchableOpacity style={[styles.segmentItem, activeSegment === 'progress' && styles.segmentItemActive]} onPress={() => setActiveSegment('progress')}>
              <Text style={[styles.segmentText, activeSegment === 'progress' && styles.segmentTextActive]}>Tiến trình</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.segmentItem, activeSegment === 'achievements' && styles.segmentItemActive]} onPress={() => setActiveSegment('achievements')}>
              <Text style={[styles.segmentText, activeSegment === 'achievements' && styles.segmentTextActive]}>Thành tựu</Text>
            </TouchableOpacity>
          </View>

          {activeSegment === 'progress' ? (
            <View style={styles.progressStack}>
              <LinearGradient colors={['#7e7bec', '#9b51e0']} style={styles.streakCard}>
                <View style={styles.streakTextWrap}>
                  <Text style={styles.streakTitle}>Đã đến lúc bắt đầu Streak!</Text>
                  <Text style={styles.streakDescription}>
                    Hiện tại bạn đang có {profile.progress.streakDays} ngày streak và {profile.progress.totalXp} XP tích lũy.
                  </Text>
                </View>
                <MaterialCommunityIcons name="fire" size={48} color="#ffffff" />
              </LinearGradient>

              <View style={styles.summaryRow}>
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryNumber}>{profile.progress.coursesStarted}</Text>
                  <Text style={styles.summaryLabel}>Khóa học</Text>
                </View>
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryNumber}>{profile.progress.lessonsCompleted}</Text>
                  <Text style={styles.summaryLabel}>Bài học</Text>
                </View>
              </View>

              <View style={styles.skillsCard}>
                <Text style={styles.skillsTitle}>Kỹ năng ngôn ngữ</Text>
                {profile.metrics.map((metric) => (
                  <View key={metric.name} style={styles.skillRow}>
                    <View style={styles.skillHeader}>
                      <Text style={styles.skillName}>{metric.name}</Text>
                      <Text style={styles.skillValue}>{metric.value}%</Text>
                    </View>
                    <View style={styles.skillTrack}>
                      <View style={[styles.skillFill, { width: `${metric.value}%`, backgroundColor: metric.color }]} />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.sectionTitle}>Giấy chứng nhận</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.certificateList}>
                <TouchableOpacity style={styles.certificateCard} onPress={() => router.push('/certificate')}>
                  <LinearGradient colors={['#e6f9ff', '#cbefff']} style={styles.certificateGradient}>
                    <Ionicons name="ribbon" size={40} color="#00bd50" />
                    <View style={styles.certificateBody}>
                      <Text style={styles.certificateTitle}>
                        {profile.certificates.some((certificate) => certificate.unlocked)
                          ? 'Xem chứng nhận đã mở khóa'
                          : 'Mở khóa chứng chỉ hoàn thành của bạn'}
                      </Text>
                      <Text style={styles.certificateSubtitle}>Unlock your certificate of completion</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </ScrollView>

              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Achievements</Text>
              <View style={styles.achievementList}>
                {profile.achievements.map((achievement) => (
                  <View key={achievement.id} style={styles.achievementCard}>
                    <View style={[styles.achievementIcon, { backgroundColor: achievement.color, opacity: achievement.unlocked ? 1 : 0.5 }]}>
                      <Ionicons name={achievement.icon as never} size={24} color="#ffffff" />
                    </View>
                    <View style={styles.achievementBody}>
                      <View style={styles.achievementHeader}>
                        <Text style={styles.achievementTitle}>{achievement.title}</Text>
                        <Text style={styles.achievementLevel}>{achievement.level}</Text>
                      </View>
                      <Text style={styles.achievementDescription}>{achievement.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#faf8f8' },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#faf8f8' },
  container: { flex: 1, backgroundColor: '#faf8f8' },
  scrollContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 },
  userCard: { backgroundColor: '#ffffff', borderRadius: 24, padding: 20, marginBottom: 24 },
  userInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 64, height: 64, borderRadius: 32, marginRight: 16 },
  userMeta: { flex: 1 },
  userName: { fontFamily: Fonts.bold, fontSize: 20, color: '#050018', marginBottom: 4 },
  userPlan: { fontFamily: Fonts.medium, fontSize: 12, color: '#929292' },
  pointsBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fdf4f2', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 },
  pointsText: { fontFamily: Fonts.semiBold, fontSize: 12, color: '#fda085' },
  actionsRow: { flexDirection: 'row', gap: 12 },
  actionButton: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, backgroundColor: '#f2faf4', borderRadius: 14, paddingVertical: 12 },
  actionButtonText: { fontFamily: Fonts.semiBold, fontSize: 14, color: '#00bd50' },
  segmentContainer: { flexDirection: 'row', backgroundColor: '#f2f0f0', borderRadius: 14, padding: 4, marginBottom: 24 },
  segmentItem: { flex: 1, alignItems: 'center', borderRadius: 10, paddingVertical: 10 },
  segmentItemActive: { backgroundColor: '#ffffff' },
  segmentText: { fontFamily: Fonts.medium, fontSize: 14, color: '#6c5f80' },
  segmentTextActive: { fontFamily: Fonts.semiBold, color: '#050018' },
  progressStack: { gap: 16 },
  streakCard: { borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center' },
  streakTextWrap: { flex: 1, marginRight: 16 },
  streakTitle: { fontFamily: Fonts.bold, fontSize: 18, color: '#ffffff', marginBottom: 6 },
  streakDescription: { fontFamily: Fonts.regular, fontSize: 12, lineHeight: 18, color: 'rgba(255,255,255,0.84)' },
  summaryRow: { flexDirection: 'row', gap: 16 },
  summaryCard: { flex: 1, backgroundColor: '#ffffff', borderRadius: 20, padding: 16, alignItems: 'center' },
  summaryNumber: { fontFamily: Fonts.bold, fontSize: 24, color: '#050018', marginBottom: 4 },
  summaryLabel: { fontFamily: Fonts.medium, fontSize: 12, color: '#929292' },
  skillsCard: { backgroundColor: '#ffffff', borderRadius: 24, padding: 20 },
  skillsTitle: { fontFamily: Fonts.bold, fontSize: 16, color: '#050018', marginBottom: 20 },
  skillRow: { marginBottom: 16 },
  skillHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  skillName: { fontFamily: Fonts.medium, fontSize: 14, color: '#373346' },
  skillValue: { fontFamily: Fonts.semiBold, fontSize: 14, color: '#050018' },
  skillTrack: { height: 8, borderRadius: 4, backgroundColor: '#f2f0f0', overflow: 'hidden' },
  skillFill: { height: '100%', borderRadius: 4 },
  sectionTitle: { fontFamily: Fonts.bold, fontSize: 18, color: '#050018', marginBottom: 16 },
  certificateList: { gap: 16 },
  certificateCard: { width: Dimensions.get('window').width - 48, borderRadius: 24, overflow: 'hidden' },
  certificateGradient: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  certificateBody: { flex: 1, marginLeft: 16 },
  certificateTitle: { fontFamily: Fonts.bold, fontSize: 15, color: '#050018', lineHeight: 20, marginBottom: 4 },
  certificateSubtitle: { fontFamily: Fonts.regular, fontSize: 12, color: '#6c5f80' },
  achievementList: { gap: 12 },
  achievementCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center' },
  achievementIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  achievementBody: { flex: 1 },
  achievementHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  achievementTitle: { fontFamily: Fonts.bold, fontSize: 15, color: '#050018' },
  achievementLevel: { fontFamily: Fonts.bold, fontSize: 10, color: '#fda085', backgroundColor: '#fdf4f2', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  achievementDescription: { fontFamily: Fonts.medium, fontSize: 12, color: '#929292' },
});
