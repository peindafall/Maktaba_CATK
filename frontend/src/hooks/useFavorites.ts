import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { favoriteService } from '../services/favoriteService';
import { useAuthStore } from '../stores/authStore';
import { toast } from '../stores/toastStore';
import type { FavoriteContentType, FavoriteRef } from '../types';

export const FAVORITES_KEY = ['favorites'] as const;
const keyOf = (type: FavoriteContentType, id: string) => `${type}:${id}`;

/**
 * Une SEULE requête pour tous les cœurs de la page (avant : 1 requête par carte => lenteur),
 * et mise à jour « optimiste » : le cœur change instantanément, la requête part en arrière-plan.
 */
export const useFavorites = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data } = useQuery({
    queryKey: FAVORITES_KEY,
    queryFn: favoriteService.list,
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000,
  });

  const favoriteSet = useMemo(
    () => new Set((data ?? []).map((f) => keyOf(f.content_type, String(f.content_id)))),
    [data]
  );

  const mutation = useMutation({
    mutationFn: ({ type, id }: { type: FavoriteContentType; id: string; title?: string }) =>
      favoriteService.toggle(type, id),
    onMutate: async ({ type, id, title }) => {
      await queryClient.cancelQueries({ queryKey: FAVORITES_KEY });
      const previous = queryClient.getQueryData<FavoriteRef[]>(FAVORITES_KEY) ?? [];
      const exists = previous.some((f) => f.content_type === type && String(f.content_id) === id);
      const next = exists
        ? previous.filter((f) => !(f.content_type === type && String(f.content_id) === id))
        : [{ id: `tmp-${id}`, content_type: type, content_id: id, title }, ...previous];
      queryClient.setQueryData(FAVORITES_KEY, next);
      toast.success(exists ? t('favorites.removed') : t('favorites.added'), { duration: 1800 });
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(FAVORITES_KEY, ctx.previous);
      toast.error(t('favorites.error'));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_KEY });
      queryClient.invalidateQueries({ queryKey: ['favorites-detailed'] });
    },
  });

  const isFavorite = useCallback(
    (type: FavoriteContentType, id: string) => favoriteSet.has(keyOf(type, id)),
    [favoriteSet]
  );

  const toggleFavorite = useCallback(
    (type: FavoriteContentType, id: string, title?: string) => {
      if (!isAuthenticated) {
        toast.info(t('favorites.login_required'), {
          action: { label: t('nav.login'), onClick: () => navigate('/connexion') },
        });
        return;
      }
      mutation.mutate({ type, id, title });
    },
    [isAuthenticated, mutation, navigate, t]
  );

  return { isFavorite, toggleFavorite, count: data?.length ?? 0 };
};

export const useFavoritesDetailed = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ['favorites-detailed'],
    queryFn: favoriteService.detailed,
    enabled: isAuthenticated,
  });
};
