import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionService, type AskQuestionPayload } from '../services/questionService';
import { useAuthStore } from '../stores/authStore';

export const useQuestions = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ['questions', params],
    queryFn: () => questionService.getAll(params),
    placeholderData: keepPreviousData,
  });

export const useQuestion = (id: string) =>
  useQuery({
    queryKey: ['question', id],
    queryFn: () => questionService.getById(id),
    enabled: !!id,
  });

export const useLatestQuestions = () =>
  useQuery({
    queryKey: ['questions', 'latest'],
    queryFn: () => questionService.getLatest(),
  });

export const useQuestionCategories = (enabled = true) =>
  useQuery({
    queryKey: ['categories'],
    queryFn: questionService.categories,
    staleTime: 30 * 60 * 1000,
    enabled,
  });

export const useMyQuestions = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({ queryKey: ['my-questions'], queryFn: questionService.mine, enabled: isAuthenticated });
};

export const useAskQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AskQuestionPayload) => questionService.ask(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-questions'] }),
  });
};

export const useIncrementQuestionView = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (questionId: string) => questionService.incrementView(questionId),
    onSuccess: (data, questionId) => {
      queryClient.setQueryData(['question', questionId], (old: unknown) =>
        old && typeof old === 'object' ? { ...(old as object), views_count: data.views_count } : old
      );
    },
  });
};
