import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore();

  // Helper : après avoir stocké les tokens, si user absent, on va le chercher
  const finalizeLogin = async (data: { access: string; refresh: string; user?: any }) => {
    if (!data?.access || !data?.refresh) {
      throw new Error('Réponse d\'authentification invalide');
    }
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);

    let finalUser = data.user;
    if (!finalUser) {
      // Le backend n'a pas renvoyé l'utilisateur → on va le chercher
      try {
        finalUser = await authService.getProfile();
      } catch (e) {
        console.error('Impossible de récupérer le profil après connexion', e);
      }
    }
    login(finalUser, data.access, data.refresh);
  };

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: finalizeLogin,
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: finalizeLogin,
  });

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        await authService.logout(refreshToken);
      } catch {
        // ignore
      }
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    logout();
  };

  return {
    user,
    isAuthenticated,
    loginMutation,
    registerMutation,
    logout: handleLogout,
  };
};