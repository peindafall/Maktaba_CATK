import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { audioService } from '../services/audioService';

export const useAudios = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ['audios', params],
    queryFn: () => audioService.getAll(params),
  });
};

export const useAudio = (id: string) => {
  return useQuery({
    queryKey: ['audio', id],
    queryFn: () => audioService.getById(id),
    enabled: !!id,
  });
};

export const usePopularAudios = () => {
  return useQuery({
    queryKey: ['audios', 'popular'],
    queryFn: () => audioService.getPopular(),
  });
};

// NOUVEAU : hook qui incrémente le compteur d'écoutes
export const useIncrementAudioPlay = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (audioId: string) => audioService.incrementPlay(audioId),
    onSuccess: (data, audioId) => {
      // Mettre à jour le cache immédiatement
      queryClient.setQueryData(['audio', audioId], (old: unknown) => {
        if (!old || typeof old !== 'object') return old;
        return { ...(old as object), plays_count: (data as { plays_count: number }).plays_count };
      });
      // Invalider la liste pour rafraîchir le tri par popularité
      queryClient.invalidateQueries({ queryKey: ['audios'] });
    },
  });
};

export const useDownloadAudio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (audioId: string) => audioService.incrementDownload(audioId),
    onSuccess: (data, audioId) => {
      queryClient.setQueryData(['audio', audioId], (old: unknown) => {
        if (!old || typeof old !== 'object') return old;
        return { ...(old as object), downloads_count: data.downloads_count };
      });
      queryClient.invalidateQueries({ queryKey: ['audios'] });
    },
  });
};