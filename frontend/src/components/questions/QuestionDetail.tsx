import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft, Eye, HelpCircle, Headphones } from 'lucide-react';
import type { Question, Audio } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { getLocalizedField, formatNumber } from '../../utils/formatters';
import { usePlayerStore } from '../../stores/playerStore';
import { useIncrementQuestionView } from '../../hooks/useQuestions';

interface QuestionDetailProps {
  question: Question;
}

export const QuestionDetail = ({ question }: QuestionDetailProps) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { setCurrentAudio, currentAudio, isPlaying, togglePlay } = usePlayerStore();
  const incrementView = useIncrementQuestionView();
  const hasTracked = useRef(false);

  // Incrémenter le compteur de vues au premier rendu
  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;
    incrementView.mutate(question.id);
  }, [question.id]);

  const title = getLocalizedField(question as unknown as Record<string, unknown>, 'title', currentLanguage);
  const questionText = getLocalizedField(question as unknown as Record<string, unknown>, 'question', currentLanguage);
  const categoryName = question.category
    ? getLocalizedField(question.category as unknown as Record<string, unknown>, 'name', currentLanguage)
    : '';

  const handlePlayAnswer = (answer: Question['answers'][0]) => {
    // Si c'est le même audio qui joue, on toggle
    if (currentAudio?.id === answer.id) {
      togglePlay();
      return;
    }

    // Sinon on charge un nouvel audio
    const audioItem: Audio = {
      id: answer.id,
      title_fr: question.title_fr,
      title_en: question.title_en,
      title_ar: question.title_ar,
      category: question.category,
      language: answer.language,
      audio_url: answer.audio_url,        // audio_url (pas audio_file)
      cover_image_url: '',
      duration: answer.duration,
      duration_seconds: undefined,
      plays_count: 0,
      downloads_count: 0,                  // requis par le type Audio
      is_published: true,
      created_at: '',
      updated_at: '',
    } as unknown as Audio;

    setCurrentAudio(audioItem);
  };

  const isAnswerPlaying = (answerId: string) =>
    currentAudio?.id === answerId && isPlaying;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <Link
        to="/questions"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> {t('common.back')}
      </Link>

      <div className="card p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-start gap-3 mb-6">
          <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <HelpCircle size={20} className="text-primary" />
          </div>
          <div>
            {categoryName && (
              <span
                className="inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-2"
                style={{
                  backgroundColor: `${question.category?.color || '#1EA478'}20`,
                  color: question.category?.color || '#1EA478',
                }}
              >
                {categoryName}
              </span>
            )}
            <h1 className="text-xl lg:text-2xl font-bold text-[var(--text-primary)]">{title}</h1>
            <div className="flex items-center gap-2 mt-2 text-xs text-[var(--text-secondary)]">
              <Eye size={12} /> {formatNumber(question.views_count)} vues
              {question.keywords && (
                <span className="ml-2">· {question.keywords}</span>
              )}
            </div>
          </div>
        </div>

        {/* Question text */}
        {questionText && (
          <div className="mb-6 p-4 rounded-2xl bg-[var(--border-light)]/50">
            <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2">
              Question
            </h2>
            <p className="text-[var(--text-primary)] leading-relaxed whitespace-pre-line">{questionText}</p>
          </div>
        )}

        {/* Answers */}
        {question.answers?.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
              {t('questions.answer')}
            </h2>
            {question.answers.map((answer) => {
              const transcript = getLocalizedField(answer as unknown as Record<string, unknown>, 'transcript', currentLanguage);
              const playing = isAnswerPlaying(answer.id);
              return (
                <div key={answer.id} className="p-4 rounded-2xl border border-[var(--border-light)]">
                  {/* Bouton lecture audio */}
                  {answer.audio_url && (
                    <button
                      onClick={() => handlePlayAnswer(answer)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors mb-4 ${
                        playing
                          ? 'bg-primary/10 text-primary border border-primary/30'
                          : 'bg-primary text-white hover:bg-primary-dark'
                      }`}
                    >
                      <Headphones size={15} />
                      {playing
                        ? t('audio.pause', 'Pause')
                        : t('questions.listen_answer', 'Écouter la réponse')}
                      {answer.duration && ` (${answer.duration})`}
                    </button>
                  )}

                  {/* Transcription avec sauts de ligne préservés */}
                  {transcript && (
                    <div>
                      <h3 className="text-xs font-medium text-[var(--text-secondary)] uppercase mb-2">
                        {t('questions.transcript', 'Transcription')}
                      </h3>
                      <div className="text-[var(--text-primary)] leading-relaxed text-sm whitespace-pre-line">
                        {transcript}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};