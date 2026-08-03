import { api } from './api';
import type { SearchResult } from '../types';

export const searchService = {
  search: (query: string, params?: Record<string, unknown>) =>
    api.get<SearchResult>('/search/', { params: { q: query, ...params } }).then((r) => r.data),

  suggest: (query: string) =>
    api.get<string[]>('/search/suggest/', { params: { q: query } }).then((r) => r.data),
};
