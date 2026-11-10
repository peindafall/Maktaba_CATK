import { api } from './api';
import type { CategoryInfo, PaginatedResponse, Video } from '../types';

export interface VideoTypeCount {
  value: string;
  label: string;
  count: number;
}

export const videoService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Video>>('/videos/', { params }).then((r) => r.data),

  getById: (id: string) => api.get<Video>(`/videos/${id}/`).then((r) => r.data),

  getLatest: () =>
    api.get<PaginatedResponse<Video>>('/videos/', { params: { ordering: '-published_at', page_size: 4 } }).then((r) => r.data),

  getTypes: () => api.get<VideoTypeCount[]>('/videos/types/').then((r) => r.data),

  getThemes: () => api.get<CategoryInfo[]>('/video-themes/').then((r) => r.data),

  incrementView: (id: string) => api.post<{ views_count: number }>(`/videos/${id}/view/`).then((r) => r.data),
};
