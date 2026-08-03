import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Headphones, Video } from 'lucide-react';

interface StatItem {
  icon: React.ReactNode;
  value: string;
  labelKey: string;
}

const stats: StatItem[] = [
  { icon: <BookOpen size={20} />, value: '500+', labelKey: 'home.stats_teachings' },
  { icon: <Headphones size={20} />, value: '1000+', labelKey: 'home.stats_audios' },
  { icon: <Video size={20} />, value: '200+', labelKey: 'home.stats_videos' },
];

export const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, #1EA478 0%, #114D0D 100%)' }}
      />

      {/* Decorative circles */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#BF8B28]/20 blur-3xl" />

      {/* Islamic geometric pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-white"
          >
            {/* Arabic subtitle */}
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-arabic text-2xl text-gold-light mb-4 leading-loose"
              dir="rtl"
            >
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl lg:text-5xl font-bold leading-tight mb-4"
            >
              {t('home.hero_title')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-white/80 mb-8"
            >
              {t('home.hero_subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/enseignements"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 active:scale-95 shadow-xl hover:shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #BF8B28, #A67723)',
                  color: '#fff',
                }}
              >
                {t('home.hero_cta')}
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/questions"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-white/40 text-white hover:bg-white/10 transition-all duration-200"
              >
                {t('nav.questions')}
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
          >
            {/* Professor card */}
            <div
              className="rounded-3xl p-8 text-center shadow-2xl"
              style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              {/* Avatar placeholder */}
              <div className="w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center text-6xl"
                style={{ background: 'linear-gradient(135deg, #BF8B28, #A67723)' }}>
                🎓
              </div>
              <h3 className="text-white text-xl font-bold mb-1">
                Prof. Cheikh Ahmet Tidiane KEBE
              </h3>
              <p className="text-white/60 text-sm mb-6">Tarikha Tidiane - Jusrisprudence Islamique</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="flex justify-center mb-1 text-gold-light">{stat.icon}</div>
                    <div className="text-white font-bold text-lg">{stat.value}</div>
                    <div className="text-white/60 text-xs">{t(stat.labelKey)}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:hidden mt-10 grid grid-cols-3 gap-4"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="text-center py-4 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <div className="flex justify-center mb-1 text-gold-light">{stat.icon}</div>
              <div className="text-white font-bold text-xl">{stat.value}</div>
              <div className="text-white/60 text-xs">{t(stat.labelKey)}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
