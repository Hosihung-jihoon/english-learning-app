import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { CollectionSummary, Flashcard } from '../../../../shared/types';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';
import { getCollection, getCollectionFlashcards, getCollections } from '@/services/content-service';

export default function CollectionScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const { collectionId, mode } = useLocalSearchParams<{ collectionId?: string; mode?: string }>();
  const [collections, setCollections] = useState<CollectionSummary[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<CollectionSummary | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [studyIndex, setStudyIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }
    const accessToken = token;
    const selectedCollectionId = collectionId ?? undefined;

    let mounted = true;
    async function load() {
      try {
        const collectionList = await getCollections(accessToken);
        if (!mounted) {
          return;
        }
        setCollections(collectionList);

        if (selectedCollectionId) {
          const [detail, items] = await Promise.all([
            getCollection(accessToken, selectedCollectionId),
            getCollectionFlashcards(accessToken, selectedCollectionId),
          ]);
          if (!mounted) {
            return;
          }
          setSelectedCollection(detail);
          setFlashcards(items);
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
  }, [token, collectionId]);

  const firstCollection = useMemo(() => collections[0], [collections]);
  const currentFlashcard = flashcards[studyIndex];

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#55ba5d" />
      </SafeAreaView>
    );
  }

  if (collectionId && mode === 'study' && selectedCollection && currentFlashcard) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.detailHeader}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#050018" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Học bộ thẻ</Text>
          <View style={{ width: 42 }} />
        </View>

        <View style={styles.studyContainer}>
          <Text style={styles.studyProgress}>
            {studyIndex + 1}/{flashcards.length}
          </Text>
          <TouchableOpacity style={styles.studyCard} activeOpacity={0.9} onPress={() => setShowMeaning((prev) => !prev)}>
            <Text style={styles.studyWord}>{currentFlashcard.word}</Text>
            <Text style={styles.studyMeaning}>{showMeaning ? currentFlashcard.meaning : 'Nhấn để lật thẻ'}</Text>
          </TouchableOpacity>

          <View style={styles.studyActions}>
            <TouchableOpacity
              style={[styles.detailSecondaryButton, studyIndex === 0 && styles.disabledButton]}
              disabled={studyIndex === 0}
              onPress={() => {
                setStudyIndex((prev) => prev - 1);
                setShowMeaning(false);
              }}>
              <Text style={styles.detailSecondaryButtonText}>Thẻ trước</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.detailPrimaryButton}
              onPress={() => {
                if (studyIndex === flashcards.length - 1) {
                  router.replace('/(tabs)/collection');
                  return;
                }
                setStudyIndex((prev) => prev + 1);
                setShowMeaning(false);
              }}>
              <Text style={styles.detailPrimaryButtonText}>{studyIndex === flashcards.length - 1 ? 'Hoàn tất' : 'Thẻ tiếp'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (collectionId && selectedCollection) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.detailHeader}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.replace('/(tabs)/collection')}>
            <Ionicons name="arrow-back" size={24} color="#050018" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Flashcards/chi tiết</Text>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push({ pathname: '/collection-builder', params: { collectionId: selectedCollection.id } })}>
            <Ionicons name="add" size={24} color="#050018" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={[styles.previewHero, { backgroundColor: selectedCollection.softColor }]}>
            <View style={[styles.previewIcon, { backgroundColor: selectedCollection.accentColor }]}>
              <Ionicons name={selectedCollection.icon as never} size={24} color="#ffffff" />
            </View>
            <Text style={styles.previewTitle}>{selectedCollection.title}</Text>
            <Text style={styles.previewSubtitle}>{selectedCollection.subtitle}</Text>
            <View style={styles.previewWordCard}>
              <Text style={styles.previewWord}>{selectedCollection.previewWord}</Text>
              <Text style={styles.previewMeaning}>{selectedCollection.previewMeaning}</Text>
            </View>
          </View>

          <View style={styles.detailActions}>
            <TouchableOpacity
              style={styles.detailPrimaryButton}
              onPress={() => router.push({ pathname: '/(tabs)/collection', params: { collectionId: selectedCollection.id, mode: 'study' } })}>
              <Text style={styles.detailPrimaryButtonText}>Học bộ thẻ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.detailSecondaryButton}
              onPress={() => router.push({ pathname: '/collection-builder', params: { collectionId: selectedCollection.id } })}>
              <Text style={styles.detailSecondaryButtonText}>Tạo flashcard</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Preview</Text>
          <View style={styles.previewList}>
            {flashcards.map((item) => (
              <View key={item.id} style={styles.previewListItem}>
                <Text style={styles.previewListTitle}>{item.word}</Text>
                <Text style={styles.previewListSubtitle}>{item.meaning}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Thư viện ôn tập</Text>
        </View>

        <View style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <View>
              <Text style={styles.reviewTitle}>Ôn tập lỗi sai</Text>
              <Text style={styles.reviewSubtitle}>Xem lại câu bạn từng chọn sai</Text>
            </View>
            <View style={styles.chevronBubble}>
              <Ionicons name="chevron-forward" size={18} color="#55ba5d" />
            </View>
          </View>
          <TouchableOpacity style={styles.reviewButton} onPress={() => router.push('/review-mistakes')}>
            <Text style={styles.reviewButtonText}>Làm quiz ngẫu nhiên</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.collectionSectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Flashcards</Text>
            <Text style={styles.sectionSubtitle}>{collections.length.toString().padStart(2, '0')} chủ đề</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/collection-builder')}>
            <Text style={styles.sectionLink}>Tạo thư mục</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {collections.map((collection) => (
            <TouchableOpacity
              key={collection.id}
              style={styles.collectionCard}
              activeOpacity={0.9}
              onPress={() => router.push({ pathname: '/(tabs)/collection', params: { collectionId: collection.id } })}>
              <View style={styles.collectionCardText}>
                <Text style={styles.collectionCardTitle}>{collection.title}</Text>
                <Text style={styles.collectionCardSubtitle}>{collection.subtitle}</Text>
              </View>
              <View style={[styles.collectionVisual, { backgroundColor: collection.softColor }]}>
                <Text style={styles.collectionVisualWord}>{collection.previewWord}</Text>
                <Text style={styles.collectionVisualMeaning}>{collection.previewMeaning}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {firstCollection ? (
          <TouchableOpacity
            style={styles.randomButton}
            activeOpacity={0.88}
            onPress={() => router.push({ pathname: '/(tabs)/collection', params: { collectionId: firstCollection.id, mode: 'study' } })}>
            <Text style={styles.randomButtonText}>Học ngẫu nhiên</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#faf8f8' },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#faf8f8' },
  scrollContent: { paddingBottom: 32 },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  screenTitle: { fontFamily: Fonts.bold, fontSize: 24, color: '#050018' },
  reviewCard: { marginHorizontal: 24, marginTop: 16, backgroundColor: '#55ba5d', borderRadius: 20, padding: 20 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewTitle: { fontFamily: Fonts.bold, fontSize: 20, color: '#ffffff', marginBottom: 4 },
  reviewSubtitle: { fontFamily: Fonts.medium, fontSize: 14, color: '#e0fdec' },
  chevronBubble: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  reviewButton: { marginTop: 16, backgroundColor: '#ffffff', borderRadius: 999, paddingVertical: 12, alignItems: 'center' },
  reviewButtonText: { fontFamily: Fonts.bold, fontSize: 16, color: '#55ba5d' },
  collectionSectionHeader: { marginHorizontal: 24, marginTop: 32, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontFamily: Fonts.bold, fontSize: 20, color: '#050018' },
  sectionSubtitle: { fontFamily: Fonts.medium, fontSize: 14, color: '#8d7979', marginTop: 4 },
  sectionLink: { fontFamily: Fonts.medium, fontSize: 14, color: '#00bd50' },
  horizontalList: { paddingHorizontal: 24, gap: 16, paddingTop: 16 },
  collectionCard: { width: 202, backgroundColor: '#ffffff', borderRadius: 16, padding: 16 },
  collectionCardText: { marginBottom: 16 },
  collectionCardTitle: { fontFamily: Fonts.bold, fontSize: 18, color: '#373346', marginBottom: 4 },
  collectionCardSubtitle: { fontFamily: Fonts.medium, fontSize: 12, color: '#696674' },
  collectionVisual: { borderRadius: 16, height: 148, padding: 20, justifyContent: 'space-between' },
  collectionVisualWord: { fontFamily: Fonts.bold, fontSize: 18, color: '#373346' },
  collectionVisualMeaning: { fontFamily: Fonts.medium, fontSize: 13, color: '#696674' },
  randomButton: { marginHorizontal: 24, marginTop: 28, backgroundColor: '#55ba5d', borderRadius: 999, paddingVertical: 16, alignItems: 'center' },
  randomButtonText: { fontFamily: Fonts.bold, fontSize: 16, color: '#ffffff' },
  detailHeader: { paddingHorizontal: 24, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: Fonts.bold, fontSize: 20, color: '#050018' },
  previewHero: { marginHorizontal: 24, borderRadius: 28, padding: 24, alignItems: 'center' },
  previewIcon: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  previewTitle: { fontFamily: Fonts.bold, fontSize: 24, color: '#050018', marginBottom: 6 },
  previewSubtitle: { fontFamily: Fonts.medium, fontSize: 14, color: '#696674', marginBottom: 18 },
  previewWordCard: { width: '100%', backgroundColor: '#ffffff', borderRadius: 20, padding: 20, alignItems: 'center' },
  previewWord: { fontFamily: Fonts.bold, fontSize: 24, color: '#050018', marginBottom: 6 },
  previewMeaning: { fontFamily: Fonts.medium, fontSize: 14, color: '#696674' },
  detailActions: { marginHorizontal: 24, flexDirection: 'row', gap: 12, marginTop: 20, marginBottom: 24 },
  detailPrimaryButton: { flex: 1, backgroundColor: '#55ba5d', borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  detailPrimaryButtonText: { fontFamily: Fonts.bold, fontSize: 15, color: '#ffffff' },
  detailSecondaryButton: { flex: 1, backgroundColor: '#ffffff', borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  detailSecondaryButtonText: { fontFamily: Fonts.bold, fontSize: 15, color: '#050018' },
  previewList: { paddingHorizontal: 24, gap: 12 },
  previewListItem: { backgroundColor: '#ffffff', borderRadius: 18, padding: 16 },
  previewListTitle: { fontFamily: Fonts.bold, fontSize: 16, color: '#050018', marginBottom: 4 },
  previewListSubtitle: { fontFamily: Fonts.medium, fontSize: 13, color: '#696674' },
  studyContainer: { flex: 1, paddingHorizontal: 24, paddingBottom: 40, justifyContent: 'center' },
  studyProgress: { textAlign: 'center', fontFamily: Fonts.medium, fontSize: 13, color: '#696674', marginBottom: 20 },
  studyCard: { backgroundColor: '#ffffff', borderRadius: 28, padding: 32, alignItems: 'center', minHeight: 280, justifyContent: 'center' },
  studyWord: { fontFamily: Fonts.bold, fontSize: 28, color: '#050018', marginBottom: 12 },
  studyMeaning: { fontFamily: Fonts.medium, fontSize: 16, color: '#696674', textAlign: 'center' },
  studyActions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  disabledButton: { opacity: 0.5 },
});
