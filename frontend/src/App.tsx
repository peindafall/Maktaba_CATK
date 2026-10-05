import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout/Layout';
import { AudioPlayer } from './components/audio/AudioPlayer';
import { PageLoader } from './components/common/Spinner';
import { useUIStore } from './stores/uiStore';
import './i18n/config';

// Lazy-loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const TeachingsPage = lazy(() => import('./pages/TeachingsPage'));
const TeachingDetailPage = lazy(() => import('./pages/TeachingDetailPage'));
const AudiosPage = lazy(() => import('./pages/AudiosPage'));
const AudioDetailPage = lazy(() => import('./pages/AudioDetailPage'));
const VideosPage = lazy(() => import('./pages/VideosPage'));
const VideoDetailPage = lazy(() => import('./pages/VideoDetailPage'));
const QuestionsPage = lazy(() => import('./pages/QuestionsPage'));
const QuestionDetailPage = lazy(() => import('./pages/QuestionDetailPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => {
  // On sélectionne uniquement isDarkMode pour éviter les re-renders inutiles
  const isDarkMode = useUIStore((s) => s.isDarkMode);

  // Source unique de vérité : on applique/retire la classe "dark" sur <html>
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/connexion" element={<LoginPage />} />
          <Route path="/inscription" element={<RegisterPage />} />

          <Route
            path="/*"
            element={
              <Layout>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/enseignements" element={<TeachingsPage />} />
                    <Route path="/enseignements/:id" element={<TeachingDetailPage />} />
                    <Route path="/audios" element={<AudiosPage />} />
                    <Route path="/audios/:id" element={<AudioDetailPage />} />
                    <Route path="/videos" element={<VideosPage />} />
                    <Route path="/videos/:id" element={<VideoDetailPage />} />
                    <Route path="/questions" element={<QuestionsPage />} />
                    <Route path="/questions/:id" element={<QuestionDetailPage />} />
                    <Route path="/recherche" element={<SearchPage />} />
                    <Route path="/profil" element={<ProfilePage />} />
                    <Route path="/favoris" element={<FavoritesPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </Layout>
            }
          />
        </Routes>
      </Suspense>

      <AudioPlayer />
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppContent />
  </QueryClientProvider>
);

export default App;