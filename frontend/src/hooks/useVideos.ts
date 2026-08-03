import { useQuery } from '@tanstack/react-query';
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
