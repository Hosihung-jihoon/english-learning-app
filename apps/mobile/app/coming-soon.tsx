import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Fonts } from '@/constants/theme';

export default function ComingSoonScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { title } = useLocalSearchParams<{ title?: string }>();
  const scale = Math.min(width / 375, 1) * 0.92;
  const horizontal = 24 * scale;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { paddingHorizontal: horizontal, paddingTop: 16 * scale }]}>
        <TouchableOpacity style={[styles.backButton, { width: 42 * scale, height: 42 * scale, borderRadius: 21 * scale }]} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22 * scale} color="#050018" />
        </TouchableOpacity>

        <View style={[styles.card, { marginTop: 32 * scale, borderRadius: 28 * scale, paddingHorizontal: 24 * scale, paddingVertical: 24 * scale }]}>
          <Text style={[styles.eyebrow, { fontSize: 12 * scale, marginBottom: 10 * scale }]}>Sắp ra mắt</Text>
          <Text style={[styles.title, { fontSize: 28 * scale, marginBottom: 12 * scale }]}>{title ?? 'Flow đang được hoàn thiện'}</Text>
          <Text style={[styles.description, { fontSize: 15 * scale, lineHeight: 22 * scale, marginBottom: 24 * scale }]}>
            Node này đã có trong Figma nhưng chưa nằm trong phạm vi core flow. Màn này được giữ như một placeholder có chủ đích để không còn dead tap.
          </Text>
          <TouchableOpacity style={[styles.primaryButton, { borderRadius: 999, paddingVertical: 16 * scale }]} onPress={() => router.replace('/(tabs)/collection')}>
            <Text style={[styles.primaryButtonText, { fontSize: 16 * scale }]}>Quay lại thư viện</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#faf8f8',
  },
  container: {
    flex: 1,
  },
  backButton: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
  },
  eyebrow: {
    fontFamily: Fonts.bold,
    color: '#55ba5d',
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: Fonts.bold,
    color: '#050018',
  },
  description: {
    fontFamily: Fonts.regular,
    color: '#504d5d',
  },
  primaryButton: {
    backgroundColor: '#55ba5d',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: Fonts.bold,
    color: '#ffffff',
  },
});
