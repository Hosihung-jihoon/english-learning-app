import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Redirect, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CollectionSummary } from '../../../shared/types';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';
import { createCollection, createFlashcard, getCollections } from '@/services/content-service';

const folderFilters: { value: CollectionSummary['filter']; label: string }[] = [
  { value: 'vocabulary', label: 'Từ vựng' },
  { value: 'sentence-pattern', label: 'Mẫu câu' },
  { value: 'grammar', label: 'Ngữ pháp' },
  { value: 'listening-speaking', label: 'Nghe nói' },
];

export default function CollectionBuilderScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { isLoading: authLoading, onboardingComplete, token } = useAuth();
  const { collectionId } = useLocalSearchParams<{ collectionId?: string }>();
  const normalizedCollectionId = typeof collectionId === 'string' && collectionId.length > 0 ? collectionId : undefined;
  const [mode, setMode] = useState<'folder' | 'flashcard'>(normalizedCollectionId ? 'flashcard' : 'folder');
  const [collections, setCollections] = useState<CollectionSummary[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(normalizedCollectionId ?? null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [folderTitle, setFolderTitle] = useState('');
  const [folderDescription, setFolderDescription] = useState('');
  const [folderFilter, setFolderFilter] = useState<CollectionSummary['filter']>('vocabulary');

  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [exampleEnglish, setExampleEnglish] = useState('');
  const [exampleVietnamese, setExampleVietnamese] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSelectedCollectionId(normalizedCollectionId ?? null);
    setMode(normalizedCollectionId ? 'flashcard' : 'folder');
    setError(null);
  }, [normalizedCollectionId]);

  useEffect(() => {
    if (!token || !onboardingComplete) {
      setCollections([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    let mounted = true;

    getCollections(token)
      .then((data) => {
        if (!mounted) {
          return;
        }

        setCollections(data);
        const requestedCollectionExists = normalizedCollectionId ? data.some((collection) => collection.id === normalizedCollectionId) : false;

        if (normalizedCollectionId && !requestedCollectionExists) {
          const fallbackCollection = data[0] ?? null;
          setSelectedCollectionId(fallbackCollection?.id ?? null);
          setMode(fallbackCollection ? 'flashcard' : 'folder');
          return;
        }

        if (!normalizedCollectionId && data[0]) {
          setSelectedCollectionId((current) => current ?? data[0].id);
        }

        if ((normalizedCollectionId || mode === 'flashcard') && data.length === 0) {
          setMode('folder');
        }
      })
      .catch((loadError) => {
        if (mounted) {
          setCollections([]);
          setError(loadError instanceof Error ? loadError.message : 'Không tải được dữ liệu thư mục.');
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
  }, [mode, normalizedCollectionId, onboardingComplete, token]);

  const scale = Math.min(width / 375, 1) * 0.92;
  const horizontal = 24 * scale;
  const insetBottom = Math.max(insets.bottom, 16);

  if (authLoading) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={['top']}>
        <ActivityIndicator size="large" color="#55ba5d" />
      </SafeAreaView>
    );
  }

  if (!token) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (!onboardingComplete) {
    return <Redirect href="/(auth)/onboarding-intro-1" />;
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={['top']}>
        <ActivityIndicator size="large" color="#55ba5d" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.header, { paddingHorizontal: horizontal, paddingTop: 16 * scale }]}>
        <TouchableOpacity style={[styles.iconButton, { width: 44 * scale, height: 44 * scale, borderRadius: 22 * scale }]} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24 * scale} color="#050018" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontSize: 20 * scale }]}>Tạo nội dung</Text>
        <View style={{ width: 44 * scale }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: horizontal, paddingTop: 18 * scale, paddingBottom: insetBottom + 20 * scale }}>
        <View style={[styles.heroCard, { borderRadius: 34 * scale, paddingHorizontal: 22 * scale, paddingVertical: 24 * scale }]}>
          <Text style={[styles.heroTitle, { fontSize: 26 * scale, lineHeight: 34 * scale }]}>{mode === 'folder' ? 'Tạo thư mục mới' : 'Tạo flashcard mới'}</Text>
          <Text style={[styles.heroCaption, { fontSize: 15 * scale, lineHeight: 22 * scale, marginTop: 10 * scale }]}>
            {mode === 'folder'
              ? 'Tạo một thư mục rõ chủ đề trước, sau đó thêm flashcard để thư viện nhìn gọn và dễ học hơn.'
              : 'Chọn thư mục phù hợp và thêm nội dung ngắn gọn, rõ ràng để bám đúng phong cách ôn tập của app.'}
          </Text>
        </View>

        {error ? (
          <View style={[styles.errorCard, { borderRadius: 18 * scale, marginTop: 18 * scale, paddingHorizontal: 16 * scale, paddingVertical: 14 * scale }]}>
            <Text style={[styles.errorText, { fontSize: 13 * scale, lineHeight: 20 * scale }]}>{error}</Text>
          </View>
        ) : null}

        <View style={[styles.segment, { borderRadius: 18 * scale, padding: 4 * scale, marginTop: 22 * scale }]}>
          <TouchableOpacity
            style={[styles.segmentItem, { borderRadius: 14 * scale }, mode === 'folder' && styles.segmentItemActive]}
            onPress={() => {
              setError(null);
              setMode('folder');
            }}>
            <Text style={[styles.segmentText, { fontSize: 14 * scale }, mode === 'folder' && styles.segmentTextActive]}>Tạo thư mục</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentItem, { borderRadius: 14 * scale }, mode === 'flashcard' && styles.segmentItemActive]}
            onPress={() => {
              setError(null);
              setMode('flashcard');
            }}>
            <Text style={[styles.segmentText, { fontSize: 14 * scale }, mode === 'flashcard' && styles.segmentTextActive]}>Tạo flashcard</Text>
          </TouchableOpacity>
        </View>

        {mode === 'folder' ? (
          <View style={[styles.formCard, { borderRadius: 28 * scale, paddingHorizontal: 20 * scale, paddingVertical: 20 * scale, marginTop: 20 * scale }]}>
            <Text style={[styles.sectionTitle, { fontSize: 18 * scale }]}>Thông tin thư mục</Text>

            <TextInput
              style={[styles.input, { borderRadius: 18 * scale, height: 58 * scale, paddingHorizontal: 18 * scale, fontSize: 14 * scale, marginTop: 16 * scale }]}
              placeholder="Tên thư mục"
              placeholderTextColor="#8d899b"
              value={folderTitle}
              onChangeText={(value) => {
                setFolderTitle(value);
                if (error) {
                  setError(null);
                }
              }}
            />
            <TextInput
              style={[
                styles.input,
                { borderRadius: 18 * scale, minHeight: 110 * scale, paddingHorizontal: 18 * scale, paddingTop: 16 * scale, fontSize: 14 * scale, marginTop: 12 * scale },
              ]}
              placeholder="Mô tả ngắn"
              placeholderTextColor="#8d899b"
              value={folderDescription}
              onChangeText={(value) => {
                setFolderDescription(value);
                if (error) {
                  setError(null);
                }
              }}
              multiline
              textAlignVertical="top"
            />

            <Text style={[styles.fieldLabel, { fontSize: 14 * scale, marginTop: 18 * scale }]}>Chọn thể loại</Text>
            <View style={[styles.filterWrap, { gap: 10 * scale, marginTop: 14 * scale }]}>
              {folderFilters.map((filter) => (
                <TouchableOpacity
                  key={filter.value}
                  style={[styles.filterChip, { borderRadius: 20 * scale, paddingHorizontal: 16 * scale, paddingVertical: 11 * scale }, folderFilter === filter.value && styles.filterChipActive]}
                  onPress={() => {
                    setFolderFilter(filter.value);
                    if (error) {
                      setError(null);
                    }
                  }}>
                  <Text style={[styles.filterChipText, { fontSize: 13 * scale }, folderFilter === filter.value && styles.filterChipTextActive]}>{filter.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, { borderRadius: 28 * scale, height: 56 * scale, marginTop: 24 * scale }, (!folderTitle || saving) && styles.primaryButtonDisabled]}
              disabled={!folderTitle || saving}
              onPress={async () => {
                if (!token || saving) {
                  return;
                }

                setSaving(true);
                try {
                  const collection = await createCollection(token, {
                    title: folderTitle,
                    description: folderDescription,
                    filter: folderFilter,
                  });

                  setError(null);
                  setCollections((prev) => [...prev, collection]);
                  setSelectedCollectionId(collection.id);
                  setFolderTitle('');
                  setFolderDescription('');
                  setFolderFilter('vocabulary');
                  setMode('flashcard');
                } catch (saveError) {
                  setError(saveError instanceof Error ? saveError.message : 'Không tạo được thư mục mới.');
                } finally {
                  setSaving(false);
                }
              }}>
              <Text style={[styles.primaryButtonText, { fontSize: 16 * scale }]}>{saving ? 'Đang tạo...' : 'Tạo thư mục'}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.formCard, { borderRadius: 28 * scale, paddingHorizontal: 20 * scale, paddingVertical: 20 * scale, marginTop: 20 * scale }]}>
            <Text style={[styles.sectionTitle, { fontSize: 18 * scale }]}>Nội dung flashcard</Text>
            <Text style={[styles.fieldLabel, { fontSize: 14 * scale, marginTop: 16 * scale }]}>Chọn thư mục</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 * scale, paddingTop: 14 * scale }}>
              {collections.map((collection) => (
                <TouchableOpacity
                  key={collection.id}
                  style={[
                    styles.collectionChip,
                    { borderRadius: 20 * scale, paddingHorizontal: 16 * scale, paddingVertical: 11 * scale },
                    selectedCollectionId === collection.id && styles.collectionChipActive,
                  ]}
                  onPress={() => {
                    setSelectedCollectionId(collection.id);
                    if (error) {
                      setError(null);
                    }
                  }}>
                  <Text style={[styles.collectionChipText, { fontSize: 13 * scale }, selectedCollectionId === collection.id && styles.collectionChipTextActive]}>{collection.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {collections.length === 0 ? (
              <Text style={[styles.helperText, { fontSize: 13 * scale, lineHeight: 20 * scale, marginTop: 12 * scale }]}>
                Chưa có thư mục nào khả dụng. Hãy tạo thư mục trước khi thêm flashcard.
              </Text>
            ) : null}

            <TextInput
              style={[styles.input, { borderRadius: 18 * scale, height: 58 * scale, paddingHorizontal: 18 * scale, fontSize: 14 * scale, marginTop: 18 * scale }]}
              placeholder="Từ / cụm từ"
              placeholderTextColor="#8d899b"
              value={word}
              onChangeText={(value) => {
                setWord(value);
                if (error) {
                  setError(null);
                }
              }}
            />
            <TextInput
              style={[styles.input, { borderRadius: 18 * scale, height: 58 * scale, paddingHorizontal: 18 * scale, fontSize: 14 * scale, marginTop: 12 * scale }]}
              placeholder="Nghĩa tiếng Việt"
              placeholderTextColor="#8d899b"
              value={meaning}
              onChangeText={(value) => {
                setMeaning(value);
                if (error) {
                  setError(null);
                }
              }}
            />
            <TextInput
              style={[styles.input, { borderRadius: 18 * scale, height: 58 * scale, paddingHorizontal: 18 * scale, fontSize: 14 * scale, marginTop: 12 * scale }]}
              placeholder="Ví dụ tiếng Anh"
              placeholderTextColor="#8d899b"
              value={exampleEnglish}
              onChangeText={(value) => {
                setExampleEnglish(value);
                if (error) {
                  setError(null);
                }
              }}
            />
            <TextInput
              style={[styles.input, { borderRadius: 18 * scale, height: 58 * scale, paddingHorizontal: 18 * scale, fontSize: 14 * scale, marginTop: 12 * scale }]}
              placeholder="Ví dụ tiếng Việt"
              placeholderTextColor="#8d899b"
              value={exampleVietnamese}
              onChangeText={(value) => {
                setExampleVietnamese(value);
                if (error) {
                  setError(null);
                }
              }}
            />
            <TextInput
              style={[
                styles.input,
                { borderRadius: 18 * scale, minHeight: 110 * scale, paddingHorizontal: 18 * scale, paddingTop: 16 * scale, fontSize: 14 * scale, marginTop: 12 * scale },
              ]}
              placeholder="Ghi chú thêm"
              placeholderTextColor="#8d899b"
              value={note}
              onChangeText={(value) => {
                setNote(value);
                if (error) {
                  setError(null);
                }
              }}
              multiline
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[
                styles.primaryButton,
                { borderRadius: 28 * scale, height: 56 * scale, marginTop: 24 * scale },
                (!selectedCollectionId || !word || !meaning || saving) && styles.primaryButtonDisabled,
              ]}
              disabled={!selectedCollectionId || !word || !meaning || saving}
              onPress={async () => {
                if (!token || !selectedCollectionId || saving) {
                  return;
                }

                setSaving(true);
                try {
                  await createFlashcard(token, selectedCollectionId, {
                    word,
                    meaning,
                    exampleEnglish,
                    exampleVietnamese,
                    note,
                  });
                  setError(null);
                  setWord('');
                  setMeaning('');
                  setExampleEnglish('');
                  setExampleVietnamese('');
                  setNote('');
                  router.replace({ pathname: '/(tabs)/collection', params: { collectionId: selectedCollectionId } });
                } catch (saveError) {
                  setError(saveError instanceof Error ? saveError.message : 'Không lưu được flashcard.');
                } finally {
                  setSaving(false);
                }
              }}>
              <Text style={[styles.primaryButtonText, { fontSize: 16 * scale }]}>{saving ? 'Đang lưu...' : 'Lưu flashcard'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#faf8f8' },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#faf8f8' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconButton: { backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: Fonts.bold, color: '#050018' },
  heroCard: { backgroundColor: '#ffffff' },
  heroTitle: { fontFamily: Fonts.bold, color: '#050018' },
  heroCaption: { fontFamily: Fonts.regular, color: '#696674' },
  errorCard: { backgroundColor: '#fff1ef' },
  errorText: { fontFamily: Fonts.medium, color: '#d1432f' },
  segment: { flexDirection: 'row', backgroundColor: '#f2f0f0' },
  segmentItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
  segmentItemActive: { backgroundColor: '#ffffff' },
  segmentText: { fontFamily: Fonts.medium, color: '#6c5f80' },
  segmentTextActive: { fontFamily: Fonts.bold, color: '#050018' },
  formCard: { backgroundColor: '#ffffff' },
  sectionTitle: { fontFamily: Fonts.bold, color: '#050018' },
  fieldLabel: { fontFamily: Fonts.medium, color: '#6c5f80' },
  input: { backgroundColor: '#faf8f8', fontFamily: Fonts.regular, color: '#050018' },
  filterWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  filterChip: { backgroundColor: '#f2f0f0' },
  filterChipActive: { backgroundColor: '#55ba5d' },
  filterChipText: { fontFamily: Fonts.medium, color: '#696674' },
  filterChipTextActive: { color: '#ffffff' },
  collectionChip: { backgroundColor: '#f2f0f0' },
  collectionChipActive: { backgroundColor: '#55ba5d' },
  collectionChipText: { fontFamily: Fonts.medium, color: '#696674' },
  collectionChipTextActive: { color: '#ffffff' },
  helperText: { fontFamily: Fonts.regular, color: '#696674' },
  primaryButton: { backgroundColor: '#55ba5d', alignItems: 'center', justifyContent: 'center' },
  primaryButtonDisabled: { backgroundColor: '#b6d7b9' },
  primaryButtonText: { fontFamily: Fonts.bold, color: '#ffffff' },
});
