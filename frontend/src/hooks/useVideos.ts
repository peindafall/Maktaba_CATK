import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { videoService } from '../services/videoService';

export const useVideos = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ['videos', params],
    queryFn: () => videoService.getAll(params),
  });
};

export const useVideo = (id: string) => {
  return useQuery({
    queryKey: ['video', id],
    queryFn: () => videoService.getById(id),
    enabled: !!id,
  });
};

export const useLatestVideos = () => {
  return useQuery({
    queryKey: ['videos', 'latest'],
    queryFn: () => videoService.getLatest(),
  });
};

// ✅ NOUVEAU : hook qui incrémente les vues et met à jour le cache
export const useIncrementVideoView = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (videoId: string) => videoService.incrementView(videoId),
    onSuccess: (data, videoId) => {
      // Met à jour immédiatement le cache React Query
      queryClient.setQueryData(['video', videoId], (old: unknown) => {
        if (!old || typeof old !== 'object') return old;
        return { ...(old as object), views_count: data.views_count };
      });
    },
  });
};