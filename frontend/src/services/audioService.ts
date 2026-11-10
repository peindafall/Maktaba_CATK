import { api, API_BASE_URL } from './api';
import type { Audio, PaginatedResponse } from '../types';

export const audioService = {
  getAll: (params?: Record<string, unknown>) =>
    api.get<PaginatedResponse<Audio>>('/audios/', { params }).then((r) => r.data),

  getById: (id: string) => api.get<Audio>(`/audios/${id}/`).then((r) => r.data),

  getPopular: () =>
    api.get<PaginatedResponse<Audio>>('/audios/', { params: { ordering: '-plays_count', page_size: 4 } }).then((r) => r.data),

  incrementPlay: (id: string) => api.post<{ plays_count: number }>(`/audios/${id}/play/`).then((r) => r.data),

  /** URL GET qui renvoie le fichier en pièce jointe (et compte le téléchargement côté serveur). */
  getDownloadUrl: (id: string) => `${API_BASE_URL}/audios/${id}/download/`,
};
