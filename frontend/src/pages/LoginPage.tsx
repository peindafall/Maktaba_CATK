import { useState } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';
import type { AxiosError } from 'axios';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/common/Input';
import { PasswordInput } from '../components/common/PasswordInput';
import { Button } from '../components/common/Button';
import { AuthCard, FormError } from '../components/common/AuthCard';
import { toast } from '../stores/toastStore';
import { usePageTitle } from '../hooks/usePageTitle';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || '/';
  const { loginMutation, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  usePageTitle(t('auth.login_title'));

  if (isAuthenticated && !loginMutation.isPending) return <Navigate to={from} replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await loginMutation.mutateAsync({ email, password });
      toast.success(t('auth.login_success'));
      navigate(from, { replace: true });
    } catch (err) {
      const status = (err as AxiosError)?.response?.status;
      if (!status) setError(t('auth.errors.network'));
      else if (status === 429) setError(t('auth.errors.too_many'));
      else if (status === 401 || status === 400) setError(t('auth.errors.invalid_credentials'));
      else setError(t('auth.errors.generic'));
    }
  };

  return (
    <AuthCard title={t('auth.login_title')} subtitle="Maktaba CATK">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Input
          type="email"
          inputMode="email"
          label={t('auth.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('auth.email_placeholder')}
          leftIcon={<Mail size={16} />}
          required
          autoComplete="email"
          autoCapitalize="none"
        />
        <div>
          <PasswordInput
            label={t('auth.password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <div className="text-end mt-2">
            <Link to="/mot-de-passe-oublie" className="text-sm text-primary hover:underline">
              {t('auth.forgot_password')}
            </Link>
          </div>
        </div>

        <FormError message={error} />

        <Button type="submit" className="w-full" isLoading={loginMutation.isPending}>
          {t('auth.login_btn')}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
        {t('auth.no_account')}{' '}
        <Link to="/inscription" state={{ from }} className="text-primary font-semibold hover:underline">
          {t('auth.register_btn')}
        </Link>
      </p>
    </AuthCard>
  );
};

export default LoginPage;
