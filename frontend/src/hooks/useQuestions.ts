import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

export const useIncrementQuestionView = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionId: string) => questionService.incrementView(questionId),
    onSuccess: (data, questionId) => {
      queryClient.setQueryData(['question', questionId], (old: unknown) => {
        if (!old || typeof old !== 'object') return old;
        return { ...(old as object), views_count: (data as { views_count: number }).views_count };
      });
    },
  });
};