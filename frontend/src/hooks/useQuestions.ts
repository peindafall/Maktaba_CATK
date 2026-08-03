import { useQuery } from '@tanstack/react-query';
import { questionService } from '../services/questionService';

export const useQuestions = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ['questions', params],
    queryFn: () => questionService.getAll(params),
  });
};

export const useQuestion = (id: string) => {
  return useQuery({
    queryKey: ['question', id],
    queryFn: () => questionService.getById(id),
    enabled: !!id,
  });
};

export const useLatestQuestions = () => {
  return useQuery({
    queryKey: ['questions', 'latest'],
    queryFn: () => questionService.getLatest(),
  });
};
