import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { ProfileSummary } from '../../../../shared/types';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';
import { getProfile } from '@/services/content-service';

const progressCardAsset = require('../../assets/images/figma-profile-progress-card-full.png');
const streakCardAsset = require('../../assets/images/figma-profile-streak-full.png');

type SegmentKey = 'progress' | 'achievements';

function getDisplayScore(profile: ProfileSummary) {
  const numeric = Number.parseFloat(profile.user.scoreLabel);

  if (Number.isFinite(numeric)) {
    return numeric.toFixed(1);
  }

  return '7.8';
}

export default function ProfileScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const tabBarHeight = useBottomTabBarHeight();
  const { token, signOut } = useAuth();
  const [activeSegment, setActiveSegment] = useState<SegmentKey>('progress');
  const [profile, setProfile] = useState<ProfileSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const [showProfileInfo, setShowProfileInfo] = useState(false);

  useEffect(() => {
    setProfile(null);
    setError(null);
    setSignOutError(null);
    setShowProfileInfo(false);
    setActiveSegment('progress');

    if (!token) {
      setLoading(false);
      setError('Phiên đăng nhập đã hết hạn.');
      return;
    }

    setLoading(true);
    let mounted = true;

    getProfile(token)
      .then((data) => {
        if (mounted) {
          setProfile(data);
        }
      })
      .catch((loadError) => {
        if (mounted) {
          setError(loadError instanceof Error ? loadError.message : 'Không tải được hồ sơ');
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

  const scale = Math.min(width / 375, 1) * 0.84;
  const horizontal = 17 * scale;
  const displayScore = useMemo(() => (profile ? getDisplayScore(profile) : '7.8'), [profile]);
  const summaryCards = useMemo(() => {
    if (!profile) {
      return [];
    }

    return [
      {
        key: 'challenges',
        icon: 'rocket-outline' as const,
        value: Math.max(profile.progress.streakDays * 12 + profile.progress.lessonsCompleted, 12),
        label: 'Thử thách',
      },
      {
        key: 'lessons',
        icon: 'folder-open-outline' as const,
        value: Math.max(profile.progress.lessonsCompleted * 8 + profile.progress.coursesStarted, 24),
        label: 'Bài học',
      },
    ];
  }, [profile]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={['top']}>
        <ActivityIndicator size="large" color="#00bd50" />
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={['top']}>
        <Text style={styles.errorText}>{error || 'Không tải được hồ sơ.'}</Text>
      </SafeAreaView>
    );
  }

  const contentWidth = width - horizontal * 2;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + 22 * scale, backgroundColor: '#f6f7f8' }]}>
        <View style={[styles.heroCard, { paddingHorizontal: 22 * scale, paddingTop: 14 * scale, paddingBottom: 16 * scale }]}>
          <View style={[styles.heroTopRow, { marginTop: 6 * scale }]}>
            <View style={styles.userColumn}>
              <View style={[styles.avatarWrap, { width: 56 * scale, height: 56 * scale, marginBottom: 11 * scale }]}>
                <Image
                  source={{
                    uri: profile.user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop',
                  }}
                  style={[styles.avatar, { width: 56 * scale, height: 56 * scale, borderRadius: 28 * scale }]}
                />
                <View style={[styles.verifiedBadge, { top: -3 * scale, right: -3 * scale, width: 18 * scale, height: 18 * scale, borderRadius: 9 * scale }]}>
                  <Ionicons name="checkmark" size={10 * scale} color="#ffffff" />
                </View>
              </View>

              <Text style={[styles.userName, { fontSize: 21 * scale, lineHeight: 25 * scale }]} numberOfLines={1}>
                {profile.user.name}
              </Text>
              <Text style={[styles.userPlan, { fontSize: 11 * scale, marginTop: 5 * scale }]}>{profile.user.planLabel || 'Tài khoản miễn phí'}</Text>
            </View>

            <View style={styles.scoreColumn}>
              <View style={[styles.scoreRing, { width: 82 * scale, height: 82 * scale, borderRadius: 41 * scale }]}>
                <View style={[styles.scoreRingCore, { width: 62 * scale, height: 62 * scale, borderRadius: 31 * scale }]}>
                  <Text style={[styles.scoreValue, { fontSize: 24 * scale }]}>{displayScore}</Text>
                </View>
              </View>
              <Text style={[styles.scoreLabel, { marginTop: 7 * scale, fontSize: 12 * scale }]}>Điểm</Text>
            </View>
          </View>

          <View style={[styles.heroActionsRow, { marginTop: 14 * scale, gap: 12 * scale }]}>
            <TouchableOpacity activeOpacity={0.88} style={[styles.heroActionLight, { borderRadius: 24 * scale, height: 46 * scale }]} onPress={() => setShowProfileInfo((current) => !current)}>
              <Text style={[styles.heroActionLightText, { fontSize: 13 * scale }]}>Hồ sơ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.88}
              style={[styles.heroActionPrimary, { borderRadius: 24 * scale, height: 46 * scale }]}
              onPress={async () => {
                try {
                  await Share.share({
                    message: `Mình đang học trên JHUDABEO với mục tiêu ${profile.user.planLabel || 'học tiếng Anh mỗi ngày'}.`,
                  });
                } catch {
                  // no-op
                }
              }}>
              <Text style={[styles.heroActionPrimaryText, { fontSize: 13 * scale }]}>Chia sẻ</Text>
            </TouchableOpacity>
          </View>

          {showProfileInfo ? (
            <View style={[styles.inlineInfoCard, { marginTop: 12 * scale, borderRadius: 16 * scale, padding: 15 * scale }]}>
              <Text style={[styles.inlineInfoTitle, { fontSize: 14 * scale }]}>Hồ sơ</Text>
              <Text style={[styles.inlineInfoText, { marginTop: 6 * scale, fontSize: 12 * scale, lineHeight: 19 * scale }]}>
                Theo dõi điểm số, tiến trình học, streak và thành tựu của bạn tại đây. Dữ liệu được lấy trực tiếp từ hồ sơ hiện tại.
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.segmentRow}>
          <TouchableOpacity style={[styles.segmentItem, activeSegment === 'progress' && styles.segmentItemActive]} onPress={() => setActiveSegment('progress')}>
            <Text style={[styles.segmentText, activeSegment === 'progress' && styles.segmentTextActive]}>Tiến trình</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.segmentItem, activeSegment === 'achievements' && styles.segmentItemActive]} onPress={() => setActiveSegment('achievements')}>
            <Text style={[styles.segmentText, activeSegment === 'achievements' && styles.segmentTextActive]}>Thành tựu</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.summaryRow, { paddingHorizontal: horizontal, marginTop: 22 * scale, gap: 12 * scale }]}>
          {summaryCards.map((item) => (
            <View key={item.key} style={[styles.summaryCard, { borderRadius: 17 * scale, minHeight: 72 * scale, paddingHorizontal: 16 * scale }]}>
              <Ionicons name={item.icon} size={20 * scale} color="#12162f" />
              <View style={[styles.summaryTextBlock, { marginLeft: 10 * scale }]}>
                <Text style={[styles.summaryValue, { fontSize: 13 * scale }]}>{item.value}</Text>
                <Text style={[styles.summaryLabel, { fontSize: 11 * scale, marginTop: 4 * scale }]}>{item.label}</Text>
              </View>
            </View>
          ))}
        </View>

        {activeSegment === 'progress' ? (
          <View style={{ paddingHorizontal: horizontal }}>
            <Text style={[styles.sectionTitle, { marginTop: 28 * scale, marginBottom: 14 * scale, fontSize: 24 * scale }]}>Tiến trình</Text>

            <Image source={progressCardAsset} style={[styles.figureCard, { width: contentWidth, height: (contentWidth * 474.3848876953125) / 327 }]} resizeMode="contain" />

            <Image source={streakCardAsset} style={[styles.figureCard, { width: contentWidth, height: (contentWidth * 234) / 327, marginTop: 18 * scale }]} resizeMode="contain" />
          </View>
        ) : (
          <View style={{ paddingHorizontal: horizontal, marginTop: 22 * scale, gap: 12 * scale }}>
            {profile.achievements.map((achievement) => (
              <View key={achievement.id} style={[styles.achievementCard, { borderRadius: 17 * scale, padding: 16 * scale }]}>
                <View style={[styles.achievementIcon, { width: 42 * scale, height: 42 * scale, borderRadius: 13 * scale, marginRight: 12 * scale, backgroundColor: achievement.unlocked ? achievement.color : '#dadada' }]}>
                  <Ionicons name={achievement.icon as never} size={19 * scale} color="#ffffff" />
                </View>
                <View style={styles.achievementBody}>
                  <View style={[styles.achievementHeader, { marginBottom: 4 * scale, gap: 8 * scale }]}>
                    <Text style={[styles.achievementTitle, { fontSize: 14 * scale }]}>{achievement.title}</Text>
                    <Text style={[styles.achievementLevel, { fontSize: 10 * scale }]}>{achievement.level}</Text>
                  </View>
                  <Text style={[styles.achievementDescription, { fontSize: 12 * scale, lineHeight: 17 * scale }]}>{achievement.description}</Text>
                </View>
              </View>
            ))}

            <TouchableOpacity style={[styles.certificateButton, { borderRadius: 17 * scale, paddingVertical: 14 * scale }]} onPress={() => router.push('/certificate')}>
              <Text style={[styles.certificateButtonText, { fontSize: 15 * scale }]}>Xem chứng nhận</Text>
            </TouchableOpacity>
          </View>
        )}

        {signOutError ? (
          <Text style={[styles.signOutErrorText, { marginTop: 16 * scale, fontSize: 13 * scale }]}>{signOutError}</Text>
        ) : null}

        <TouchableOpacity
          style={[styles.signOutButton, { marginTop: signOutError ? 12 * scale : 20 * scale }, signingOut && styles.signOutButtonDisabled]}
          disabled={signingOut}
          onPress={async () => {
            if (signingOut) {
              return;
            }

            setSigningOut(true);
            setSignOutError(null);

            try {
              await signOut();
              router.replace('/(auth)/sign-in');
            } catch (signOutValue) {
              setSignOutError(signOutValue instanceof Error ? signOutValue.message : 'Không đăng xuất được lúc này.');
            } finally {
              setSigningOut(false);
            }
          }}>
          <Text style={[styles.signOutText, { fontSize: 13 * scale }]}>{signingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f7f8',
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f7f8',
  },
  errorText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: '#ea573f',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  scrollContent: {},
  heroCard: {
    backgroundColor: '#ffffff',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userColumn: {
    flex: 1,
    paddingRight: 12,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    backgroundColor: '#e7e9ee',
  },
  verifiedBadge: {
    position: 'absolute',
    backgroundColor: '#7ed1e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontFamily: Fonts.bold,
    color: '#221e2e',
  },
  userPlan: {
    fontFamily: Fonts.semiBold,
    color: 'rgba(55,55,55,0.7)',
  },
  scoreColumn: {
    alignItems: 'center',
  },
  scoreRing: {
    backgroundColor: '#b9c0ee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreRingCore: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreValue: {
    fontFamily: Fonts.bold,
    color: '#3e57fe',
  },
  scoreLabel: {
    fontFamily: Fonts.medium,
    color: '#3e57fe',
  },
  heroActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroActionLight: {
    flex: 1,
    backgroundColor: '#e8fae6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroActionPrimary: {
    flex: 1,
    backgroundColor: '#55ba5d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroActionLightText: {
    fontFamily: Fonts.medium,
    color: '#55ba5d',
  },
  heroActionPrimaryText: {
    fontFamily: Fonts.medium,
    color: '#ffffff',
  },
  inlineInfoCard: {
    backgroundColor: '#f6f7f8',
  },
  inlineInfoTitle: {
    fontFamily: Fonts.bold,
    color: '#221e2e',
  },
  inlineInfoText: {
    fontFamily: Fonts.regular,
    color: '#666272',
  },
  segmentRow: {
    flexDirection: 'row',
    backgroundColor: '#f6f7f8',
  },
  segmentItem: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1.5,
    borderBottomColor: 'transparent',
  },
  segmentItemActive: {
    borderBottomColor: '#55ba5d',
  },
  segmentText: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: '#bababa',
  },
  segmentTextActive: {
    fontFamily: Fonts.semiBold,
    color: '#55ba5d',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryTextBlock: {},
  summaryValue: {
    fontFamily: Fonts.semiBold,
    color: '#000000',
    lineHeight: 19,
  },
  summaryLabel: {
    fontFamily: Fonts.medium,
    color: '#000000',
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    color: '#221e2e',
  },
  figureCard: {
    alignSelf: 'center',
  },
  achievementCard: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementBody: {
    flex: 1,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  achievementTitle: {
    flex: 1,
    fontFamily: Fonts.bold,
    color: '#11102a',
  },
  achievementLevel: {
    fontFamily: Fonts.semiBold,
    color: '#55ba5d',
  },
  achievementDescription: {
    fontFamily: Fonts.medium,
    color: '#767676',
  },
  certificateButton: {
    backgroundColor: '#55ba5d',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  certificateButtonText: {
    fontFamily: Fonts.bold,
    color: '#ffffff',
  },
  signOutButton: {
    alignSelf: 'center',
  },
  signOutButtonDisabled: {
    opacity: 0.6,
  },
  signOutErrorText: {
    fontFamily: Fonts.medium,
    color: '#ea573f',
    textAlign: 'center',
  },
  signOutText: {
    fontFamily: Fonts.medium,
    color: '#767676',
  },
});
