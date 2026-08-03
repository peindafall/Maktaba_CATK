import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { BookOpen, Headphones, Video, HelpCircle, Home, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/helpers';

interface SidebarProps {
  isOpen?: boolean;
}

const navItems = [
  { to: '/', icon: Home, labelKey: 'nav.home' },
  { to: '/enseignements', icon: BookOpen, labelKey: 'nav.teachings' },
  { to: '/audios', icon: Headphones, labelKey: 'nav.audio' },
  { to: '/videos', icon: Video, labelKey: 'nav.videos' },
  { to: '/questions', icon: HelpCircle, labelKey: 'nav.questions' },
];

export const Sidebar = ({ isOpen = true }: SidebarProps) => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 240 : 72 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="hidden lg:flex flex-col h-full bg-[var(--surface)] border-r border-[var(--border-light)] py-6 overflow-hidden"
    >
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ to, icon: Icon, labelKey }) => {
          const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-2xl font-medium text-sm transition-all duration-150',
                isActive
                  ? 'bg-primary text-white shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-primary hover:bg-primary/10'
              )}
            >
              <Icon size={20} className="flex-shrink-0" />
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="truncate"
                >
                  {t(labelKey)}
                </motion.span>
              )}
              {isOpen && isActive && <ChevronRight size={14} className="ml-auto flex-shrink-0" />}
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
};
