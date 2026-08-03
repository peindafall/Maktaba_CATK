import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import Logo from '../assets/logo.svg';
import { validateEmail, validatePassword, validatePasswordMatch } from '../utils/validators';

const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { registerMutation } = useAuth();
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    password_confirm: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!validateEmail(form.email)) errs.email = 'Email invalide';
    if (!form.username.trim()) errs.username = 'Nom d\'utilisateur requis';
    if (!validatePassword(form.password)) errs.password = 'Mot de passe trop court (min 8 caractères)';
    if (!validatePasswordMatch(form.password, form.password_confirm)) {
      errs.password_confirm = 'Les mots de passe ne correspondent pas';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    try {
      await registerMutation.mutateAsync(form);
      navigate('/');
    } catch {
      setApiError('Une erreur s\'est produite. Veuillez réessayer.');
    }
  };

  const set = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/">
            <img src={Logo} alt="Maktaba CATK" className="h-16 mx-auto mb-4" />
          </Link>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('auth.register_title')}</h1>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="email"
              label={t('auth.email')}
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              leftIcon={<Mail size={16} />}
              error={errors.email}
              required
            />
            <Input
              type="text"
              label={t('auth.username')}
              value={form.username}
              onChange={(e) => set('username', e.target.value)}
              leftIcon={<User size={16} />}
              error={errors.username}
              required
            />
            <Input
              type="password"
              label={t('auth.password')}
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              leftIcon={<Lock size={16} />}
              error={errors.password}
              required
            />
            <Input
              type="password"
              label={t('auth.confirm_password')}
              value={form.password_confirm}
              onChange={(e) => set('password_confirm', e.target.value)}
              leftIcon={<Lock size={16} />}
              error={errors.password_confirm}
              required
            />

            {apiError && (
              <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl">{apiError}</p>
            )}

            <Button type="submit" className="w-full" isLoading={registerMutation.isPending}>
              {t('auth.register_btn')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              {t('auth.has_account')}{' '}
              <Link to="/connexion" className="text-primary font-semibold hover:underline">
                {t('auth.login_btn')}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
