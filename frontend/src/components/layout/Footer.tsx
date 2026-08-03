import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, Headphones, Video, HelpCircle, Mail, Globe } from 'lucide-react';
import Logo from '../../assets/logo.svg';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--border-light)] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <img src={Logo} alt="Maktaba CATK" className="h-12 mb-4" />
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-xs">
              Bibliothèque numérique des enseignements du Professeur Cheikh Ahmet Tidiane KEBE.
              Accédez à des milliers d'enseignements islamiques authentiques.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="mailto:contact@catk.org"
                className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-primary transition-colors"
              >
                <Mail size={14} /> contact@catk.org
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-4">Navigation</h4>
            <ul className="space-y-2">
              {[
                { to: '/enseignements', label: t('nav.teachings'), icon: <BookOpen size={14} /> },
                { to: '/audios', label: t('nav.audio'), icon: <Headphones size={14} /> },
                { to: '/videos', label: t('nav.videos'), icon: <Video size={14} /> },
                { to: '/questions', label: t('nav.questions'), icon: <HelpCircle size={14} /> },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-primary transition-colors"
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Languages */}
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Globe size={16} /> {t('common.language')}
            </h4>
            <ul className="space-y-2">
              {[
                { code: 'fr', label: 'Français', flag: '🇫🇷' },
                { code: 'en', label: 'English', flag: '🇬🇧' },
                { code: 'ar', label: 'العربية', flag: '🇸🇦' },
              ].map((lang) => (
                <li key={lang.code}>
                  <span className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    {lang.flag} {lang.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-[var(--border-light)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[var(--text-secondary)]">
            © {new Date().getFullYear()} Maktaba CATK. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[var(--text-secondary)]">
              Enseignements du Professeur Cheikh Ahmet Tidiane KEBE
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
