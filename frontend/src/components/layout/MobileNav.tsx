import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, BookOpen, Headphones, Video, HelpCircle } from 'lucide-react';
import { cn } from '../../utils/helpers';

const navItems = [
  { to: '/', icon: Home, labelKey: 'nav.home' },
  { to: '/enseignements', icon: BookOpen, labelKey: 'nav.teachings' },
  { to: '/audios', icon: Headphones, labelKey: 'nav.audio' },
  { to: '/videos', icon: Video, labelKey: 'nav.videos' },
  { to: '/questions', icon: HelpCircle, labelKey: 'nav.questions_short' },
];

export const MobileNav = () => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <nav
      aria-label="Navigation mobile"
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[var(--surface)]/95 backdrop-blur-md border-t border-[var(--border-light)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 max-w-lg mx-auto">
        {navItems.map(({ to, icon: Icon, labelKey }) => {
          const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              aria-current={isActive ? 'page' : undefined}
              // Zone tactile pleine largeur (évite de devoir toucher deux fois)
              className={cn(
                'relative flex flex-col items-center justify-center gap-1 py-2 min-h-[58px] touch-manipulation select-none transition-colors',
                isActive ? 'text-primary' : 'text-[var(--text-secondary)]'
              )}
            >
              {isActive && <span className="absolute top-0 h-0.5 w-8 bg-primary rounded-full" />}
              <Icon size={22} strokeWidth={isActive ? 2.4 : 2} />
              <span className="text-[10px] leading-none font-medium max-w-full px-1 truncate">{t(labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
