import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { User, Globe, Lock } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { Button } from '../components/common/Button';

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const { currentLanguage, changeLanguage } = useLanguage();

  if (!isAuthenticated) return <Navigate to="/connexion" replace />;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6">{t('profile.title')}</h1>

        <div className="card p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">{user?.username}</h2>
              <p className="text-[var(--text-secondary)]">{user?.email}</p>
              <span className="inline-block text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium mt-1">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Language preference */}
        <div className="card p-6 mb-6">
          <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Globe size={18} className="text-primary" />
            {t('profile.preferred_language')}
          </h3>
          <div className="flex gap-3">
            {(['fr', 'en', 'ar'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => changeLanguage(lang)}
                className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all ${
                  currentLanguage === lang
                    ? 'bg-primary text-white'
                    : 'border border-[var(--border-light)] text-[var(--text-secondary)] hover:border-primary hover:text-primary'
                }`}
              >
                {lang === 'fr' ? '🇫🇷 Français' : lang === 'en' ? '🇬🇧 English' : '🇸🇦 العربية'}
              </button>
            ))}
          </div>
        </div>

        {/* Logout */}
        <Button variant="danger" onClick={logout} className="w-full">
          {t('nav.logout')}
        </Button>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
