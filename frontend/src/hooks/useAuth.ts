import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, type AuthResponse } from '../services/authService';
import { tokenStorage } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import i18n from '../i18n/config';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const storeLogin = useAuthStore((s) => s.login);
  const storeLogout = useAuthStore((s) => s.logout);

  const finalizeLogin = async (data: AuthResponse) => {
    if (!data?.access || !data?.refresh) {
      throw new Error('Réponse d\'authentification invalide');
    }
    tokenStorage.set(data.access, data.refresh);
    let finalUser = data.user;
    if (!finalUser) {
      try {
        finalUser = await authService.getProfile();
      } catch {
        finalUser = null;
      }
    }
    storeLogin(finalUser);
    queryClient.invalidateQueries({ queryKey: ['favorites'] });
  };

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: finalizeLogin,
  });

  const registerMutation = useMutation({
    mutationFn: (payload: Parameters<typeof authService.register>[0]) =>
      authService.register({ ...payload, preferred_language: (i18n.resolvedLanguage || 'fr').split('-')[0] }),
    onSuccess: finalizeLogin,
  });

  const logout = async () => {
    const refreshToken = tokenStorage.getRefresh();
    tokenStorage.clear();
    storeLogout();
    // On vide les données privées (favoris, mes questions…) du cache
    queryClient.removeQueries({ queryKey: ['favorites'] });
    queryClient.removeQueries({ queryKey: ['favorites-detailed'] });
    queryClient.removeQueries({ queryKey: ['my-questions'] });
    if (refreshToken) {
      authService.logout(refreshToken).catch(() => {}); // invalide le token côté serveur
    }
  };

  return { user, isAuthenticated, loginMutation, registerMutation, logout };
};
