import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BookOpen, Headphones, Video, HelpCircle } from 'lucide-react';

const categories = [
  { to: '/enseignements', icon: BookOpen, labelKey: 'nav.teachings', bg: 'linear-gradient(135deg, #1EA478, #114D0D)' },
  { to: '/audios', icon: Headphones, labelKey: 'nav.audio', bg: 'linear-gradient(135deg, #BF8B28, #A67723)' },
  { to: '/videos', icon: Video, labelKey: 'nav.videos', bg: 'linear-gradient(135deg, #B35214, #431C03)' },
  { to: '/questions', icon: HelpCircle, labelKey: 'nav.questions', bg: 'linear-gradient(135deg, #1FA645, #114D0D)' },
];

export const CategoriesGrid = () => {
  const { t } = useTranslation();

  return (
    <section className="py-10 sm:py-12 bg-[var(--border-light)]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-6 sm:mb-8 text-center">
          {t('home.categories')}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {categories.map(({ to, icon: Icon, labelKey, bg }) => (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] rounded-3xl p-4 sm:p-6 text-white text-center shadow-lg transition-transform duration-200 hover:-translate-y-1 active:scale-[0.98]"
              style={{ background: bg }}
            >
              <Icon size={28} className="mb-3 opacity-90" />
              {/* Texte qui revient à la ligne au lieu de déborder (« Questions/Réponses » sur mobile) */}
              <span className="font-semibold text-base sm:text-lg leading-snug break-words [overflow-wrap:anywhere] max-w-full">
                {t(labelKey)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
