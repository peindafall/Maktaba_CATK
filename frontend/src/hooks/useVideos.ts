import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { videoService } from '../services/videoService';

export const useVideos = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: ['videos', params],
    queryFn: () => videoService.getAll(params),
    placeholderData: keepPreviousData,
  });

export const useVideo = (id: string) =>
  useQuery({
    queryKey: ['video', id],
    queryFn: () => videoService.getById(id),
    enabled: !!id,
  });

export const useLatestVideos = () =>
  useQuery({
    queryKey: ['videos', 'latest'],
    queryFn: () => videoService.getLatest(),
  });

export const useVideoTypes = () =>
  useQuery({ queryKey: ['video-types'], queryFn: videoService.getTypes, staleTime: 30 * 60 * 1000 });

export const useVideoThemes = () =>
  useQuery({ queryKey: ['video-themes'], queryFn: videoService.getThemes, staleTime: 30 * 60 * 1000 });

export const useIncrementVideoView = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (videoId: string) => videoService.incrementView(videoId),
    onSuccess: (data, videoId) => {
      queryClient.setQueryData(['video', videoId], (old: unknown) =>
        old && typeof old === 'object' ? { ...(old as object), views_count: data.views_count } : old
      );
    },
  });
};
