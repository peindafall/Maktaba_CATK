import { useState } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, User } from 'lucide-react';
import type { AxiosError } from 'axios';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/common/Input';
import { PasswordInput } from '../components/common/PasswordInput';
import { Button } from '../components/common/Button';
import { AuthCard, FormError } from '../components/common/AuthCard';
import { extractApiErrors } from '../services/api';
import { toast } from '../stores/toastStore';
import { validateEmail, validatePassword, validatePasswordMatch, isNumericOnly } from '../utils/validators';
import { usePageTitle } from '../hooks/usePageTitle';

type Field = 'email' | 'username' | 'password' | 'password_confirm';

const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || '/';
  const { registerMutation, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ email: '', username: '', password: '', password_confirm: '' });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [apiError, setApiError] = useState('');
  usePageTitle(t('auth.register_title'));

  if (isAuthenticated && !registerMutation.isPending) return <Navigate to={from} replace />;

  const validate = () => {
    const errs: Partial<Record<Field, string>> = {};
    if (!validateEmail(form.email)) errs.email = t('auth.errors.invalid_email');
    if (form.username.trim().length < 2) errs.username = t('auth.errors.username_required');
    if (!validatePassword(form.password)) errs.password = t('auth.errors.password_short');
    else if (isNumericOnly(form.password)) errs.password = t('auth.errors.password_weak');
    if (!validatePasswordMatch(form.password, form.password_confirm)) errs.password_confirm = t('auth.errors.password_mismatch');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /** Traduit les erreurs du serveur dans la langue de l'utilisateur. */
  const mapServerErrors = (err: unknown) => {
    const status = (err as AxiosError)?.response?.status;
    if (status === 429) return setApiError(t('auth.errors.too_many'));
    const api = extractApiErrors(err);
    if (api.non_field_errors?.[0] === '__network__') return setApiError(t('auth.errors.network'));
    const next: Partial<Record<Field, string>> = {};
    if (api.email) next.email = /exist|déjà|already/i.test(api.email[0]) ? t('auth.errors.email_taken') : t('auth.errors.invalid_email');
    if (api.username) next.username = /pris|exist|taken/i.test(api.username[0]) ? t('auth.errors.username_taken') : t('auth.errors.username_required');
    if (api.password) next.password = t('auth.errors.password_weak');
    if (api.password_confirm) next.password_confirm = t('auth.errors.password_mismatch');
    setErrors(next);
    if (!Object.keys(next).length) setApiError(t('auth.errors.generic'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    try {
      await registerMutation.mutateAsync(form);
      toast.success(t('auth.register_success'));
      navigate(from, { replace: true });
    } catch (err) {
      mapServerErrors(err);
    }
  };

  const set = (field: Field, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  return (
    <AuthCard title={t('auth.register_title')}>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Input
          type="email"
          inputMode="email"
          label={t('auth.email')}
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
          placeholder={t('auth.email_placeholder')}
          leftIcon={<Mail size={16} />}
          error={errors.email}
          autoComplete="email"
          autoCapitalize="none"
          required
        />
        {errors.email === t('auth.errors.email_taken') && (
          <p className="-mt-3 text-sm">
            <Link to="/connexion" className="text-primary font-semibold hover:underline">{t('auth.login_btn')}</Link>
            {' · '}
            <Link to="/mot-de-passe-oublie" className="text-primary hover:underline">{t('auth.forgot_password')}</Link>
          </p>
        )}
        <Input
          type="text"
          label={t('auth.username')}
          value={form.username}
          onChange={(e) => set('username', e.target.value)}
          leftIcon={<User size={16} />}
          error={errors.username}
          autoComplete="username"
          required
        />
        <div>
          <PasswordInput
            label={t('auth.password')}
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
            error={errors.password}
            autoComplete="new-password"
            required
          />
          {!errors.password && <p className="mt-1.5 text-xs text-[var(--text-secondary)]">{t('auth.password_hint')}</p>}
        </div>
        <PasswordInput
          label={t('auth.confirm_password')}
          value={form.password_confirm}
          onChange={(e) => set('password_confirm', e.target.value)}
          error={errors.password_confirm}
          autoComplete="new-password"
          required
        />

        <FormError message={apiError} />

        <Button type="submit" className="w-full" isLoading={registerMutation.isPending}>
          {t('auth.register_btn')}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
        {t('auth.has_account')}{' '}
        <Link to="/connexion" state={{ from }} className="text-primary font-semibold hover:underline">
          {t('auth.login_btn')}
        </Link>
      </p>
    </AuthCard>
  );
};

export default RegisterPage;
