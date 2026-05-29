import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { CategorySummary, CollectionSummary } from '../../../../shared/types';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';
import { filterLabels, getCollections } from '@/services/content-service';

const filters = ['Tất cả', 'Từ vựng', 'Mẫu câu', 'Ngữ pháp', 'Nghe nói'] as const;

function toCategory(collection: CollectionSummary): CategorySummary {
  return {
    id: collection.id,
    title: collection.title,
    countLabel: `${collection.flashcardCount} flashcard`,
    filter: collection.filter,
    collectionId: collection.id,
    colors: collection.colors,
    icon: collection.icon,
  };
}

export default function CategoriesScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<(typeof filters)[number]>('Tất cả');
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      return;
    }

    let mounted = true;
    getCollections(token)
      .then((collections) => {
        if (mounted) {
          setCategories(collections.map(toCategory));
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

  const filteredCategories = useMemo(() => {
    return categories.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = selectedFilter === 'Tất cả' || filterLabels[item.filter] === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [categories, search, selectedFilter]);

  if (loading) {
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
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.replace('/(tabs)/collection')}>
            <Ionicons name="arrow-back" size={24} color="#050018" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thể loại</Text>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Tùy chọn thể loại' } } as never)}>
            <Ionicons name="options-outline" size={22} color="#050018" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#8e8e93" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm"
            placeholderTextColor="#8e8e93"
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Bộ lọc thể loại' } } as never)}>
            <Ionicons name="funnel-outline" size={18} color="#27ae60" />
          </TouchableOpacity>
        </View>

        <View style={styles.filtersArea}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContent}>
            {filters.map((filter) => {
              const active = filter === selectedFilter;
              return (
                <TouchableOpacity key={filter} style={[styles.filterChip, active && styles.filterChipActive]} onPress={() => setSelectedFilter(filter)}>
                  <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{filter}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.resultHeader}>
          <Text style={styles.resultTitle}>Lọc theo danh mục</Text>
          <Text style={styles.resultCount}>{filteredCategories.length} kết quả được phát hiện</Text>
        </View>

        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.gridRow}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.cardWrap}
              activeOpacity={0.88}
              onPress={() => router.push({ pathname: '/(tabs)/collection', params: { collectionId: item.collectionId } })}>
              <LinearGradient colors={item.colors} style={styles.card}>
                <View style={styles.cardIconBubble}>
                  <Ionicons name={item.icon as never} size={22} color="#ffffff" />
                </View>
                <View>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.cardCount}>{item.countLabel}</Text>
                  <Text style={styles.cardCount}>{filterLabels[item.filter]}</Text>
                </View>
                <View style={styles.cardDecoration} />
              </LinearGradient>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#faf8f8' },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#faf8f8' },
  container: { flex: 1, backgroundColor: '#faf8f8' },
  header: { paddingHorizontal: 24, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: Fonts.bold, fontSize: 20, color: '#050018' },
  searchContainer: {
    marginHorizontal: 24,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    gap: 10,
  },
  searchInput: { flex: 1, fontFamily: Fonts.medium, fontSize: 15, color: '#050018' },
  filtersArea: { height: 48, marginBottom: 16 },
  filtersContent: { paddingHorizontal: 24, gap: 8, alignItems: 'center' },
  filterChip: { backgroundColor: '#f2f0f0', borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8 },
  filterChipActive: { backgroundColor: '#00bd50' },
  filterChipText: { fontFamily: Fonts.medium, fontSize: 14, color: '#6c5f80' },
  filterChipTextActive: { fontFamily: Fonts.semiBold, color: '#ffffff' },
  resultHeader: { paddingHorizontal: 24, marginBottom: 16 },
  resultTitle: { fontFamily: Fonts.bold, fontSize: 18, color: '#050018', marginBottom: 4 },
  resultCount: { fontFamily: Fonts.medium, fontSize: 12, color: '#929292' },
  gridContent: { paddingHorizontal: 16, paddingBottom: 24 },
  gridRow: { justifyContent: 'space-between', paddingHorizontal: 8 },
  cardWrap: { flex: 1, maxWidth: '48%', marginBottom: 16 },
  card: { height: 140, borderRadius: 24, overflow: 'hidden', padding: 16, justifyContent: 'space-between' },
  cardIconBubble: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.24)', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontFamily: Fonts.bold, fontSize: 15, color: '#ffffff', marginBottom: 4 },
  cardCount: { fontFamily: Fonts.medium, fontSize: 12, color: 'rgba(255,255,255,0.84)' },
  cardDecoration: { position: 'absolute', bottom: -18, right: -18, width: 78, height: 78, borderRadius: 39, backgroundColor: 'rgba(255,255,255,0.12)' },
});
