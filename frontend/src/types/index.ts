export interface PaginatedResponse<T> {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/** Version légère d'une catégorie (noms dans les 3 langues) renvoyée avec chaque contenu. */
export interface CategoryInfo {
  id: string;
  name_fr: string;
  name_en: string;
  name_ar: string;
  slug: string;
  icon: string;
  color: string;
}

export interface Category extends CategoryInfo {
  parent?: string | null;
}

export interface Teaching {
  id: string;
  title_fr: string;
  title_en: string;
  title_ar: string;
  description_fr?: string;
  description_en?: string;
  description_ar?: string;
  category?: string | null;
  category_name?: string | null;
  category_info?: CategoryInfo | null;
  cover_image_url: string | null;
  pdf_file_url?: string | null;
  language: 'fr' | 'en' | 'ar';
  views_count: number;
  downloads_count: number;
  is_featured: boolean;
  published_at: string | null;
}

export interface Audio {
  id: string;
  title_fr: string;
  title_en: string;
  title_ar: string;
  description_fr?: string;
  description_en?: string;
  description_ar?: string;
  category_name?: string | null;
  category_info?: CategoryInfo | null;
  language: string;
  audio_url: string;
  cover_image_url: string | null;
  duration_seconds?: number | null;
  plays_count: number;
  downloads_count: number;
  is_published?: boolean;
  created_at?: string;
  /** Pour les réponses audio des questions : ces éléments ne sont pas des « Audio » du catalogue. */
  kind?: 'audio' | 'answer';
}

export type VideoType_ =
  | 'al_islam'
  | 'juste_une_question'
  | 'conferences'
  | 'interviews'
  | 'enseignements'
  | 'autres';

export interface Video {
  id: string;
  title_fr: string;
  title_en: string;
  title_ar: string;
  description_fr?: string;
  description_en?: string;
  description_ar?: string;
  thumbnail_url: string;
  youtube_url?: string;
  youtube_id: string;
  category: VideoType_ | string;
  category_label?: string;
  theme?: string | null;
  theme_info?: CategoryInfo | null;
  duration_seconds?: number | null;
  published_at: string | null;
  views_count: number;
}

export interface Answer {
  id: string;
  audio_url: string | null;
  duration: string | null;
  transcript_fr: string;
  transcript_en: string;
  transcript_ar: string;
  language: string;
  created_at: string;
}

export interface Question {
  id: string;
  title_fr: string;
  title_en: string;
  title_ar: string;
  question_fr?: string;
  question_en?: string;
  question_ar?: string;
  category_name?: string | null;
  category_info?: CategoryInfo | null;
  keywords?: string;
  answers?: Answer[];
  answers_count?: number;
  has_audio?: boolean;
  source?: 'admin' | 'public';
  views_count: number;
  created_at?: string;
}

export interface MyQuestion {
  id: string;
  title_fr: string;
  title_en: string;
  title_ar: string;
  status: 'pending' | 'answered' | 'rejected';
  is_published: boolean;
  answers_count: number;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  role: 'visitor' | 'member' | 'admin' | 'superadmin';
  preferred_language: string;
  avatar: string | null;
  created_at?: string;
}

export type FavoriteContentType = 'teaching' | 'audio' | 'video' | 'question';

export interface FavoriteRef {
  id: string;
  content_type: FavoriteContentType;
  content_id: string;
  title?: string;
  created_at?: string;
}

export interface FavoritesDetailed {
  teachings: Teaching[];
  audios: Audio[];
  videos: Video[];
  questions: Question[];
  total: number;
}

export interface SearchResult {
  query: string;
  results: {
    teachings?: Teaching[];
    audios?: Audio[];
    videos?: Video[];
    questions?: Question[];
  };
  total: number;
}

export type { Teaching as TeachingType };
export type { Audio as AudioType };
export type { Video as VideoType };
export type { Question as QuestionType };
