import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout/Layout';
import { AudioPlayer } from './components/audio/AudioPlayer';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { Toaster } from './components/common/Toaster';
import { DownloadHelpModal } from './components/common/DownloadHelpModal';
import { useUIStore } from './stores/uiStore';
import { useAuthStore } from './stores/authStore';
import { warmUpServer } from './services/api';
import { Pages, prefetchAllPages } from './routes';
import './i18n/config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const {
  HomePage, TeachingsPage, TeachingDetailPage, AudiosPage, AudioDetailPage, VideosPage,
  VideoDetailPage, QuestionsPage, QuestionDetailPage, SearchPage, ProfilePage, FavoritesPage,
  LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage, VerifyEmailPage, NotFoundPage,
} = Pages;

/** Pages réservées aux membres connectés : sinon redirection vers la connexion puis retour. */
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/connexion" replace state={{ from: location.pathname + location.search }} />;
  }
  return children;
};

const AppContent = () => {
  const isDarkMode = useUIStore((s) => s.isDarkMode);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', isDarkMode);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDarkMode ? '#121212' : '#1EA478');
  }, [isDarkMode]);

  useEffect(() => {
    warmUpServer(); // réveille Render pendant que la page s'affiche
    prefetchAllPages(); // précharge toutes les pages => changement d'onglet instantané
  }, []);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <Layout>
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
          <Route path="/profil" element={<RequireAuth><ProfilePage /></RequireAuth>} />
          <Route path="/favoris" element={<RequireAuth><FavoritesPage /></RequireAuth>} />
          <Route path="/connexion" element={<LoginPage />} />
          <Route path="/inscription" element={<RegisterPage />} />
          <Route path="/mot-de-passe-oublie" element={<ForgotPasswordPage />} />
          <Route path="/reinitialiser-mot-de-passe" element={<ResetPasswordPage />} />
          <Route path="/verifier-email" element={<VerifyEmailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
      <AudioPlayer />
      <Toaster />
      <DownloadHelpModal />
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppContent />
  </QueryClientProvider>
);

export default App;
