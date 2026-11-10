import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { teachingService } from '../services/teachingService';

export const useTeachings = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ['teachings', params],
    queryFn: () => teachingService.getAll(params),
    placeholderData: keepPreviousData,
  });

export const useTeaching = (id: string) =>
  useQuery({
    queryKey: ['teaching', id],
    queryFn: () => teachingService.getById(id),
    enabled: !!id,
  });

export const useFeaturedTeachings = () =>
  useQuery({
    queryKey: ['teachings', 'featured'],
    queryFn: () => teachingService.getFeatured(),
  });
