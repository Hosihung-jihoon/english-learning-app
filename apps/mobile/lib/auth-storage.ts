import * as SecureStore from 'expo-secure-store';
import { APP_CONFIG } from '../../../shared/constants';

function getOnboardingUserKey(userId: string) {
  // SecureStore only allows alphanumeric, ".", "-", "_" — no colons allowed.
  const safeId = userId.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${APP_CONFIG.ONBOARDING_KEY}_${safeId}`;
}

export async function saveToken(token: string) {
  await SecureStore.setItemAsync(APP_CONFIG.TOKEN_KEY, token);
}

export async function getToken() {
  return SecureStore.getItemAsync(APP_CONFIG.TOKEN_KEY);
}

export async function clearToken() {
  await SecureStore.deleteItemAsync(APP_CONFIG.TOKEN_KEY);
}

export async function saveIntroComplete() {
  await SecureStore.setItemAsync(APP_CONFIG.INTRO_KEY, 'true');
}

export async function getIntroComplete() {
  const value = await SecureStore.getItemAsync(APP_CONFIG.INTRO_KEY);
  return value === 'true';
}

export async function saveOnboardingComplete(userId: string) {
  await SecureStore.setItemAsync(getOnboardingUserKey(userId), 'true');
}

export async function saveOnboardingIncomplete(userId: string) {
  await SecureStore.setItemAsync(getOnboardingUserKey(userId), 'false');
}

export async function getOnboardingComplete(userId: string) {
  const userScopedValue = await SecureStore.getItemAsync(getOnboardingUserKey(userId));
  return userScopedValue === 'true';
}

export async function hasOnboardingRecord(userId: string) {
  const userScopedValue = await SecureStore.getItemAsync(getOnboardingUserKey(userId));
  return userScopedValue !== null;
}

export async function getLegacyOnboardingComplete() {
  const legacyValue = await SecureStore.getItemAsync(APP_CONFIG.ONBOARDING_KEY);
  return legacyValue === 'true';
}

export async function clearLegacyOnboardingComplete() {
  await SecureStore.deleteItemAsync(APP_CONFIG.ONBOARDING_KEY);
}
