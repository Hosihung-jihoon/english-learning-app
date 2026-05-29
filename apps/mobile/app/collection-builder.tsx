import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
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
  const { token } = useAuth();
  const { collectionId } = useLocalSearchParams<{ collectionId?: string }>();
  const [mode, setMode] = useState<'folder' | 'flashcard'>(collectionId ? 'flashcard' : 'folder');
  const [collections, setCollections] = useState<CollectionSummary[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(collectionId ?? null);
  const [loading, setLoading] = useState(true);

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
    if (!token) {
      return;
    }

    let mounted = true;
    getCollections(token)
      .then((data) => {
        if (mounted) {
          setCollections(data);
          if (!selectedCollectionId && data[0]) {
            setSelectedCollectionId(data[0].id);
          }
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
  }, [token, selectedCollectionId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#55ba5d" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Text style={styles.iconText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tạo nội dung</Text>
        <View style={{ width: 42 }} />
      </View>

      <View style={styles.segment}>
        <TouchableOpacity style={[styles.segmentItem, mode === 'folder' && styles.segmentItemActive]} onPress={() => setMode('folder')}>
          <Text style={[styles.segmentText, mode === 'folder' && styles.segmentTextActive]}>Tạo thư mục</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.segmentItem, mode === 'flashcard' && styles.segmentItemActive]} onPress={() => setMode('flashcard')}>
          <Text style={[styles.segmentText, mode === 'flashcard' && styles.segmentTextActive]}>Tạo flashcard</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {mode === 'folder' ? (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Tạo thư mục mới</Text>
            <TextInput style={styles.input} placeholder="Tên thư mục" value={folderTitle} onChangeText={setFolderTitle} />
            <TextInput style={styles.input} placeholder="Mô tả ngắn" value={folderDescription} onChangeText={setFolderDescription} />
            <View style={styles.filterRow}>
              {folderFilters.map((filter) => (
                <TouchableOpacity
                  key={filter.value}
                  style={[styles.filterChip, folderFilter === filter.value && styles.filterChipActive]}
                  onPress={() => setFolderFilter(filter.value)}>
                  <Text style={[styles.filterChipText, folderFilter === filter.value && styles.filterChipTextActive]}>{filter.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.primaryButton, (!folderTitle || saving) && styles.primaryButtonDisabled]}
              disabled={!folderTitle || saving}
              onPress={async () => {
                if (!token) {
                  return;
                }
                setSaving(true);
                try {
                  const collection = await createCollection(token, {
                    title: folderTitle,
                    description: folderDescription,
                    filter: folderFilter,
                  });
                  setCollections((prev) => [...prev, collection]);
                  setSelectedCollectionId(collection.id);
                  setMode('flashcard');
                } finally {
                  setSaving(false);
                }
              }}>
              <Text style={styles.primaryButtonText}>{saving ? 'Đang tạo...' : 'Tạo thư mục'}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Chọn thư mục</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.collectionChips}>
              {collections.map((collection) => (
                <TouchableOpacity
                  key={collection.id}
                  style={[styles.collectionChip, selectedCollectionId === collection.id && styles.collectionChipActive]}
                  onPress={() => setSelectedCollectionId(collection.id)}>
                  <Text style={[styles.collectionChipText, selectedCollectionId === collection.id && styles.collectionChipTextActive]}>{collection.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TextInput style={styles.input} placeholder="Từ / cụm từ" value={word} onChangeText={setWord} />
            <TextInput style={styles.input} placeholder="Nghĩa tiếng Việt" value={meaning} onChangeText={setMeaning} />
            <TextInput style={styles.input} placeholder="Ví dụ tiếng Anh" value={exampleEnglish} onChangeText={setExampleEnglish} />
            <TextInput style={styles.input} placeholder="Ví dụ tiếng Việt" value={exampleVietnamese} onChangeText={setExampleVietnamese} />
            <TextInput style={[styles.input, styles.noteInput]} placeholder="Ghi chú thêm" value={note} onChangeText={setNote} multiline />

            <TouchableOpacity
              style={[styles.primaryButton, (!selectedCollectionId || !word || !meaning || saving) && styles.primaryButtonDisabled]}
              disabled={!selectedCollectionId || !word || !meaning || saving}
              onPress={async () => {
                if (!token || !selectedCollectionId) {
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
                  router.replace({ pathname: '/(tabs)/collection', params: { collectionId: selectedCollectionId } });
                } finally {
                  setSaving(false);
                }
              }}>
              <Text style={styles.primaryButtonText}>{saving ? 'Đang lưu...' : 'Lưu flashcard'}</Text>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24 },
  iconButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 20, color: '#050018' },
  headerTitle: { fontFamily: Fonts.bold, fontSize: 20, color: '#050018' },
  segment: { marginHorizontal: 24, flexDirection: 'row', backgroundColor: '#f2f0f0', borderRadius: 14, padding: 4, marginBottom: 16 },
  segmentItem: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10 },
  segmentItemActive: { backgroundColor: '#ffffff' },
  segmentText: { fontFamily: Fonts.medium, fontSize: 14, color: '#6c5f80' },
  segmentTextActive: { fontFamily: Fonts.semiBold, color: '#050018' },
  content: { paddingHorizontal: 24, paddingBottom: 32 },
  formCard: { backgroundColor: '#ffffff', borderRadius: 24, padding: 20 },
  formTitle: { fontFamily: Fonts.bold, fontSize: 18, color: '#050018', marginBottom: 16 },
  input: { backgroundColor: '#f8fafc', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, fontFamily: Fonts.regular, fontSize: 14, color: '#050018', marginBottom: 12 },
  noteInput: { minHeight: 110, textAlignVertical: 'top' },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  filterChip: { backgroundColor: '#f2f0f0', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  filterChipActive: { backgroundColor: '#55ba5d' },
  filterChipText: { fontFamily: Fonts.medium, fontSize: 13, color: '#696674' },
  filterChipTextActive: { color: '#ffffff' },
  collectionChips: { gap: 8, marginBottom: 16 },
  collectionChip: { backgroundColor: '#f2f0f0', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  collectionChipActive: { backgroundColor: '#55ba5d' },
  collectionChipText: { fontFamily: Fonts.medium, fontSize: 13, color: '#696674' },
  collectionChipTextActive: { color: '#ffffff' },
  primaryButton: { backgroundColor: '#55ba5d', borderRadius: 999, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  primaryButtonDisabled: { backgroundColor: '#b6d7b9' },
  primaryButtonText: { fontFamily: Fonts.bold, fontSize: 16, color: '#ffffff' },
});
