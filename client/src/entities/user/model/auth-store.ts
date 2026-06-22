import { create } from 'zustand';

import type { AuthUser, LoginUserResponse } from './user.type';

const AUTH_STORAGE_KEY = 'shopping-mall-auth';

export type AuthSession = {
  accessToken: string;
  tokenType: 'Bearer';
  expiresAt: number;
  user: AuthUser;
};

type AuthState = {
  session: AuthSession | null;
  hydrateAuth: () => void;
  login: (response: LoginUserResponse, remember: boolean) => void;
  logout: () => void;
};

const isBrowser = () => typeof window !== 'undefined';

const removeStoredSession = () => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
};

const readStoredSession = (): AuthSession | null => {
  if (!isBrowser()) {
    return null;
  }

  const stored =
    window.localStorage.getItem(AUTH_STORAGE_KEY) ??
    window.sessionStorage.getItem(AUTH_STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    const session = JSON.parse(stored) as AuthSession;

    if (!session.accessToken || !session.user || session.expiresAt <= Date.now()) {
      removeStoredSession();
      return null;
    }

    return session;
  } catch {
    removeStoredSession();
    return null;
  }
};

const writeStoredSession = (session: AuthSession, remember: boolean) => {
  if (!isBrowser()) {
    return;
  }

  removeStoredSession();

  const storage = remember ? window.localStorage : window.sessionStorage;
  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  hydrateAuth: () => {
    set({ session: readStoredSession() });
  },
  login: (response, remember) => {
    const session: AuthSession = {
      accessToken: response.accessToken,
      tokenType: response.tokenType,
      expiresAt: Date.now() + response.expiresIn * 1000,
      user: response.user,
    };

    writeStoredSession(session, remember);
    set({ session });
  },
  logout: () => {
    removeStoredSession();
    set({ session: null });
  },
}));
