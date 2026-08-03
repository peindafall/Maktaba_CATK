export interface PaginatedResponse<T> {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Category {
  id: string;
  name_fr: string;
  name_en: string;
  name_ar: string;
  slug: string;
  icon: string;
  color: string;
  parent: string | null;
}

export interface Teaching {
  id: string;
  title_fr: string;
  title_en: string;
  title_ar: string;
  description_fr: string;
  description_en: string;
  description_ar: string;
  category: Category;
  cover_image_url: string;
  pdf_file: string;
  language: 'fr' | 'en' | 'ar';
  views_count: number;
  downloads_count: number;
  is_featured: boolean;
  published_at: string;
}

export interface Audio {
  id: string;
  title_fr: string;
  title_en: string;
  title_ar: string;
  category: Category;
  language: string;
  audio_file: string;
  cover_image_url: string;
  duration: string | null;
  plays_count: number;
  is_published: boolean;
}

export interface Video {
  id: string;
  title_fr: string;
  title_en: string;
  title_ar: string;
  description_fr: string;
  description_en: string;
  description_ar: string;
  thumbnail_url: string;
  youtube_url: string;
  youtube_id: string;
  category: string;
  duration: string | null;
  published_at: string;
  views_count: number;
}

export interface Question {
  id: string;
  title_fr: string;
  title_en: string;
  title_ar: string;
  question_fr: string;
  question_en: string;
  question_ar: string;
  category: Category;
  keywords: string;
  answers: Answer[];
  views_count: number;
}

export interface Answer {
  id: string;
  audio_file: string;
  duration: string | null;
  transcript_fr: string;
  transcript_en: string;
  transcript_ar: string;
  language: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'visitor' | 'member' | 'admin' | 'superadmin';
  preferred_language: string;
  avatar: string | null;
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
