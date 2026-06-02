import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { CollectionSummary, Flashcard } from '../../../../shared/types';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';
import { getCollection, getCollectionFlashcards, getCollections } from '@/services/content-service';

const collectionPreviewAssets = [
  require('../../assets/images/figma-collection-card-toeic.png'),
  require('../../assets/images/figma-collection-card-basic-talk.png'),
  require('../../assets/images/figma-collection-card-basic-talk.png'),
];

export default function CollectionScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const tabBarHeight = useBottomTabBarHeight();
  const { token } = useAuth();
  const { collectionId, mode } = useLocalSearchParams<{ collectionId?: string; mode?: string }>();
  const normalizedCollectionId = typeof collectionId === 'string' && collectionId.length > 0 ? collectionId : undefined;
  const normalizedMode = typeof mode === 'string' && mode.length > 0 ? mode : undefined;
  const [collections, setCollections] = useState<CollectionSummary[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<CollectionSummary | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studyIndex, setStudyIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);

  useEffect(() => {
    setCollections([]);
    setSelectedCollection(null);
    setFlashcards([]);
    setError(null);
    setStudyIndex(0);
    setShowMeaning(false);

    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const accessToken = token;
    const selectedCollectionId = normalizedCollectionId;
    let mounted = true;

    async function load() {
      try {
        const collectionList = await getCollections(accessToken);
        if (!mounted) {
          return;
        }

        setCollections(collectionList);

        if (selectedCollectionId) {
          const [detail, items] = await Promise.all([getCollection(accessToken, selectedCollectionId), getCollectionFlashcards(accessToken, selectedCollectionId)]);

          if (!mounted) {
            return;
          }

          setSelectedCollection(detail);
          setFlashcards(items);
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError instanceof Error ? loadError.message : 'Không tải được thư viện ôn tập.');
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
  }, [normalizedCollectionId, token]);

  const scale = Math.min(width / 375, 1) * 0.84;
  const horizontal = 20 * scale;
  const firstCollection = useMemo(() => collections[0], [collections]);
  const currentFlashcard = flashcards[studyIndex];
  const progressText = `${studyIndex + 1}/${Math.max(flashcards.length, 1)}`;

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={['top']}>
        <ActivityIndicator size="large" color="#55ba5d" />
      </SafeAreaView>
    );
  }

  if (error && !selectedCollection && (collections.length === 0 || normalizedCollectionId)) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={['top']}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  if (normalizedCollectionId && !selectedCollection && !loading) {
    return <Redirect href="/(tabs)/collection" />;
  }

  if (normalizedCollectionId && normalizedMode === 'study' && selectedCollection && currentFlashcard) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={[styles.detailHeader, { paddingHorizontal: horizontal, paddingTop: 12 * scale }]}>
          <TouchableOpacity style={[styles.iconButton, { width: 40 * scale, height: 40 * scale, borderRadius: 20 * scale }]} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={21 * scale} color="#11102a" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontSize: 18 * scale }]}>Học bộ thẻ</Text>
          <View style={{ width: 40 * scale }} />
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: horizontal, paddingTop: 14 * scale, paddingBottom: tabBarHeight + 18 * scale }} showsVerticalScrollIndicator={false}>
          <View style={[styles.studyHero, { borderRadius: 26 * scale, paddingHorizontal: 20 * scale, paddingTop: 20 * scale, paddingBottom: 20 * scale }]}>
            <Text style={[styles.studyHeroTitle, { fontSize: 21 * scale }]}>{selectedCollection.title}</Text>
            <Text style={[styles.studyHeroSubtitle, { fontSize: 13 * scale, lineHeight: 20 * scale, marginTop: 8 * scale }]}>
              {selectedCollection.subtitle} {'\u2022'} {flashcards.length} flashcard
            </Text>

            <View style={[styles.studyProgressRow, { marginTop: 14 * scale }]}>
              <Text style={[styles.studyProgressText, { fontSize: 12 * scale }]}>{progressText}</Text>
              <View style={[styles.studyTrack, { height: 8 * scale, borderRadius: 999 }]}>
                <View
                  style={[
                    styles.studyTrackFill,
                    {
                      width: `${((studyIndex + 1) / Math.max(flashcards.length, 1)) * 100}%`,
                      borderRadius: 999,
                    },
                  ]}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.92}
            style={[styles.studyCard, { borderRadius: 26 * scale, minHeight: 304 * scale, paddingHorizontal: 22 * scale, paddingVertical: 24 * scale, marginTop: 18 * scale }]}
            onPress={() => setShowMeaning((prev) => !prev)}>
            <View style={[styles.studyChip, { borderRadius: 14 * scale, paddingHorizontal: 13 * scale, paddingVertical: 7 * scale }]}>
              <Text style={[styles.studyChipText, { fontSize: 12 * scale }]}>{showMeaning ? 'Mặt sau' : 'Mặt trước'}</Text>
            </View>

            <View style={styles.studyCardCenter}>
              <Text style={[styles.studyWord, { fontSize: 25 * scale, lineHeight: 33 * scale }]}>{currentFlashcard.word}</Text>
              <Text style={[styles.studyMeaning, { fontSize: 15 * scale, lineHeight: 22 * scale, marginTop: 14 * scale }]}>
                {showMeaning ? currentFlashcard.meaning : 'Nhấn để lật thẻ'}
              </Text>

              {showMeaning && currentFlashcard.example ? (
                <View style={[styles.exampleBox, { borderRadius: 16 * scale, paddingHorizontal: 15 * scale, paddingVertical: 15 * scale, marginTop: 16 * scale }]}>
                  <Text style={[styles.exampleEnglish, { fontSize: 13 * scale, lineHeight: 19 * scale }]}>{currentFlashcard.example.english}</Text>
                  <Text style={[styles.exampleVietnamese, { fontSize: 12 * scale, lineHeight: 18 * scale, marginTop: 8 * scale }]}>
                    {currentFlashcard.example.vietnamese}
                  </Text>
                </View>
              ) : null}
            </View>
          </TouchableOpacity>

          <View style={[styles.studyActions, { gap: 12 * scale, marginTop: 20 * scale }]}>
            <TouchableOpacity
              style={[styles.secondaryAction, { borderRadius: 24 * scale, height: 48 * scale }, studyIndex === 0 && styles.disabledButton]}
              disabled={studyIndex === 0}
              onPress={() => {
                setStudyIndex((prev) => prev - 1);
                setShowMeaning(false);
              }}>
              <Text style={[styles.secondaryActionText, { fontSize: 14 * scale }]}>Thẻ trước</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryAction, { borderRadius: 24 * scale, height: 48 * scale }]}
              onPress={() => {
                if (studyIndex === flashcards.length - 1) {
                  router.replace('/(tabs)/collection');
                  return;
                }

                setStudyIndex((prev) => prev + 1);
                setShowMeaning(false);
              }}>
              <Text style={[styles.primaryActionText, { fontSize: 14 * scale }]}>{studyIndex === flashcards.length - 1 ? 'Hoàn tất' : 'Thẻ tiếp'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (normalizedCollectionId && selectedCollection) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={[styles.detailHeader, { paddingHorizontal: horizontal, paddingTop: 12 * scale }]}>
          <TouchableOpacity style={[styles.iconButton, { width: 40 * scale, height: 40 * scale, borderRadius: 20 * scale }]} onPress={() => router.replace('/(tabs)/collection')}>
            <Ionicons name="chevron-back" size={21 * scale} color="#11102a" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontSize: 18 * scale }]}>Flashcards</Text>
          <TouchableOpacity
            style={[styles.iconButton, { width: 40 * scale, height: 40 * scale, borderRadius: 20 * scale }]}
            onPress={() => router.push({ pathname: '/collection-builder', params: { collectionId: selectedCollection.id } })}>
            <Ionicons name="add" size={21 * scale} color="#11102a" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: horizontal, paddingTop: 14 * scale, paddingBottom: tabBarHeight + 18 * scale }}>
          <View
            style={[
              styles.detailHero,
              {
                borderRadius: 26 * scale,
                paddingHorizontal: 20 * scale,
                paddingTop: 20 * scale,
                paddingBottom: 20 * scale,
                backgroundColor: selectedCollection.softColor,
              },
            ]}>
            <View style={[styles.detailIcon, { width: 50 * scale, height: 50 * scale, borderRadius: 16 * scale, backgroundColor: selectedCollection.accentColor }]}>
              <Ionicons name={selectedCollection.icon as never} size={22 * scale} color="#ffffff" />
            </View>
            <Text style={[styles.detailTitle, { fontSize: 22 * scale, marginTop: 12 * scale }]}>{selectedCollection.title}</Text>
            <Text style={[styles.detailSubtitle, { fontSize: 13 * scale, lineHeight: 20 * scale, marginTop: 8 * scale }]}>{selectedCollection.subtitle}</Text>

            <View style={[styles.wordPreviewCard, { borderRadius: 18 * scale, paddingHorizontal: 18 * scale, paddingVertical: 16 * scale, marginTop: 16 * scale }]}>
              <Text style={[styles.wordPreviewTitle, { fontSize: 20 * scale }]}>{selectedCollection.previewWord}</Text>
              <Text style={[styles.wordPreviewSubtitle, { fontSize: 13 * scale, marginTop: 6 * scale }]}>{selectedCollection.previewMeaning}</Text>
            </View>
          </View>

          <View style={[styles.detailActions, { gap: 12 * scale, marginTop: 18 * scale }]}>
            <TouchableOpacity
              style={[styles.primaryAction, { borderRadius: 24 * scale, height: 48 * scale }]}
              onPress={() => router.push({ pathname: '/(tabs)/collection', params: { collectionId: selectedCollection.id, mode: 'study' } })}>
              <Text style={[styles.primaryActionText, { fontSize: 14 * scale }]}>Học bộ thẻ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.secondaryAction, { borderRadius: 24 * scale, height: 48 * scale }]}
              onPress={() => router.push({ pathname: '/collection-builder', params: { collectionId: selectedCollection.id } })}>
              <Text style={[styles.secondaryActionText, { fontSize: 14 * scale }]}>Tạo flashcard</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.previewSectionTitle, { fontSize: 19 * scale, marginTop: 24 * scale }]}>Preview</Text>
          <View style={{ gap: 11 * scale, marginTop: 12 * scale }}>
            {flashcards.map((item) => (
              <View key={item.id} style={[styles.previewListItem, { borderRadius: 16 * scale, paddingHorizontal: 16 * scale, paddingVertical: 15 * scale }]}>
                <Text style={[styles.previewListTitle, { fontSize: 15 * scale }]}>{item.word}</Text>
                <Text style={[styles.previewListSubtitle, { fontSize: 12 * scale, marginTop: 6 * scale }]}>{item.meaning}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + 24 * scale }]}>
        <View style={[styles.header, { paddingHorizontal: horizontal, paddingTop: 12 * scale, paddingBottom: 6 * scale }]}>
          <Text style={[styles.screenTitle, { fontSize: 22 * scale }]}>Thư viện ôn tập</Text>
        </View>

        {error ? (
          <View style={[styles.inlineErrorCard, { marginHorizontal: horizontal, marginTop: 12 * scale, borderRadius: 18 * scale, paddingHorizontal: 16 * scale, paddingVertical: 14 * scale }]}>
            <Text style={[styles.inlineErrorText, { fontSize: 13 * scale, lineHeight: 19 * scale }]}>{error}</Text>
          </View>
        ) : null}

        <View style={[styles.reviewCard, { marginHorizontal: horizontal, marginTop: 12 * scale, borderRadius: 30 * scale, paddingHorizontal: 18 * scale, paddingTop: 20 * scale, paddingBottom: 18 * scale }]}>
          <View style={styles.reviewHeader}>
            <View>
              <Text style={[styles.reviewTitle, { fontSize: 21 * scale }]}>Ôn tập lỗi sai</Text>
              <Text style={[styles.reviewSubtitle, { fontSize: 13 * scale, marginTop: 8 * scale }]}>20 lỗi sai</Text>
            </View>
            <View style={[styles.chevronBubble, { width: 40 * scale, height: 40 * scale, borderRadius: 20 * scale }]}>
              <Ionicons name="chevron-forward" size={19 * scale} color="#59be5b" />
            </View>
          </View>
          <TouchableOpacity style={[styles.reviewButton, { borderRadius: 999, paddingVertical: 14 * scale, marginTop: 22 * scale }]} onPress={() => router.push('/review-mistakes')}>
            <Text style={[styles.reviewButtonText, { fontSize: 14 * scale }]}>Làm quiz ngẫu nhiên</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.collectionSectionHeader, { marginHorizontal: horizontal, marginTop: 24 * scale }]}>
          <View>
            <Text style={[styles.sectionTitle, { fontSize: 18 * scale }]}>Flashcards</Text>
            <Text style={[styles.sectionSubtitle, { fontSize: 13 * scale, marginTop: 8 * scale }]}>{collections.length.toString().padStart(2, '0')} chủ đề</Text>
          </View>
          <TouchableOpacity style={styles.sectionLinkRow} onPress={() => router.push('/collection-builder')}>
            <Text style={[styles.sectionLink, { fontSize: 16 * scale }]}>Xem tất cả</Text>
            <Ionicons name="chevron-forward" size={17 * scale} color="#373346" />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: horizontal, paddingRight: 8 * scale, gap: 14 * scale, paddingTop: 14 * scale }}>
          {collections.slice(0, 3).map((collection, index) => (
            <TouchableOpacity
              key={collection.id}
              style={[styles.collectionCard, { width: 186 * scale, height: 226 * scale, borderRadius: 20 * scale }]}
              activeOpacity={0.9}
              onPress={() => router.push({ pathname: '/(tabs)/collection', params: { collectionId: collection.id } })}>
              <Image source={collectionPreviewAssets[index] ?? collectionPreviewAssets[0]} style={styles.collectionPreviewImage} resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {firstCollection ? (
          <TouchableOpacity
            style={[styles.randomButton, { marginHorizontal: horizontal, marginTop: 24 * scale, borderRadius: 999, paddingVertical: 14 * scale }]}
            activeOpacity={0.88}
            onPress={() => router.push({ pathname: '/(tabs)/collection', params: { collectionId: firstCollection.id, mode: 'study' } })}>
            <Text style={[styles.randomButtonText, { fontSize: 14 * scale }]}>Học ngẫu nhiên</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#faf8f8' },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#faf8f8' },
  errorText: { fontFamily: Fonts.medium, fontSize: 14, color: '#ea573f', textAlign: 'center', paddingHorizontal: 24 },
  inlineErrorCard: { backgroundColor: '#fff2f1' },
  inlineErrorText: { fontFamily: Fonts.medium, color: '#ea573f' },
  scrollContent: {},
  header: {},
  screenTitle: { fontFamily: Fonts.bold, color: '#11102a' },
  reviewCard: { backgroundColor: '#59be5b' },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewTitle: { fontFamily: Fonts.bold, color: '#ffffff' },
  reviewSubtitle: { fontFamily: Fonts.medium, color: '#ffffff' },
  chevronBubble: { backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  reviewButton: { backgroundColor: '#ffffff', alignItems: 'center' },
  reviewButtonText: { fontFamily: Fonts.bold, color: '#59be5b' },
  collectionSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontFamily: Fonts.bold, color: '#363349' },
  sectionSubtitle: { fontFamily: Fonts.medium, color: '#59be5b' },
  sectionLinkRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionLink: { fontFamily: Fonts.medium, color: '#373346' },
  collectionCard: { overflow: 'hidden' },
  collectionPreviewImage: { width: '100%', height: '100%' },
  randomButton: { backgroundColor: '#59be5b', alignItems: 'center' },
  randomButtonText: { fontFamily: Fonts.bold, color: '#ffffff' },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconButton: { backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: Fonts.bold, color: '#11102a' },
  detailHero: { alignItems: 'center' },
  detailIcon: { alignItems: 'center', justifyContent: 'center' },
  detailTitle: { fontFamily: Fonts.bold, color: '#11102a' },
  detailSubtitle: { fontFamily: Fonts.medium, color: '#696674' },
  wordPreviewCard: { width: '100%', backgroundColor: '#ffffff', alignItems: 'center' },
  wordPreviewTitle: { fontFamily: Fonts.bold, color: '#11102a' },
  wordPreviewSubtitle: { fontFamily: Fonts.medium, color: '#696674' },
  detailActions: { flexDirection: 'row' },
  primaryAction: { flex: 1, backgroundColor: '#59be5b', alignItems: 'center', justifyContent: 'center' },
  primaryActionText: { fontFamily: Fonts.bold, color: '#ffffff' },
  secondaryAction: { flex: 1, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  secondaryActionText: { fontFamily: Fonts.bold, color: '#11102a' },
  previewSectionTitle: { fontFamily: Fonts.bold, color: '#11102a' },
  previewListItem: { backgroundColor: '#ffffff' },
  previewListTitle: { fontFamily: Fonts.bold, color: '#11102a' },
  previewListSubtitle: { fontFamily: Fonts.medium, color: '#696674' },
  studyHero: { backgroundColor: '#ffffff' },
  studyHeroTitle: { fontFamily: Fonts.bold, color: '#11102a' },
  studyHeroSubtitle: { fontFamily: Fonts.medium, color: '#696674' },
  studyProgressRow: { width: '100%' },
  studyProgressText: { fontFamily: Fonts.medium, color: '#696674', marginBottom: 8 },
  studyTrack: { backgroundColor: '#eceaf0', overflow: 'hidden' },
  studyTrackFill: { height: '100%', backgroundColor: '#59be5b' },
  studyCard: { backgroundColor: '#ffffff' },
  studyChip: { alignSelf: 'center', backgroundColor: '#f2f0f0' },
  studyChipText: { fontFamily: Fonts.medium, color: '#6b6678' },
  studyCardCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  studyWord: { fontFamily: Fonts.bold, color: '#11102a', textAlign: 'center' },
  studyMeaning: { fontFamily: Fonts.medium, color: '#696674', textAlign: 'center' },
  exampleBox: { width: '100%', backgroundColor: '#faf8f8' },
  exampleEnglish: { fontFamily: Fonts.semiBold, color: '#353049' },
  exampleVietnamese: { fontFamily: Fonts.regular, color: '#7d7889' },
  studyActions: { flexDirection: 'row' },
  disabledButton: { opacity: 0.5 },
});
