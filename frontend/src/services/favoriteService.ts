import { api } from './api';
import type { FavoriteContentType, FavoriteRef, FavoritesDetailed } from '../types';

export const favoriteService = {
  /** Liste légère : sert uniquement à savoir quels cœurs sont « pleins ». */
  list: () => api.get<FavoriteRef[]>('/favorites/').then((r) => r.data),

  toggle: (content_type: FavoriteContentType, content_id: string) =>
    api
      .post<{ is_favorited: boolean }>('/favorites/toggle/', { content_type, content_id })
      .then((r) => r.data),

  detailed: () => api.get<FavoritesDetailed>('/favorites/detailed/').then((r) => r.data),
};
