import { useQuery } from '@tanstack/react-query';
import { teachingService } from '../services/teachingService';

export const useTeachings = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ['teachings', params],
    queryFn: () => teachingService.getAll(params),
  });
};

export const useTeaching = (id: string) => {
  return useQuery({
    queryKey: ['teaching', id],
    queryFn: () => teachingService.getById(id),
    enabled: !!id,
  });
};

export const useFeaturedTeachings = () => {
  return useQuery({
    queryKey: ['teachings', 'featured'],
    queryFn: () => teachingService.getFeatured(),
  });
};
