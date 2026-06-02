import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { CollectionSummary } from '../../../../shared/types';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';
import { getCollections } from '@/services/content-service';

type CategoryFilter = 'all' | 'vocabulary' | 'sentence' | 'grammar' | 'speaking';

interface FigmaCategoryCard {
  key: string;
  title: string;
  countLabel: string;
  filter: CategoryFilter;
  image?: number;
  accent?: string;
}

const filters: Array<{ key: CategoryFilter; label: string }> = [
  { key: 'all', label: 'Tất cả (20)' },
  { key: 'vocabulary', label: 'Từ vựng' },
  { key: 'sentence', label: 'Mẫu câu' },
  { key: 'grammar', label: 'Ngữ pháp' },
  { key: 'speaking', label: 'Nghe nói' },
];

const figmaCategoryCards: FigmaCategoryCard[] = [
  { key: 'all', title: 'Tất cả', countLabel: '100 flashcard', filter: 'all', accent: '#59be5b' },
  {
    key: 'basic-talk',
    title: 'Giao tiếp\ncơ bản',
    countLabel: '20 flashcard',
    filter: 'sentence',
    image: require('../../assets/images/figma-category-card-basic-talk.png'),
  },
  {
    key: 'grammar',
    title: 'Ngữ pháp',
    countLabel: '30 flashcard',
    filter: 'grammar',
    image: require('../../assets/images/figma-category-card-grammar.png'),
  },
  {
    key: 'ielts',
    title: '6.0 Ielts',
    countLabel: '10 flashcard',
    filter: 'speaking',
    image: require('../../assets/images/figma-category-card-ielts.png'),
  },
];

function matchCollectionId(cardKey: string, collections: CollectionSummary[]) {
  const lowerTitles = collections.map((item) => ({ ...item, lower: item.title.toLowerCase() }));

  if (cardKey === 'basic-talk') {
    return lowerTitles.find((item) => item.lower.includes('giao tiếp'))?.id ?? lowerTitles[1]?.id ?? lowerTitles[0]?.id;
  }

  if (cardKey === 'grammar') {
    return lowerTitles.find((item) => item.lower.includes('ngữ pháp') || item.lower.includes('grammar'))?.id ?? lowerTitles[0]?.id;
  }

  if (cardKey === 'ielts') {
    return lowerTitles.find((item) => item.lower.includes('ielts'))?.id ?? lowerTitles[2]?.id ?? lowerTitles[0]?.id;
  }

  return lowerTitles[0]?.id;
}

export default function CategoriesScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const tabBarHeight = useBottomTabBarHeight();
  const { token } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<CategoryFilter>('all');
  const [collections, setCollections] = useState<CollectionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scale = Math.min(width / 375, 1) * 0.84;
  const horizontal = 20 * scale;

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let mounted = true;

    getCollections(token)
      .then((items) => {
        if (mounted) {
          setCollections(items);
        }
      })
      .catch((loadError) => {
        if (mounted) {
          setError(loadError instanceof Error ? loadError.message : 'Không tải được thể loại.');
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

  const filteredCards = useMemo(() => {
    return figmaCategoryCards.filter((card) => {
      const matchesSearch = card.title.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = selectedFilter === 'all' || card.filter === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [search, selectedFilter]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={['top']}>
        <ActivityIndicator size="large" color="#00bd50" />
      </SafeAreaView>
    );
  }

  if (error && collections.length === 0) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={['top']}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontal, paddingBottom: tabBarHeight + 20 * scale }]}>
        <View style={[styles.header, { paddingTop: 8 * scale, paddingBottom: 16 * scale }]}>
          <TouchableOpacity style={[styles.backButton, { width: 38 * scale, height: 38 * scale, borderRadius: 19 * scale }]} onPress={() => router.replace('/(tabs)/collection')}>
            <Ionicons name="chevron-back" size={21 * scale} color="#11102a" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { marginLeft: 10 * scale, fontSize: 23 * scale }]}>Thể loại</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={[styles.searchContainer, { borderRadius: 22 * scale, paddingHorizontal: 16 * scale, height: 58 * scale }]}>
          <Ionicons name="search-outline" size={19 * scale} color="#6f6d82" />
          <TextInput
            style={[styles.searchInput, { marginLeft: 10 * scale, fontSize: 14 * scale }]}
            placeholder="Tìm kiếm"
            placeholderTextColor="#6f6d82"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={[styles.resultHeader, { marginTop: 22 * scale, marginBottom: 14 * scale }]}>
          <Text style={[styles.resultTitle, { fontSize: 22 * scale, marginBottom: 8 * scale }]}>Lọc theo danh mục</Text>
          <Text style={[styles.resultCount, { fontSize: 14 * scale }]}>128 kết quả được phát hiện</Text>
        </View>

        <View style={[styles.filtersWrap, { gap: 10 * scale, marginBottom: 18 * scale }]}>
          {filters.map((filter) => {
            const active = filter.key === selectedFilter;

            return (
              <TouchableOpacity
                key={filter.key}
                style={[styles.filterChip, { borderRadius: 999, paddingHorizontal: 14 * scale, paddingVertical: 10 * scale }, active && styles.filterChipActive]}
                onPress={() => setSelectedFilter(filter.key)}>
                <Text style={[styles.filterChipText, { fontSize: 14 * scale }, active && styles.filterChipTextActive]}>{filter.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.grid, { rowGap: 14 * scale }]}>
          {filteredCards.map((card) => {
            const collectionId = matchCollectionId(card.key, collections);

            return (
              <TouchableOpacity
                key={card.key}
                style={[styles.card, { borderRadius: 20 * scale }]}
                activeOpacity={0.9}
                onPress={() => {
                  if (collectionId) {
                    router.push({ pathname: '/(tabs)/collection', params: { collectionId } });
                  }
                }}>
                {card.image ? (
                  <Image source={card.image} style={styles.cardImage} resizeMode="cover" />
                ) : (
                  <View style={[styles.allCard, { paddingHorizontal: 16 * scale, paddingTop: 22 * scale }]}>
                    <Text style={[styles.allCardTitle, { color: card.accent || '#59be5b', fontSize: 19 * scale, marginBottom: 10 * scale }]}>{card.title}</Text>
                    <Text style={[styles.allCardCount, { color: card.accent || '#59be5b', fontSize: 14 * scale }]}>{card.countLabel}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#faf8f8' },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#faf8f8' },
  errorText: { fontFamily: Fonts.medium, fontSize: 14, color: '#ea573f', textAlign: 'center', paddingHorizontal: 24 },
  scrollContent: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    color: '#11102a',
  },
  headerSpacer: { flex: 1 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.medium,
    color: '#11102a',
  },
  resultHeader: {},
  resultTitle: {
    fontFamily: Fonts.bold,
    color: '#11102a',
  },
  resultCount: {
    fontFamily: Fonts.medium,
    color: '#11102a',
  },
  filtersWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterChip: {
    backgroundColor: '#ffffff',
  },
  filterChipActive: {
    backgroundColor: '#59be5b',
  },
  filterChipText: {
    fontFamily: Fonts.semiBold,
    color: '#6f6d82',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    aspectRatio: 1,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  allCard: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  allCardTitle: {
    fontFamily: Fonts.bold,
  },
  allCardCount: {
    fontFamily: Fonts.medium,
  },
});
