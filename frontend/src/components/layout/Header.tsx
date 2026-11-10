import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Sun, Moon, Globe, User, LogOut, Menu, X, BookOpen,
  Headphones, Video, HelpCircle, ChevronDown, Heart, Home,
} from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../stores/authStore';
import { useLanguage } from '../../hooks/useLanguage';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { toast } from '../../stores/toastStore';
import LogoMark from '../../assets/logo-mark.png';

const LANGUAGES = [
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'ar', label: 'العربية', short: 'AR' },
] as const;

/** Ferme un menu déroulant quand on touche/clique ailleurs. */
const useClickOutside = (ref: React.RefObject<HTMLElement>, onOutside: () => void, active: boolean) => {
  useEffect(() => {
    if (!active) return;
    const handler = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [ref, onOutside, active]);
};

export const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isDarkMode = useUIStore((s) => s.isDarkMode);
  const toggleDarkMode = useUIStore((s) => s.toggleDarkMode);
  const toggleMobileMenu = useUIStore((s) => s.toggleMobileMenu);
  const closeMobileMenu = useUIStore((s) => s.closeMobileMenu);
  const isMobileMenuOpen = useUIStore((s) => s.isMobileMenuOpen);
  const { isAuthenticated, user, logout } = useAuth();
  const { currentLanguage, changeLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [hydrated, setHydrated] = useState(useAuthStore.persist.hasHydrated());
  const langRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useClickOutside(langRef, () => setShowLangMenu(false), showLangMenu);
  useClickOutside(userRef, () => setShowUserMenu(false), showUserMenu);

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    if (useAuthStore.persist.hasHydrated()) setHydrated(true);
    return () => unsub();
  }, []);

  // Fermer les menus à chaque changement de page
  useEffect(() => {
    setShowUserMenu(false);
    setShowLangMenu(false);
    closeMobileMenu();
  }, [location.pathname, closeMobileMenu]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recherche?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      closeMobileMenu();
    }
  };

  // Déconnexion : on demande d'abord confirmation
  const askLogout = () => {
    setShowUserMenu(false);
    closeMobileMenu();
    setConfirmLogout(true);
  };

  const doLogout = async () => {
    setConfirmLogout(false);
    await logout();
    toast.success(t('auth.logout_success'));
    navigate('/', { replace: true });
  };

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname === path || location.pathname.startsWith(`${path}/`);

  const navLinks = [
    { to: '/enseignements', label: t('nav.teachings'), icon: <BookOpen size={16} /> },
    { to: '/audios', label: t('nav.audio'), icon: <Headphones size={16} /> },
    { to: '/videos', label: t('nav.videos'), icon: <Video size={16} /> },
    { to: '/questions', label: t('nav.questions'), icon: <HelpCircle size={16} /> },
  ];

  const initial = (user?.username?.[0] || user?.email?.[0] || '?').toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-40 bg-[var(--surface)]/95 backdrop-blur-md border-b border-[var(--border-light)] shadow-sm pt-[env(safe-area-inset-top)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
            <Link to="/" className="flex items-center gap-2 flex-shrink-0 min-w-0" aria-label="Maktaba CATK">
              <img src={LogoMark} alt="" width={44} height={44} className="h-10 w-10 sm:h-11 sm:w-11 object-contain" />
              <span className="hidden sm:flex flex-col leading-tight">
                <span className="font-bold text-[var(--text-primary)] tracking-wide">MAKTABA CATK</span>
                <span className="text-[10px] text-gold font-medium">مكتبة · Bibliothèque numérique</span>
              </span>
            </Link>

            <nav className="hidden xl:flex items-center gap-1" aria-label="Navigation principale">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={isActive(link.to) ? 'page' : undefined}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors duration-150 ${
                    isActive(link.to)
                      ? 'text-primary bg-primary/10 font-semibold'
                      : 'text-[var(--text-secondary)] hover:text-primary hover:bg-primary/10'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </nav>

            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs" role="search">
              <div className="relative w-full">
                <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search.placeholder')}
                  aria-label={t('nav.search')}
                  className="input-base ps-9 py-2 text-sm"
                />
              </div>
            </form>

            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                to="/recherche"
                className="md:hidden p-2 rounded-xl hover:bg-[var(--border-light)] transition-colors"
                aria-label={t('nav.search')}
              >
                <Search size={18} />
              </Link>

              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setShowLangMenu((v) => !v)}
                  aria-label={t('nav.language')}
                  aria-expanded={showLangMenu}
                  className="flex items-center gap-1 p-2 rounded-xl hover:bg-[var(--border-light)] transition-colors text-sm"
                >
                  <Globe size={17} />
                  <span className="hidden sm:block font-medium">
                    {LANGUAGES.find((l) => l.code === currentLanguage)?.short}
                  </span>
                  <ChevronDown size={12} />
                </button>
                <AnimatePresence>
                  {showLangMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute end-0 mt-2 w-40 bg-[var(--surface)] border border-[var(--border-light)] rounded-2xl shadow-xl overflow-hidden z-50"
                    >
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            changeLanguage(lang.code);
                            setShowLangMenu(false);
                          }}
                          className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm hover:bg-primary/10 hover:text-primary transition-colors ${
                            currentLanguage === lang.code ? 'text-primary font-semibold bg-primary/5' : 'text-[var(--text-primary)]'
                          }`}
                        >
                          <span>{lang.label}</span>
                          <span className="text-xs opacity-60">{lang.short}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl hover:bg-[var(--border-light)] transition-colors"
                aria-label={isDarkMode ? t('common.light_mode') : t('common.dark_mode')}
                title={isDarkMode ? t('common.light_mode') : t('common.dark_mode')}
              >
                {isDarkMode ? <Sun size={18} className="text-gold" /> : <Moon size={18} />}
              </button>

              {!hydrated ? (
                <div className="w-9 h-9 rounded-2xl bg-[var(--border-light)] animate-pulse" />
              ) : isAuthenticated ? (
                <div className="relative hidden sm:block" ref={userRef}>
                  <button
                    onClick={() => setShowUserMenu((v) => !v)}
                    aria-expanded={showUserMenu}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-2xl hover:bg-primary/10 transition-colors"
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                        {initial}
                      </div>
                    )}
                    <span className="hidden lg:block text-sm font-medium max-w-[120px] truncate">
                      {user?.username || user?.email}
                    </span>
                    <ChevronDown size={12} />
                  </button>
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute end-0 mt-2 w-56 bg-[var(--surface)] border border-[var(--border-light)] rounded-2xl shadow-xl overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-[var(--border-light)]">
                          <p className="text-sm font-semibold truncate">{user?.username}</p>
                          <p className="text-xs text-[var(--text-secondary)] truncate">{user?.email}</p>
                        </div>
                        {[
                          { to: '/', icon: <Home size={15} />, label: t('nav.home') },
                          { to: '/profil', icon: <User size={15} />, label: t('nav.profile') },
                          { to: '/favoris', icon: <Heart size={15} />, label: t('nav.favorites') },
                        ].map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            {item.icon} {item.label}
                          </Link>
                        ))}
                        <button
                          onClick={askLogout}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors border-t border-[var(--border-light)]"
                        >
                          <LogOut size={15} className="rtl:rotate-180" /> {t('nav.logout')}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/connexion"
                  state={{ from: location.pathname }}
                  className="hidden sm:flex items-center gap-1.5 btn-primary py-2 px-4 text-sm whitespace-nowrap"
                >
                  <User size={15} />
                  {t('nav.login')}
                </Link>
              )}

              <button
                onClick={toggleMobileMenu}
                aria-label={isMobileMenuOpen ? t('nav.close_menu') : t('nav.menu')}
                aria-expanded={isMobileMenuOpen}
                className="xl:hidden p-2 rounded-xl hover:bg-[var(--border-light)] transition-colors"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="xl:hidden border-t border-[var(--border-light)] bg-[var(--surface)] overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1 max-h-[calc(100dvh-5rem)] overflow-y-auto">
                <form onSubmit={handleSearch} className="mb-3 md:hidden" role="search">
                  <div className="relative">
                    <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('search.placeholder')}
                      className="input-base ps-9 py-2.5 text-base"
                    />
                  </div>
                </form>

                {isAuthenticated && user && (
                  <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-2xl bg-primary/5">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{user.username}</p>
                      <p className="text-xs text-[var(--text-secondary)] truncate">{user.email}</p>
                    </div>
                  </div>
                )}

                {[{ to: '/', label: t('nav.home'), icon: <Home size={16} /> }, ...navLinks,
                  ...(isAuthenticated
                    ? [
                        { to: '/favoris', label: t('nav.favorites'), icon: <Heart size={16} /> },
                        { to: '/profil', label: t('nav.profile'), icon: <User size={16} /> },
                      ]
                    : []),
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    aria-current={isActive(link.to) ? 'page' : undefined}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${
                      isActive(link.to) ? 'text-primary bg-primary/10 font-semibold' : 'text-[var(--text-primary)] hover:bg-primary/10'
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}

                {isAuthenticated ? (
                  <button
                    onClick={askLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 font-medium hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={16} className="rtl:rotate-180" /> {t('nav.logout')}
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link to="/connexion" className="btn-primary text-center py-2.5 text-sm">
                      {t('nav.login')}
                    </Link>
                    <Link to="/inscription" className="btn-outline text-center py-2.5 text-sm">
                      {t('nav.register')}
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <ConfirmDialog
        isOpen={confirmLogout}
        title={t('auth.logout_confirm_title')}
        message={t('auth.logout_confirm_text')}
        confirmLabel={t('auth.logout_confirm_btn')}
        danger
        icon={
          <span className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
            <LogOut size={22} className="rtl:rotate-180" />
          </span>
        }
        onConfirm={doLogout}
        onCancel={() => setConfirmLogout(false)}
      />
    </>
  );
};
