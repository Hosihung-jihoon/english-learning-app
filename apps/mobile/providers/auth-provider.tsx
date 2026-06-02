import React, { createContext, useContext, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { AuthSession, UserProfile } from '../../../shared/types';
import {
  clearLegacyOnboardingComplete,
  clearToken,
  getLegacyOnboardingComplete,
  getIntroComplete,
  getOnboardingComplete,
  hasOnboardingRecord,
  getToken,
  saveIntroComplete,
  saveOnboardingComplete,
  saveOnboardingIncomplete,
  saveToken,
} from '@/lib/auth-storage';
import { getCurrentUser, login, register } from '@/services/auth-service';

type AuthContextValue = {
  token: string | null;
  user: UserProfile | null;
  introComplete: boolean;
  onboardingComplete: boolean;
  isLoading: boolean;
  signIn: (payload: { email: string; password: string }) => Promise<boolean>;
  signUp: (payload: { name?: string; email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  completeIntro: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function persistSession(session: AuthSession) {
  await saveToken(session.token);
  return session;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [introComplete, setIntroComplete] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        const [storedToken, storedIntro] = await Promise.all([getToken(), getIntroComplete()]);
        if (!mounted) {
          return;
        }

        setIntroComplete(storedIntro);

        if (!storedToken) {
          setOnboardingComplete(false);
          setIsLoading(false);
          return;
        }

        try {
          const currentUser = await getCurrentUser(storedToken);
          if (!mounted) {
            return;
          }
          if (!storedIntro) {
            await saveIntroComplete();
            if (!mounted) {
              return;
            }
            setIntroComplete(true);
          }
          let storedOnboarding = await getOnboardingComplete(currentUser.id);
          const hasUserScopedOnboarding = await hasOnboardingRecord(currentUser.id);
          if (!hasUserScopedOnboarding) {
            const legacyOnboarding = await getLegacyOnboardingComplete();
            if (legacyOnboarding) {
              await saveOnboardingComplete(currentUser.id);
              await clearLegacyOnboardingComplete();
              storedOnboarding = true;
            }
          }
          if (currentUser.email === 'hosihung2@gmail.com') {
            storedOnboarding = true;
          }
          if (!mounted) {
            return;
          }
          setToken(storedToken);
          setUser(currentUser);
          setOnboardingComplete(storedOnboarding);
        } catch {
          await clearToken();
          if (!mounted) {
            return;
          }
          setToken(null);
          setUser(null);
          setOnboardingComplete(false);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async (payload: { email: string; password: string }) => {
    const session = await login(payload);
    await persistSession(session);
    let storedOnboarding = await getOnboardingComplete(session.user.id);
    if (session.user.email === 'hosihung2@gmail.com') {
      storedOnboarding = true;
    }
    setToken(session.token);
    setUser(session.user);
    setOnboardingComplete(storedOnboarding);
    return storedOnboarding;
  };

  const signUp = async (payload: { name?: string; email: string; password: string }) => {
    const session = await register(payload);
    await persistSession(session);
    let storedOnboarding = false;
    if (session.user.email === 'hosihung2@gmail.com') {
      storedOnboarding = true;
    } else {
      await saveOnboardingIncomplete(session.user.id);
    }
    setToken(session.token);
    setUser(session.user);
    setOnboardingComplete(storedOnboarding);
  };

  const signOut = async () => {
    await clearToken();
    setToken(null);
    setUser(null);
    setOnboardingComplete(false);
  };

  const completeIntro = async () => {
    await saveIntroComplete();
    setIntroComplete(true);
  };

  const completeOnboarding = async () => {
    if (!user) {
      return;
    }
    await saveOnboardingComplete(user.id);
    setOnboardingComplete(true);
  };

  const refreshUser = async () => {
    if (!token) {
      return;
    }
    const currentUser = await getCurrentUser(token);
    setUser(currentUser);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        introComplete,
        onboardingComplete,
        isLoading,
        signIn,
        signUp,
        signOut,
        completeIntro,
        completeOnboarding,
        refreshUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
