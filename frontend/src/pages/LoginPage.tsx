import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import Logo from '../assets/logo.svg';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loginMutation } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await loginMutation.mutateAsync({ email, password });
      navigate('/');
    } catch (err: unknown) {
      setError('Email ou mot de passe incorrect.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <img src={Logo} alt="Maktaba CATK" className="h-16 mx-auto mb-4" />
          </Link>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('auth.login_title')}</h1>
          <p className="text-[var(--text-secondary)] mt-1">Maktaba CATK</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="email"
              label={t('auth.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              leftIcon={<Mail size={16} />}
              required
              autoComplete="email"
            />
            <Input
              type={showPassword ? 'text' : 'password'}
              label={t('auth.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock size={16} />}
              rightIcon={
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              required
              autoComplete="current-password"
            />

            {error && (
              <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              isLoading={loginMutation.isPending}
            >
              {t('auth.login_btn')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              {t('auth.no_account')}{' '}
              <Link to="/inscription" className="text-primary font-semibold hover:underline">
                {t('auth.register_btn')}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
