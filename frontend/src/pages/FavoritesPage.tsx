import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, FileText } from 'lucide-react';
import { teachingService } from '../services/teachingService';
import { TeachingCard } from '../components/teachings/TeachingCard';
import { PageLoader } from '../components/common/Spinner';
import { EmptyState } from '../components/common/EmptyState';
import type { Teaching } from '../types';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<Teaching[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    teachingService
      .getFavorites()
      .then((data) => setFavorites(data))
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <PageLoader />;

  if (error) {
    return (
      <EmptyState
        icon={<Heart />}
        title="Erreur de chargement"
        description="Impossible de charger vos favoris."
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2 flex items-center gap-3">
          <Heart className="text-red-500" fill="currentColor" /> Mes favoris
        </h1>
        <p className="text-[var(--text-secondary)]">
          Retrouvez tous les enseignements que vous avez sauvegardés.
        </p>
      </motion.div>

      {favorites.length === 0 ? (
        <EmptyState
          icon={<FileText />}
          title="Aucun favori"
          description="Vous n'avez pas encore ajouté d'enseignement à vos favoris."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((teaching, i) => (
            <motion.div
              key={teaching.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <TeachingCard teaching={teaching} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;