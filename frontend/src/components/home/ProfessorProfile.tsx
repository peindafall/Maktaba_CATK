import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export const ProfessorProfile = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="card p-8 lg:p-12">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Professor profile */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <div
              className="w-48 h-48 rounded-full mx-auto lg:mx-0 flex items-center justify-center text-8xl shadow-xl"
              style={{ background: 'linear-gradient(135deg, #1EA478, #114D0D)' }}
            >
              🎓
            </div>
            <h3 className="mt-4 text-xl font-bold text-[var(--text-primary)]">
              Professeur Cheikh Ahmet Tidiane KEBE
            </h3>
            <p className="text-primary font-medium">Tarikha Tidiane</p>
            <div className="mt-4 text-sm text-[var(--text-secondary)] space-y-1">
              <p>📍 Thiès, Sénégal</p>
              <p>📧 cheikhtidanekebe.professeur@gmail.com</p>
              <p>📞 +00221 775136926</p>
            </div>
          </motion.div>

          {/* CV summary */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              {t('home.professor_section')}
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              Fondateur de <strong>KEBE Services Juridiques Islamiques (KSJI)</strong>, diplômé de
              l'Institut Mohammed VI de Rabat et de l'Université Islamique Africaine Khaly Amar
              Fall. De formation franco-arabe, il intervient depuis plus de 20 ans dans
              l'enseignement, le conseil et la médiation religieuse.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <div className="rounded-2xl border border-[var(--border-light)] p-4">
                <h4 className="font-semibold text-[var(--text-primary)] mb-2">Domaines d'expertise</h4>
                <ul className="text-sm text-[var(--text-secondary)] space-y-1">
                  <li>• Fiqh al-Shari'a</li>
                  <li>• Fiqh al-Mu'amalat (transactions)</li>
                  <li>• Fiqh al-'Ibadat (cultes)</li>
                  <li>• Finance islamique</li>
                  <li>• Succession (al-mirasse) et arbitrage familial</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-[var(--border-light)] p-4">
                <h4 className="font-semibold text-[var(--text-primary)] mb-2">Parcours académique</h4>
                <ul className="text-sm text-[var(--text-secondary)] space-y-1">
                  <li>• 2025–… : Master Jurisprudence & Oussoul Fikh (en cours)</li>
                  <li>• 2020 : Licence en Charia Islamique</li>
                  <li>• 2017–2019 : Diplôme Institut Mohammed VI (Rabat)</li>
                  <li>• 2013 : Diplôme Tafsir al-Qur'an & Charia</li>
                  <li>• 2007 : BAC Arabe (CACIT)</li>
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border-light)] p-4 mb-6">
              <h4 className="font-semibold text-[var(--text-primary)] mb-2">Responsabilités clés</h4>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Conseiller technique au PSE (2023–2024), Secrétaire du Conseil de Conformité SESA
                SAFIA (depuis 2025), Chef du Desk Religieux à Malikia TV, Directeur des Études
                Arabes, et membre actif de plusieurs comités scientifiques (Gamou de Tivaouane,
                COSKAS, Al Fatikh, PROJET).
              </p>
            </div>
            {/* Arabic quote */}
            <div
              className="p-4 rounded-2xl border-r-4 border-gold"
              style={{ background: 'linear-gradient(135deg, #BF8B2810, #A6772310)' }}
              dir="rtl"
            >
              <p className="font-arabic text-lg text-[var(--text-primary)] leading-loose">
                "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ"
              </p>
              <p className="text-sm text-[var(--text-secondary)] mt-1 text-left" dir="ltr">
                "La recherche du savoir est une obligation pour tout musulman"
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
