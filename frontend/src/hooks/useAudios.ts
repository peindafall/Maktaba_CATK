import { useQuery } from '@tanstack/react-query';
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
