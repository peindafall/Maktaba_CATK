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

  incrementDownload: (id: string) =>
    api.post(`/teachings/${id}/download/`).then((r) => r.data),
};
