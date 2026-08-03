import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Sun, Moon, Globe, User, LogOut, Menu, X, BookOpen,
  Headphones, Video, HelpCircle, ChevronDown,
} from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import { useLanguage } from '../../hooks/useLanguage';
import Logo from '../../assets/logo.svg';

const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
] as const;

export const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode, toggleMobileMenu, isMobileMenuOpen } = useUIStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { currentLanguage, changeLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recherche?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/enseignements', label: t('nav.teachings'), icon: <BookOpen size={16} /> },
    { to: '/audios', label: t('nav.audio'), icon: <Headphones size={16} /> },
    { to: '/videos', label: t('nav.videos'), icon: <Video size={16} /> },
    { to: '/questions', label: t('nav.questions'), icon: <HelpCircle size={16} /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[var(--surface)]/95 backdrop-blur-md border-b border-[var(--border-light)] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={Logo} alt="Maktaba CATK" className="h-10 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-primary hover:bg-primary/10 transition-all duration-150"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs">
            <div className="relative w-full">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search.placeholder')}
                className="input-base pl-9 py-2 text-sm"
              />
            </div>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Language selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1 p-2 rounded-xl hover:bg-[var(--border-light)] transition-colors text-sm"
              >
                <Globe size={16} />
                <span className="hidden sm:block uppercase font-medium">{currentLanguage}</span>
                <ChevronDown size={12} />
              </button>
              <AnimatePresence>
                {showLangMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 mt-2 w-40 bg-[var(--surface)] border border-[var(--border-light)] rounded-2xl shadow-xl overflow-hidden z-50"
                  >
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code);
                          setShowLangMenu(false);
                        }}
                        className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-primary/10 hover:text-primary transition-colors ${
                          currentLanguage === lang.code ? 'text-primary font-semibold bg-primary/5' : 'text-[var(--text-primary)]'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl hover:bg-[var(--border-light)] transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={18} className="text-gold" /> : <Moon size={18} />}
            </button>

            {/* Auth */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-2xl hover:bg-primary/10 transition-colors"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                      {user.username[0].toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium">{user.username}</span>
                  <ChevronDown size={12} />
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 mt-2 w-48 bg-[var(--surface)] border border-[var(--border-light)] rounded-2xl shadow-xl overflow-hidden z-50"
                    >
                      <Link
                        to="/profil"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <User size={15} /> {t('nav.profile')}
                      </Link>
                      <button
                        onClick={() => { logout(); setShowUserMenu(false); }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <LogOut size={15} /> {t('nav.logout')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/connexion"
                className="hidden sm:flex items-center gap-1.5 btn-primary py-2 px-4 text-sm"
              >
                <User size={15} />
                {t('nav.login')}
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-xl hover:bg-[var(--border-light)] transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-[var(--border-light)] bg-[var(--surface)]"
          >
            <div className="px-4 py-4 space-y-2">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('search.placeholder')}
                    className="input-base pl-9 py-2 text-sm"
                  />
                </div>
              </form>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => useUIStore.getState().closeMobileMenu()}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-[var(--text-primary)] hover:text-primary hover:bg-primary/10 transition-colors font-medium"
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link
                  to="/connexion"
                  onClick={() => useUIStore.getState().closeMobileMenu()}
                  className="flex items-center justify-center gap-2 btn-primary w-full mt-2"
                >
                  <User size={15} /> {t('nav.login')}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
