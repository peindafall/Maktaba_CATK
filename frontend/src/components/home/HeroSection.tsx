import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BookOpen, Headphones, Video } from 'lucide-react';
import { api } from '../../services/api';
import { formatNumber } from '../../utils/formatters';
import LogoMark from '../../assets/logo-mark.png';

/** Vrais chiffres de la bibliothèque (avant : « 500+ / 1000+ / 200+ » écrits en dur). */
const useLibraryStats = () =>
  useQuery({
    queryKey: ['library-stats'],
    staleTime: 30 * 60 * 1000,
    queryFn: async () => {
      const get = (url: string) =>
        api.get<{ count: number }>(url, { params: { page_size: 1 } }).then((r) => r.data.count).catch(() => null);
      const [teachings, audios, videos] = await Promise.all([get('/teachings/'), get('/audios/'), get('/videos/')]);
      return { teachings, audios, videos };
    },
  });

export const HeroSection = () => {
  const { t, i18n } = useTranslation();
  const { data } = useLibraryStats();

  const stats = [
    { icon: <BookOpen size={20} />, value: data?.teachings, labelKey: 'home.stats_teachings' },
    { icon: <Headphones size={20} />, value: data?.audios, labelKey: 'home.stats_audios' },
    { icon: <Video size={20} />, value: data?.videos, labelKey: 'home.stats_videos' },
  ];

  const renderValue = (v: number | null | undefined) =>
    v == null ? <span className="inline-block w-8 h-5 rounded bg-white/20 animate-pulse align-middle" /> : formatNumber(v, i18n.language);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1EA478 0%, #114D0D 100%)' }} />
      <div className="absolute -top-32 -end-32 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -start-32 w-96 h-96 rounded-full bg-[#BF8B28]/20 blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-white text-center lg:text-start"
          >
            <p className="font-arabic text-xl sm:text-2xl text-gold-light mb-4 leading-loose" dir="rtl" lang="ar">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">{t('home.hero_title')}</h1>
            <p className="text-lg sm:text-xl text-white/80 mb-8">{t('home.hero_subtitle')}</p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link
                to="/enseignements"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg transition-transform duration-200 active:scale-95 shadow-xl text-white"
                style={{ background: 'linear-gradient(135deg, #BF8B28, #A67723)' }}
              >
                {t('home.hero_cta')}
                <ArrowRight size={20} className="rtl:rotate-180" />
              </Link>
              <Link
                to="/questions"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg border-2 border-white/40 text-white hover:bg-white/10 transition-colors"
              >
                {t('nav.questions')}
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="hidden lg:block"
          >
            <div
              className="rounded-3xl p-8 text-center shadow-2xl"
              style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-white p-3 shadow-lg">
                <img src={LogoMark} alt="Maktaba CATK" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-white text-xl font-bold mb-1">{t('home.professor_short')}</h3>
              <p className="text-white/60 text-sm mb-6">{t('home.professor_role')}</p>
              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat) => (
                  <div key={stat.labelKey} className="text-center">
                    <div className="flex justify-center mb-1 text-gold-light">{stat.icon}</div>
                    <div className="text-white font-bold text-lg">{renderValue(stat.value)}</div>
                    <div className="text-white/60 text-xs">{t(stat.labelKey)}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="lg:hidden mt-10 grid grid-cols-3 gap-2 sm:gap-4">
          {stats.map((stat) => (
            <div key={stat.labelKey} className="text-center py-4 px-1 rounded-2xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div className="flex justify-center mb-1 text-gold-light">{stat.icon}</div>
              <div className="text-white font-bold text-xl">{renderValue(stat.value)}</div>
              <div className="text-white/60 text-[11px] sm:text-xs leading-tight">{t(stat.labelKey)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
