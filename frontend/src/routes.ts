import { lazy } from 'react';

/**
 * Chaque page est chargée à la demande (code splitting), PUIS préchargée en arrière-plan
 * dès que la page d'accueil est affichée (voir prefetchAllPages). Résultat : quand on
 * touche un onglet, la page s'affiche immédiatement au lieu d'attendre son téléchargement.
 */
const loaders = {
  HomePage: () => import('./pages/HomePage'),
  TeachingsPage: () => import('./pages/TeachingsPage'),
  TeachingDetailPage: () => import('./pages/TeachingDetailPage'),
  AudiosPage: () => import('./pages/AudiosPage'),
  AudioDetailPage: () => import('./pages/AudioDetailPage'),
  VideosPage: () => import('./pages/VideosPage'),
  VideoDetailPage: () => import('./pages/VideoDetailPage'),
  QuestionsPage: () => import('./pages/QuestionsPage'),
  QuestionDetailPage: () => import('./pages/QuestionDetailPage'),
  SearchPage: () => import('./pages/SearchPage'),
  ProfilePage: () => import('./pages/ProfilePage'),
  FavoritesPage: () => import('./pages/FavoritesPage'),
  LoginPage: () => import('./pages/LoginPage'),
  RegisterPage: () => import('./pages/RegisterPage'),
  ForgotPasswordPage: () => import('./pages/ForgotPasswordPage'),
  ResetPasswordPage: () => import('./pages/ResetPasswordPage'),
  VerifyEmailPage: () => import('./pages/VerifyEmailPage'),
  NotFoundPage: () => import('./pages/NotFoundPage'),
};

export const Pages = Object.fromEntries(
  Object.entries(loaders).map(([name, loader]) => [name, lazy(loader)])
) as unknown as { [K in keyof typeof loaders]: ReturnType<typeof lazy> };

let prefetched = false;
export const prefetchAllPages = () => {
  if (prefetched) return;
  prefetched = true;
  const run = () => Object.values(loaders).forEach((load) => load().catch(() => {}));
  const w = window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number };
  if (w.requestIdleCallback) w.requestIdleCallback(run, { timeout: 3000 });
  else setTimeout(run, 1500);
};
