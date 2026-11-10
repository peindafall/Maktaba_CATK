import { api, API_BASE_URL } from './api';
import type { Teaching, PaginatedResponse } from '../types';

export const teachingService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Teaching>>('/teachings/', { params }).then((r) => r.data),

  getById: (id: string) => api.get<Teaching>(`/teachings/${id}/`).then((r) => r.data),

  getFeatured: () =>
    api.get<PaginatedResponse<Teaching>>('/teachings/', { params: { is_featured: true, page_size: 4 } }).then((r) => r.data),

  // Téléchargement : le serveur renvoie le PDF en pièce jointe et incrémente le compteur
  getDownloadUrl: (id: string) => `${API_BASE_URL}/teachings/${id}/download/`,

  // Lecture en ligne (inline)
  getReadUrl: (id: string) => `${API_BASE_URL}/teachings/${id}/read/`,

  incrementView: (id: string) => api.post<{ views_count: number }>(`/teachings/${id}/view/`).then((r) => r.data),
};
