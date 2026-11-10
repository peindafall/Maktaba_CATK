import { useTranslation } from 'react-i18next';
import { MapPin, Mail, Phone, BookMarked } from 'lucide-react';
import LogoMark from '../../assets/logo-mark.png';

const EMAIL = 'cheikhtidanekebe.professeur@gmail.com';
const PHONE_DISPLAY = '+221 77 513 69 26';
const PHONE_LINK = '+221775136926';

export const ProfessorProfile = () => {
  const { t } = useTranslation();

  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="card p-6 sm:p-8 lg:p-12">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-10 items-start">
          {/* Carte d'identité */}
          <div className="text-center lg:text-start">
            {/* Logo de l'entreprise à la place de l'emoji 🎓 (en attendant une photo officielle) */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full mx-auto lg:mx-0 bg-white p-4 shadow-xl ring-4 ring-primary/20">
              <img src={LogoMark} alt="Maktaba CATK" className="w-full h-full object-contain" loading="lazy" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-[var(--text-primary)]">{t('home.professor_name')}</h3>
            <p className="mt-1 inline-flex items-center gap-1.5 text-primary font-medium">
              <BookMarked size={16} /> {t('home.professor_tarikha')}
            </p>

            {/* Icônes alignées au lieu des emojis 📍 📧 📞 */}
            <ul className="mt-5 space-y-2.5 text-sm text-[var(--text-secondary)] inline-block text-start">
              <li className="flex items-center gap-2.5">
                <MapPin size={16} className="text-primary flex-shrink-0" />
                <span>{t('home.professor_location')}</span>
              </li>
              <li className="flex items-center gap-2.5 min-w-0">
                <Mail size={16} className="text-primary flex-shrink-0" />
                <a href={`mailto:${EMAIL}`} className="hover:text-primary break-all" dir="ltr">
                  {EMAIL}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-primary flex-shrink-0" />
                <a href={`tel:${PHONE_LINK}`} className="hover:text-primary" dir="ltr">
                  {PHONE_DISPLAY}
                </a>
              </li>
            </ul>
          </div>

          {/* Présentation */}
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">{t('home.professor_section')}</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-5">{t('home.professor_bio')}</p>

            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <div className="rounded-2xl border border-[var(--border-light)] p-4">
                <h4 className="font-semibold text-[var(--text-primary)] mb-2">{t('home.expertise_title')}</h4>
                <ul className="text-sm text-[var(--text-secondary)] space-y-1 list-disc ps-5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <li key={i}>{t(`home.expertise_${i}`)}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-[var(--border-light)] p-4">
                <h4 className="font-semibold text-[var(--text-primary)] mb-2">{t('home.career_title')}</h4>
                <ul className="text-sm text-[var(--text-secondary)] space-y-1 list-disc ps-5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <li key={i}>{t(`home.career_${i}`)}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border-light)] p-4 mb-6">
              <h4 className="font-semibold text-[var(--text-primary)] mb-2">{t('home.responsibilities_title')}</h4>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{t('home.responsibilities_text')}</p>
            </div>

            <figure
              className="p-4 rounded-2xl border-s-4 border-gold"
              style={{ background: 'linear-gradient(135deg, #BF8B2812, #A6772312)' }}
            >
              <blockquote className="font-arabic text-lg text-[var(--text-primary)] leading-loose text-right" dir="rtl" lang="ar">
                طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ
              </blockquote>
              <figcaption className="text-sm text-[var(--text-secondary)] mt-1">{t('home.quote_translation')}</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
};
