import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, CheckCircle2 } from 'lucide-react';
import { authService } from '../services/authService';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { AuthCard, FormError } from '../components/common/AuthCard';
import { validateEmail } from '../utils/validators';
import { usePageTitle } from '../hooks/usePageTitle';

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  usePageTitle(t('auth.forgot_title'));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return setError(t('auth.errors.invalid_email'));
    setError('');
    setLoading(true);
    try {
      await authService.requestPasswordReset(email);
      setSent(true);
    } catch {
      setError(t('auth.errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title={t('auth.forgot_title')} subtitle={sent ? undefined : t('auth.forgot_desc')}>
      {sent ? (
        <div className="text-center">
          <CheckCircle2 size={48} className="text-primary mx-auto mb-3" />
          <p className="text-sm text-[var(--text-secondary)] mb-6">{t('auth.forgot_sent')}</p>
          <Link to="/connexion" className="btn-primary inline-block">{t('auth.back_to_login')}</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5" noValidate>
          <Input
            type="email"
            inputMode="email"
            label={t('auth.email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.email_placeholder')}
            leftIcon={<Mail size={16} />}
            autoComplete="email"
            autoCapitalize="none"
          />
          <FormError message={error} />
          <Button type="submit" className="w-full" isLoading={loading}>{t('auth.forgot_btn')}</Button>
          <p className="text-center text-sm">
            <Link to="/connexion" className="text-primary hover:underline">{t('auth.back_to_login')}</Link>
          </p>
        </form>
      )}
    </AuthCard>
  );
};

export default ForgotPasswordPage;
