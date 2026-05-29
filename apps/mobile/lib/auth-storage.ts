import * as SecureStore from 'expo-secure-store';
import { APP_CONFIG } from '../../../shared/constants';

export async function saveToken(token: string) {
  await SecureStore.setItemAsync(APP_CONFIG.TOKEN_KEY, token);
}

export async function getToken() {
  return SecureStore.getItemAsync(APP_CONFIG.TOKEN_KEY);
}

export async function clearToken() {
  await SecureStore.deleteItemAsync(APP_CONFIG.TOKEN_KEY);
}

export async function saveOnboardingComplete() {
  await SecureStore.setItemAsync(APP_CONFIG.ONBOARDING_KEY, 'true');
}

export async function getOnboardingComplete() {
  const value = await SecureStore.getItemAsync(APP_CONFIG.ONBOARDING_KEY);
  return value === 'true';
}
