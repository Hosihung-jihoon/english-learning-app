import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Fonts } from '@/constants/theme';

export default function ModalScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const scale = Math.min(width / 375, 1) * 0.92;
  const horizontal = 24 * scale;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Stack.Screen options={{ headerShown: false, presentation: 'modal' }} />

      <View style={[styles.container, { paddingHorizontal: horizontal, paddingTop: 16 * scale }]}>
        <TouchableOpacity style={[styles.closeButton, { width: 42 * scale, height: 42 * scale, borderRadius: 21 * scale }]} onPress={() => router.back()}>
          <Ionicons name="close" size={22 * scale} color="#050018" />
        </TouchableOpacity>

        <View style={[styles.card, { marginTop: 28 * scale, borderRadius: 28 * scale, paddingHorizontal: 24 * scale, paddingVertical: 26 * scale }]}>
          <Text style={[styles.eyebrow, { fontSize: 12 * scale }]}>Hệ thống</Text>
          <Text style={[styles.title, { fontSize: 28 * scale, marginTop: 10 * scale }]}>Thông báo hệ thống</Text>
          <Text style={[styles.description, { fontSize: 15 * scale, lineHeight: 22 * scale, marginTop: 12 * scale }]}>
            Đây là modal mặc định của app. Tôi đã thay boilerplate Expo bằng một màn đồng nhất với visual language hiện tại để không còn cảm giác màn test.
          </Text>

          <TouchableOpacity style={[styles.primaryButton, { borderRadius: 999, marginTop: 24 * scale, paddingVertical: 16 * scale }]} onPress={() => router.replace('/(tabs)')}>
            <Text style={[styles.primaryButtonText, { fontSize: 16 * scale }]}>Về trang chính</Text>
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
  closeButton: {
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
