import { Suspense, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { WifiOff, Loader2 } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { PageLoader } from '../common/Spinner';
import { useUIStore } from '../../stores/uiStore';
import { usePlayerStore } from '../../stores/playerStore';
import { cn } from '../../utils/helpers';

interface LayoutProps {
  children: React.ReactNode;
}

const useOnline = () => {
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  return online;
};

export const Layout = ({ children }: LayoutProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const serverWaking = useUIStore((s) => s.serverWaking);
  const hasPlayer = usePlayerStore((s) => !!s.currentAudio);
  const online = useOnline();

  return (
    <div
      className={cn(
        'min-h-screen min-h-[100dvh] flex flex-col',
        // place pour la barre de navigation mobile (+ le lecteur audio s'il est ouvert)
        hasPlayer ? 'pb-[calc(9.5rem+env(safe-area-inset-bottom))] lg:pb-20' : 'pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0'
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-[90] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-xl"
      >
        Aller au contenu
      </a>
      <Header />

      {!online && (
        <div className="bg-red-600 text-white text-sm px-4 py-2 flex items-center justify-center gap-2 text-center">
          <WifiOff size={16} /> {t('common.offline')}
        </div>
      )}
      {online && serverWaking && (
        <div className="bg-gold/15 text-[var(--text-primary)] text-sm px-4 py-2 flex items-center justify-center gap-2 text-center">
          <Loader2 size={16} className="animate-spin text-gold" /> {t('common.server_waking')}
        </div>
      )}

      <ErrorBoundary key={location.pathname}>
        {/* Le Suspense est DANS le layout : l'en-tête et la barre du bas restent affichés pendant le chargement */}
        <main id="main" className="flex-1 w-full">
          <Suspense fallback={<PageLoader />}>{children}</Suspense>
        </main>
      </ErrorBoundary>
      <Footer />
      <MobileNav />
    </div>
  );
};
