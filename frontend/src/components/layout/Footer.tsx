import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, Headphones, Video, HelpCircle, Mail, Globe } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import Logo from '../../assets/logo.png';

const LANGS = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
] as const;

export const Footer = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--border-light)] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="sm:col-span-2">
            <img src={Logo} alt="Maktaba CATK" width={160} height={160} loading="lazy" className="h-24 w-auto object-contain mb-3 dark:brightness-110" />
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-sm">{t('footer.description')}</p>
            <a
              href="mailto:contact@catk.org"
              className="inline-flex items-center gap-1.5 mt-4 text-sm text-[var(--text-secondary)] hover:text-primary transition-colors"
            >
              <Mail size={14} /> contact@catk.org
            </a>
          </div>

          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-4">{t('footer.navigation')}</h4>
            <ul className="space-y-2">
              {[
                { to: '/enseignements', label: t('nav.teachings'), icon: <BookOpen size={14} /> },
                { to: '/audios', label: t('nav.audio'), icon: <Headphones size={14} /> },
                { to: '/videos', label: t('nav.videos'), icon: <Video size={14} /> },
                { to: '/questions', label: t('nav.questions'), icon: <HelpCircle size={14} /> },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-primary transition-colors">
                    {link.icon}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Globe size={16} /> {t('common.language')}
            </h4>
            <ul className="space-y-2">
              {LANGS.map((lang) => (
                <li key={lang.code}>
                  <button
                    onClick={() => changeLanguage(lang.code)}
                    className={`text-sm transition-colors ${
                      currentLanguage === lang.code ? 'text-primary font-semibold' : 'text-[var(--text-secondary)] hover:text-primary'
                    }`}
                  >
                    {lang.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--border-light)] flex flex-col sm:flex-row justify-between items-center gap-2 text-center">
          <p className="text-sm text-[var(--text-secondary)]">
            © {new Date().getFullYear()} Maktaba CATK. {t('footer.rights')}
          </p>
          <span className="text-xs text-[var(--text-secondary)]">{t('footer.tagline')}</span>
        </div>
      </div>
    </footer>
  );
};
