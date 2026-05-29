import type { AuthSession, UserProfile } from '../../../shared/types';
import { API_ROUTES, apiRequest } from '@/lib/api';

export function register(payload: { name?: string; email: string; password: string }) {
  return apiRequest<AuthSession>(API_ROUTES.AUTH_REGISTER, {
    method: 'POST',
    body: payload,
  });
}

export function login(payload: { email: string; password: string }) {
  return apiRequest<AuthSession>(API_ROUTES.AUTH_LOGIN, {
    method: 'POST',
    body: payload,
  });
}

export function getCurrentUser(token: string) {
  return apiRequest<UserProfile>(API_ROUTES.AUTH_ME, { token });
}
