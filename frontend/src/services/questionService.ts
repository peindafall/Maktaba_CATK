import { api } from './api';
import type { Question, PaginatedResponse } from '../types';

export const questionService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Question>>('/questions/', { params }).then((r) => r.data),

  getById: (id: string) =>
    api.get<Question>(`/questions/${id}/`).then((r) => r.data),

  getLatest: () =>
    api.get<PaginatedResponse<Question>>('/questions/?ordering=-created_at').then((r) => r.data),

  getByCategory: (categorySlug: string, params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Question>>(`/questions/?category__slug=${categorySlug}`, { params }).then((r) => r.data),
};
