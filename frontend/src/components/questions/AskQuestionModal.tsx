import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Send } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useAskQuestion, useQuestionCategories } from '../../hooks/useQuestions';
import { useAuthStore } from '../../stores/authStore';
import { useLanguage } from '../../hooks/useLanguage';
import { getLocalizedField } from '../../utils/formatters';
import { validateEmail } from '../../utils/validators';
import { extractApiErrors } from '../../services/api';
import type { AxiosError } from 'axios';

interface AskQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Formulaire permettant aux visiteurs et aux membres de poser une question au Professeur. */
export const AskQuestionModal = ({ isOpen, onClose }: AskQuestionModalProps) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: categories } = useQuestionCategories(isOpen);
  const ask = useAskQuestion();

  const [form, setForm] = useState({ title: '', question: '', category: '', name: '', email: '', website: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const close = () => {
    onClose();
    setTimeout(() => {
      setSent(false);
      setErrors({});
      setForm({ title: '', question: '', category: '', name: '', email: '', website: '' });
    }, 300);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.title.trim().length < 8) errs.title = t('questions.error_title');
    if (form.question.trim().length < 10) errs.question = t('questions.error_question');
    if (!isAuthenticated && !validateEmail(form.email)) errs.email = t('questions.error_email');
    setErrors(errs);
    if (Object.keys(errs).length) return;

    try {
      await ask.mutateAsync({
        title: form.title.trim(),
        question: form.question.trim(),
        category: form.category || null,
        name: form.name.trim(),
        email: isAuthenticated ? '' : form.email.trim(),
        language: currentLanguage,
        website: form.website,
      });
      setSent(true);
    } catch (err) {
      if ((err as AxiosError)?.response?.status === 429) {
        setErrors({ form: t('questions.error_rate') });
        return;
      }
      const api = extractApiErrors(err);
      setErrors({
        title: api.title?.[0] ? t('questions.error_title') : '',
        question: api.question?.[0] ? t('questions.error_question') : '',
        email: api.email?.[0] ? t('questions.error_email') : '',
        form: api.non_field_errors?.[0] === '__network__' ? t('auth.errors.network') : '',
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={close} title={sent ? undefined : t('questions.ask_title')} size="lg">
      {sent ? (
        <div className="text-center py-6">
          <CheckCircle2 size={56} className="text-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{t('questions.sent_title')}</h3>
          <p className="text-[var(--text-secondary)] mb-6">{t('questions.sent_desc')}</p>
          <Button onClick={close}>{t('common.close')}</Button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          <p className="text-sm text-[var(--text-secondary)]">{t('questions.ask_intro')}</p>

          <div>
            <label htmlFor="q-title" className="block text-sm font-medium mb-1.5">{t('questions.form_title')}</label>
            <input
              id="q-title"
              className="input-base"
              value={form.title}
              maxLength={300}
              onChange={(e) => set('title', e.target.value)}
              placeholder={t('questions.form_title_ph')}
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="q-body" className="block text-sm font-medium mb-1.5">{t('questions.form_question')}</label>
            <textarea
              id="q-body"
              className="input-base min-h-[140px] resize-y"
              value={form.question}
              maxLength={4000}
              onChange={(e) => set('question', e.target.value)}
              placeholder={t('questions.form_question_ph')}
            />
            <div className="flex justify-between">
              {errors.question ? <p className="mt-1 text-sm text-red-500">{errors.question}</p> : <span />}
              <span className="text-xs text-[var(--text-secondary)] mt-1">{form.question.length}/4000</span>
            </div>
          </div>

          {categories && categories.length > 0 && (
            <div>
              <label htmlFor="q-cat" className="block text-sm font-medium mb-1.5">{t('questions.form_category')}</label>
              <select id="q-cat" className="input-base" value={form.category} onChange={(e) => set('category', e.target.value)}>
                <option value="">{t('questions.form_category_none')}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {getLocalizedField(c, 'name', currentLanguage)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!isAuthenticated && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="q-name" className="block text-sm font-medium mb-1.5">{t('questions.form_name')}</label>
                <input id="q-name" className="input-base" value={form.name} maxLength={120} autoComplete="name" onChange={(e) => set('name', e.target.value)} />
              </div>
              <div>
                <label htmlFor="q-email" className="block text-sm font-medium mb-1.5">{t('questions.form_email')}</label>
                <input
                  id="q-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  className="input-base"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder={t('auth.email_placeholder')}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>
              <p className="sm:col-span-2 text-xs text-[var(--text-secondary)] -mt-2">{t('questions.form_email_help')}</p>
            </div>
          )}
          {isAuthenticated && user && (
            <p className="text-xs text-[var(--text-secondary)]">
              {user.username} · {user.email}
            </p>
          )}

          {/* Champ invisible anti-robots : un humain ne le remplit jamais */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(e) => set('website', e.target.value)}
            className="hidden"
            aria-hidden="true"
          />

          {errors.form && <p className="text-sm text-red-500 bg-red-500/10 px-4 py-2 rounded-xl">{errors.form}</p>}

          <Button type="submit" className="w-full" isLoading={ask.isPending} leftIcon={<Send size={16} className="rtl:-scale-x-100" />}>
            {t('questions.form_submit')}
          </Button>
        </form>
      )}
    </Modal>
  );
};
