import { HeroSection } from '../components/home/HeroSection';
import { FeaturedTeachings } from '../components/home/FeaturedTeachings';
import { CategoriesGrid } from '../components/home/CategoriesGrid';
import { PopularDocuments } from '../components/home/PopularDocuments';
import { PopularAudios } from '../components/home/PopularAudios';
import { LatestVideos } from '../components/home/LatestVideos';
import { LatestQuestions } from '../components/home/LatestQuestions';
import { ProfessorProfile } from '../components/home/ProfessorProfile';

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <CategoriesGrid />
      <FeaturedTeachings />
      <PopularAudios />
      <LatestQuestions />
      <PopularDocuments />
      <LatestVideos />
      <ProfessorProfile />
    </div>
  );
};

export default HomePage;
