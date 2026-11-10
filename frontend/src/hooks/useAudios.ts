import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { audioService } from '../services/audioService';

export const useAudios = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ['audios', params],
    queryFn: () => audioService.getAll(params),
    placeholderData: keepPreviousData,
  });

export const useAudio = (id: string) =>
  useQuery({
    queryKey: ['audio', id],
    queryFn: () => audioService.getById(id),
    enabled: !!id,
  });

export const usePopularAudios = () =>
  useQuery({
    queryKey: ['audios', 'popular'],
    queryFn: () => audioService.getPopular(),
  });

export const useIncrementAudioPlay = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (audioId: string) => audioService.incrementPlay(audioId),
    onSuccess: (data, audioId) => {
      queryClient.setQueryData(['audio', audioId], (old: unknown) =>
        old && typeof old === 'object' ? { ...(old as object), plays_count: data.plays_count } : old
      );
    },
  });
};
