import { api } from './api';
import type { User } from '../types';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  password_confirm: string;
  preferred_language?: string;
}

interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

// Le backend peut renvoyer soit { user, access, refresh }
// soit { user, tokens: { access, refresh } } soit { access, refresh } (sans user)
const normalizeAuthResponse = (data: any): AuthResponse => {
  if (data.tokens) {
    return { user: data.user, access: data.tokens.access, refresh: data.tokens.refresh };
  }
  return { user: data.user ?? null, access: data.access, refresh: data.refresh };
};

export const authService = {
  login: (payload: LoginPayload) =>
    api.post('/auth/login/', payload).then((r) => normalizeAuthResponse(r.data)),

  register: (payload: RegisterPayload) =>
    api.post('/auth/register/', payload).then((r) => normalizeAuthResponse(r.data)),

  logout: (refreshToken: string) =>
    api.post('/auth/logout/', { refresh: refreshToken }),

  // ✅ Corrigé : l'endpoint est /users/me/ et non /auth/me/
  getProfile: () =>
    api.get<User>('/users/me/').then((r) => r.data),

  updateProfile: (data: Partial<User>) =>
    api.patch<User>('/users/me/', data).then((r) => r.data),

  changePassword: (data: { old_password: string; new_password: string }) =>
    api.post('/users/change_password/', data).then((r) => r.data),
};