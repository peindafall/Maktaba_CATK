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

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User | null;
}

// Le backend renvoie { user, access, refresh } (login) ou { user, tokens: { access, refresh } } (register)
const normalizeAuthResponse = (data: any): AuthResponse => {
  if (data?.tokens) {
    return { user: data.user ?? null, access: data.tokens.access, refresh: data.tokens.refresh };
  }
  return { user: data?.user ?? null, access: data?.access, refresh: data?.refresh };
};

export const authService = {
  login: (payload: LoginPayload) =>
    api.post('/auth/login/', { ...payload, email: payload.email.trim() }).then((r) => normalizeAuthResponse(r.data)),

  register: (payload: RegisterPayload) =>
    api
      .post('/auth/register/', { ...payload, email: payload.email.trim().toLowerCase(), username: payload.username.trim() })
      .then((r) => normalizeAuthResponse(r.data)),

  logout: (refreshToken: string) => api.post('/auth/logout/', { refresh: refreshToken }),

  getProfile: () => api.get<User>('/users/me/').then((r) => r.data),

  updateProfile: (data: Partial<User>) => api.patch<User>('/users/me/', data).then((r) => r.data),

  changePassword: (data: { old_password: string; new_password: string }) =>
    api.post('/users/change_password/', data).then((r) => r.data),

  requestPasswordReset: (email: string) =>
    api.post('/auth/reset-password/', { email: email.trim() }).then((r) => r.data),

  confirmPasswordReset: (token: string, new_password: string) =>
    api.post('/auth/reset-password/confirm/', { token, new_password }).then((r) => r.data),
};
