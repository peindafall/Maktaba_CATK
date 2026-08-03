import { useQuery } from '@tanstack/react-query';
import { searchService } from '../services/searchService';

export const useSearch = (query: string, params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ['search', query, params],
    queryFn: () => searchService.search(query, params),
    enabled: !!query && query.length >= 2,
  });
};
