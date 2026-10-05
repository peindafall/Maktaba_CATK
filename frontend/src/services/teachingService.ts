import { api } from './api';
import type { Teaching, PaginatedResponse } from '../types';

export const teachingService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Teaching>>('/teachings/', { params }).then((r) => r.data),

  getById: (id: string) =>
    api.get<Teaching>(`/teachings/${id}/`).then((r) => r.data),

  getFeatured: () =>
    api.get<PaginatedResponse<Teaching>>('/teachings/?is_featured=true').then((r) => r.data),

  getByCategory: (categorySlug: string, params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Teaching>>(`/teachings/?category__slug=${categorySlug}`, { params }).then((r) => r.data),

  // Téléchargement : on renvoie simplement l'URL de l'action download (GET)
  getDownloadUrl: (id: string) => `${api.defaults.baseURL}/teachings/${id}/download/`,

  // Lecture en ligne : URL de l'action read (GET)
  getReadUrl: (id: string) => `${api.defaults.baseURL}/teachings/${id}/read/`,

  // Incrémenter les vues (POST)
  incrementView: (id: string) => api.post(`/teachings/${id}/view/`),

  // Favoris
  toggleFavorite: (id: string): Promise<{ is_favorited: boolean }> =>
    api.post(`/teachings/${id}/favorite/`).then((r) => r.data),

  getFavorites: () => api.get<Teaching[]>('/teachings/my_favorites/').then((r) => r.data),
};