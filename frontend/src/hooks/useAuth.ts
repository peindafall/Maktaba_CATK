import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      login(data.user, data.access, data.refresh);
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      login(data.user, data.access, data.refresh);
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
    },
  });

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        await authService.logout(refreshToken);
      } catch {
        // ignore errors on logout
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
