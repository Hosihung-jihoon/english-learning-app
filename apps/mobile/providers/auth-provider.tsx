import React, { createContext, useContext, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { AuthSession, UserProfile } from '../../../shared/types';
import { clearToken, getOnboardingComplete, getToken, saveOnboardingComplete, saveToken } from '@/lib/auth-storage';
import { getCurrentUser, login, register } from '@/services/auth-service';

type AuthContextValue = {
  token: string | null;
  user: UserProfile | null;
  onboardingComplete: boolean;
  isLoading: boolean;
  signIn: (payload: { email: string; password: string }) => Promise<void>;
  signUp: (payload: { name?: string; email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
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
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        const [storedToken, storedOnboarding] = await Promise.all([getToken(), getOnboardingComplete()]);
        if (!mounted) {
          return;
        }

        setOnboardingComplete(storedOnboarding);

        if (!storedToken) {
          setIsLoading(false);
          return;
        }

        try {
          const currentUser = await getCurrentUser(storedToken);
          if (!mounted) {
            return;
          }
          setToken(storedToken);
          setUser(currentUser);
        } catch {
          await clearToken();
          if (!mounted) {
            return;
          }
          setToken(null);
          setUser(null);
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
    setToken(session.token);
    setUser(session.user);
  };

  const signUp = async (payload: { name?: string; email: string; password: string }) => {
    const session = await register(payload);
    await persistSession(session);
    setToken(session.token);
    setUser(session.user);
  };

  const signOut = async () => {
    await clearToken();
    setToken(null);
    setUser(null);
  };

  const completeOnboarding = async () => {
    await saveOnboardingComplete();
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
        onboardingComplete,
        isLoading,
        signIn,
        signUp,
        signOut,
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
