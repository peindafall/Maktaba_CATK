import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, BookOpen, Headphones, Video, HelpCircle } from 'lucide-react';
import { cn } from '../../utils/helpers';

const navItems = [
  { to: '/', icon: Home, labelKey: 'nav.home' },
  { to: '/enseignements', icon: BookOpen, labelKey: 'nav.teachings' },
  { to: '/audios', icon: Headphones, labelKey: 'nav.audio' },
  { to: '/videos', icon: Video, labelKey: 'nav.videos' },
  { to: '/questions', icon: HelpCircle, labelKey: 'nav.questions' },
];

export const MobileNav = () => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[var(--surface)]/95 backdrop-blur-md border-t border-[var(--border-light)] safe-area-bottom">
      <div className="flex items-center justify-around py-2 px-2">
        {navItems.map(({ to, icon: Icon, labelKey }) => {
          const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-150 min-w-0',
                isActive
                  ? 'text-primary'
                  : 'text-[var(--text-secondary)] hover:text-primary'
              )}
            >
              <Icon size={22} className={cn(isActive && 'scale-110')} />
              <span className="text-[10px] font-medium truncate">{t(labelKey)}</span>
              {isActive && (
                <span className="absolute bottom-0 h-0.5 w-8 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
