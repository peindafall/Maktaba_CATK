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

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>('/auth/login/', payload).then((r) => r.data),

  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>('/auth/register/', payload).then((r) => r.data),

  logout: (refreshToken: string) =>
    api.post('/auth/logout/', { refresh: refreshToken }),

  getProfile: () =>
    api.get<User>('/auth/me/').then((r) => r.data),

  updateProfile: (data: Partial<User>) =>
    api.patch<User>('/auth/me/', data).then((r) => r.data),

  changePassword: (data: { old_password: string; new_password: string }) =>
    api.post('/auth/change-password/', data).then((r) => r.data),
};
