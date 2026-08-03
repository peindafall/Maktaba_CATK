import { api } from './api';
import type { Video, PaginatedResponse } from '../types';

export const videoService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Video>>('/videos/', { params }).then((r) => r.data),

  getById: (id: string) =>
    api.get<Video>(`/videos/${id}/`).then((r) => r.data),

  getLatest: () =>
    api.get<PaginatedResponse<Video>>('/videos/?ordering=-published_at').then((r) => r.data),

  getByCategory: (categorySlug: string, params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Video>>(`/videos/?category__slug=${categorySlug}`, { params }).then((r) => r.data),
};
