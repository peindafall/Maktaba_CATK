import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';
import type { AxiosError } from 'axios';
import { authService } from '../services/authService';
import { PasswordInput } from '../components/common/PasswordInput';
import { Button } from '../components/common/Button';
import { AuthCard, FormError } from '../components/common/AuthCard';
import { validatePassword, validatePasswordMatch, isNumericOnly } from '../utils/validators';
import { usePageTitle } from '../hooks/usePageTitle';

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  usePageTitle(t('auth.reset_title'));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword(password)) return setError(t('auth.errors.password_short'));
    if (isNumericOnly(password)) return setError(t('auth.errors.password_weak'));
    if (!validatePasswordMatch(password, confirm)) return setError(t('auth.errors.password_mismatch'));
    setError('');
    setLoading(true);
    try {
      await authService.confirmPasswordReset(token, password);
      setDone(true);
    } catch (err) {
      const data = (err as AxiosError<{ new_password?: string[] }>)?.response?.data;
      setError(data?.new_password ? t('auth.errors.password_weak') : t('auth.reset_invalid'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title={t('auth.reset_title')}>
      {done ? (
        <div className="text-center">
          <CheckCircle2 size={48} className="text-primary mx-auto mb-3" />
          <p className="text-sm text-[var(--text-secondary)] mb-6">{t('auth.reset_success')}</p>
          <Link to="/connexion" className="btn-primary inline-block">{t('auth.login_btn')}</Link>
        </div>
      ) : !token ? (
        <div className="text-center space-y-4">
          <FormError message={t('auth.reset_invalid')} />
          <Link to="/mot-de-passe-oublie" className="text-primary hover:underline text-sm">{t('auth.forgot_password')}</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5" noValidate>
          <PasswordInput label={t('auth.new_password')} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
          <PasswordInput label={t('auth.confirm_password')} value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
          <FormError message={error} />
          <Button type="submit" className="w-full" isLoading={loading}>{t('auth.reset_btn')}</Button>
        </form>
      )}
    </AuthCard>
  );
};

export default ResetPasswordPage;
