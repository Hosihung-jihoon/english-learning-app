import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Fonts } from '@/constants/theme';

export default function ComingSoonScreen() {
  const router = useRouter();
  const { title } = useLocalSearchParams<{ title?: string }>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#050018" />
        </TouchableOpacity>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>Coming Soon</Text>
          <Text style={styles.title}>{title ?? 'Flow đang được hoàn thiện'}</Text>
          <Text style={styles.description}>
            Node này đã có trong Figma nhưng chưa nằm trong phạm vi core flow. Màn này được giữ như
            một placeholder có chủ đích để không còn dead tap.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/(tabs)/collection')}>
            <Text style={styles.primaryButtonText}>Quay lại thư viện</Text>
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
    padding: 24,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    marginTop: 32,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 24,
  },
  eyebrow: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    color: '#55ba5d',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    color: '#050018',
    marginBottom: 12,
  },
  description: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: '#504d5d',
    lineHeight: 22,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#55ba5d',
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: '#ffffff',
  },
});
