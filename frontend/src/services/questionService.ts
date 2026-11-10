import { api } from './api';
import type { CategoryInfo, MyQuestion, PaginatedResponse, Question } from '../types';

export interface AskQuestionPayload {
  title: string;
  question: string;
  category?: string | null;
  name?: string;
  email?: string;
  language: string;
  website?: string; // champ piège anti-robot (doit rester vide)
}

export const questionService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Question>>('/questions/', { params }).then((r) => r.data),

  getById: (id: string) => api.get<Question>(`/questions/${id}/`).then((r) => r.data),

  getLatest: () =>
    api.get<PaginatedResponse<Question>>('/questions/', { params: { ordering: '-created_at', page_size: 4 } }).then((r) => r.data),

  incrementView: (id: string) => api.post<{ views_count: number }>(`/questions/${id}/view/`).then((r) => r.data),

  ask: (payload: AskQuestionPayload) =>
    api.post<{ id: string; detail: string }>('/questions/ask/', payload).then((r) => r.data),

  mine: () => api.get<MyQuestion[]>('/questions/mine/').then((r) => r.data),

  categories: () =>
    api.get<PaginatedResponse<CategoryInfo> | CategoryInfo[]>('/categories/').then((r) =>
      Array.isArray(r.data) ? r.data : r.data.results
    ),
};
