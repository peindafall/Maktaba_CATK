import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, HelpCircle, Headphones, Pause } from 'lucide-react';
import type { Audio, Question } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';
import { getLocalizedField, formatNumber, formatDuration, getCategoryName } from '../../utils/formatters';
import { usePlayerStore } from '../../stores/playerStore';
import { useIncrementQuestionView } from '../../hooks/useQuestions';
import { FavoriteButton } from '../common/FavoriteButton';
import { ShareButton } from '../common/ShareButton';
import { BackLink } from '../common/BackLink';
import { Badge } from '../common/Badge';
import { AudioDownloadButton } from '../audio/AudioDownloadButton';

interface QuestionDetailProps {
  question: Question;
}

export const QuestionDetail = ({ question }: QuestionDetailProps) => {
  const { t, i18n } = useTranslation();
  const { currentLanguage } = useLanguage();
  const playAudio = usePlayerStore((s) => s.playAudio);
  const currentId = usePlayerStore((s) => s.currentAudio?.id);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const incrementView = useIncrementQuestionView();
  const tracked = useRef<string | null>(null);

  useEffect(() => {
    if (tracked.current === question.id) return;
    tracked.current = question.id;
    incrementView.mutate(question.id);
  }, [question.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const title = getLocalizedField(question, 'title', currentLanguage);
  const questionText = getLocalizedField(question, 'question', currentLanguage);
  const categoryName = getCategoryName(question.category_info, currentLanguage, question.category_name);

  const toAudio = (answer: NonNullable<Question['answers']>[number]): Audio => ({
    id: answer.id,
    kind: 'answer',
    title_fr: question.title_fr,
    title_en: question.title_en,
    title_ar: question.title_ar,
    language: answer.language,
    audio_url: answer.audio_url || '',
    cover_image_url: null,
    duration_seconds: null,
    plays_count: 0,
    downloads_count: 0,
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <BackLink fallback="/questions" />

      <article className="card p-5 sm:p-6 lg:p-8">
        <header className="flex items-start gap-3 mb-6">
          <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <HelpCircle size={20} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            {categoryName && (
              <Badge color={question.category_info?.color} className="mb-2">
                {categoryName}
              </Badge>
            )}
            <h1 className="text-xl lg:text-2xl font-bold text-[var(--text-primary)] break-words">{title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-[var(--text-secondary)]">
              <Eye size={12} /> {formatNumber(question.views_count, i18n.language)} {t('questions.views')}
              {question.source === 'public' && <span>· {t('questions.from_visitor')}</span>}
            </div>
          </div>
          <div className="flex gap-2">
            <FavoriteButton type="question" id={question.id} title={question.title_fr} size="md" />
            <ShareButton title={title} />
          </div>
        </header>

        {questionText && (
          <section className="mb-6 p-4 rounded-2xl bg-[var(--border-light)]/50">
            <h2 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2">{t('questions.question_label')}</h2>
            <p className="text-[var(--text-primary)] leading-relaxed whitespace-pre-line break-words">{questionText}</p>
          </section>
        )}

        {!!question.answers?.length && (
          <section className="space-y-4">
            <h2 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">{t('questions.answer')}</h2>
            {question.answers.map((answer) => {
              const transcript = getLocalizedField(answer, 'transcript', currentLanguage);
              const playing = currentId === answer.id && isPlaying;
              const audio = toAudio(answer);
              return (
                <div key={answer.id} className="p-4 rounded-2xl border border-[var(--border-light)]">
                  {answer.audio_url && (
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <button
                        onClick={() => playAudio(audio)}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                          playing ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-primary text-white hover:bg-primary-dark'
                        }`}
                      >
                        {playing ? <Pause size={15} /> : <Headphones size={15} />}
                        {playing ? t('audio.pause') : t('questions.listen_answer')}
                        {answer.duration && <span className="opacity-80">({formatDuration(answer.duration)})</span>}
                      </button>
                      <AudioDownloadButton audio={audio} variant="outline" className="text-sm" />
                    </div>
                  )}
                  {transcript && (
                    <div>
                      <h3 className="text-xs font-medium text-[var(--text-secondary)] uppercase mb-2">{t('questions.transcript')}</h3>
                      <div className="text-[var(--text-primary)] leading-relaxed text-sm whitespace-pre-line break-words">{transcript}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}
      </article>
    </div>
  );
};
