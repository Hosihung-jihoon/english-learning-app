import type { AuthSession, UserProfile } from '../../../shared/types';

const MOCK_USER: UserProfile = {
  id: '507f1f77bcf86cd799439011',
  name: 'Hồ Sĩ Hùng',
  email: 'hosihung2@gmail.com',
  role: 'student',
  createdAt: new Date().toISOString(),
  planLabel: 'Premium Student',
  scoreLabel: '1200 XP',
};

const MOCK_TOKEN = 'mock-jwt-token-for-hosihung2';

export async function register(payload: { name?: string; email: string; password: string }): Promise<AuthSession> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (payload.email.toLowerCase() !== 'hosihung2@gmail.com' || payload.password !== '123456') {
    throw new Error('Đăng ký không thành công. Hãy nhập email hosihung2@gmail.com và mật khẩu 123456.');
  }

  return {
    token: MOCK_TOKEN,
    user: {
      ...MOCK_USER,
      name: payload.name || 'Hồ Sĩ Hùng',
    },
  };
}

export async function login(payload: { email: string; password: string }): Promise<AuthSession> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (payload.email.toLowerCase() !== 'hosihung2@gmail.com' || payload.password !== '123456') {
    throw new Error('Sai tài khoản hoặc mật khẩu. Vui lòng dùng hosihung2@gmail.com / 123456.');
  }

  return {
    token: MOCK_TOKEN,
    user: MOCK_USER,
  };
}

export async function getCurrentUser(token: string): Promise<UserProfile> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  // In offline mode, map any token to MOCK_USER to avoid token mismatch crashes
  return MOCK_USER;
}
