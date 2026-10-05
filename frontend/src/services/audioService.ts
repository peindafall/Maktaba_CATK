import { api } from './api';
import type { Audio, PaginatedResponse } from '../types';

export const audioService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Audio>>('/audios/', { params }).then((r) => r.data),

  getById: (id: string) =>
    api.get<Audio>(`/audios/${id}/`).then((r) => r.data),

  getPopular: () =>
    api.get<PaginatedResponse<Audio>>('/audios/?ordering=-plays_count').then((r) => r.data),

  getByCategory: (categorySlug: string, params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Audio>>(`/audios/?category__slug=${categorySlug}`, { params }).then((r) => r.data),

  incrementPlay: (id: string) =>
    api.post(`/audios/${id}/play/`).then((r) => r.data),

  incrementDownload: (id: string) =>
    api.post<{ audio_url: string; downloads_count: number; filename: string | null }>(
      `/audios/${id}/download/`
    ).then((r) => r.data),
};
