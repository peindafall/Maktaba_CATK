import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, Lock, Heart, LogOut, HelpCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { authService } from '../services/authService';
import { Button } from '../components/common/Button';
import { PasswordInput } from '../components/common/PasswordInput';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { FormError } from '../components/common/AuthCard';
import { toast } from '../stores/toastStore';
import { formatDate } from '../utils/formatters';
import { isNumericOnly, validatePassword } from '../utils/validators';
import { usePageTitle } from '../hooks/usePageTitle';
import type { AppLanguage } from '../i18n/config';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { currentLanguage, changeLanguage } = useLanguage();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [pwd, setPwd] = useState({ old: '', new: '' });
  const [pwdError, setPwdError] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  usePageTitle(t('profile.title'));

  const setLang = (lang: AppLanguage) => {
    changeLanguage(lang);
    authService.updateProfile({ preferred_language: lang }).catch(() => {});
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword(pwd.new)) return setPwdError(t('auth.errors.password_short'));
    if (isNumericOnly(pwd.new)) return setPwdError(t('auth.errors.password_weak'));
    setPwdError('');
    setPwdLoading(true);
    try {
      await authService.changePassword({ old_password: pwd.old, new_password: pwd.new });
      toast.success(t('profile.password_changed'));
      setPwd({ old: '', new: '' });
    } catch (err: any) {
      const data = err?.response?.data;
      setPwdError(data?.old_password ? t('auth.errors.invalid_credentials') : data?.new_password ? t('auth.errors.password_weak') : t('auth.errors.generic'));
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('profile.title')}</h1>

      <div className="card p-6 flex items-center gap-4">
        <div className="w-16 h-16 flex-shrink-0 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
          {(user?.username?.[0] || '?').toUpperCase()}
        </div>
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-[var(--text-primary)] truncate">{user?.username}</h2>
          <p className="text-[var(--text-secondary)] truncate">{user?.email}</p>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {user?.role && (
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">{t(`profile.role_${user.role}`)}</span>
            )}
            {user?.created_at && (
              <span className="text-xs text-[var(--text-secondary)]">
                {t('profile.member_since', { date: formatDate(user.created_at, i18n.language) })}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link to="/favoris" className="card p-4 flex items-center gap-3 hover:border-primary">
          <Heart size={18} className="text-red-500" /> <span className="font-medium text-sm">{t('nav.favorites')}</span>
        </Link>
        <Link to="/questions" className="card p-4 flex items-center gap-3 hover:border-primary">
          <HelpCircle size={18} className="text-primary" /> <span className="font-medium text-sm">{t('questions.my_questions')}</span>
        </Link>
      </div>

      <section className="card p-6">
        <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <Globe size={18} className="text-primary" /> {t('profile.preferred_language')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {([['fr', 'Français'], ['en', 'English'], ['ar', 'العربية']] as const).map(([code, label]) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              className={`px-4 py-2 rounded-2xl text-sm font-medium transition-colors ${
                currentLanguage === code ? 'bg-primary text-white' : 'border border-[var(--border-light)] text-[var(--text-secondary)] hover:border-primary hover:text-primary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="card p-6">
        <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <Lock size={18} className="text-primary" /> {t('profile.change_password')}
        </h3>
        <form onSubmit={changePassword} className="space-y-4" noValidate>
          <PasswordInput label={t('auth.current_password')} value={pwd.old} onChange={(e) => setPwd((p) => ({ ...p, old: e.target.value }))} autoComplete="current-password" />
          <PasswordInput label={t('auth.new_password')} value={pwd.new} onChange={(e) => setPwd((p) => ({ ...p, new: e.target.value }))} autoComplete="new-password" />
          <FormError message={pwdError} />
          <Button type="submit" variant="outline" isLoading={pwdLoading} disabled={!pwd.old || !pwd.new}>
            {t('common.save')}
          </Button>
        </form>
      </section>

      <Button variant="danger" onClick={() => setConfirmLogout(true)} className="w-full" leftIcon={<LogOut size={16} className="rtl:rotate-180" />}>
        {t('nav.logout')}
      </Button>

      <ConfirmDialog
        isOpen={confirmLogout}
        title={t('auth.logout_confirm_title')}
        message={t('auth.logout_confirm_text')}
        confirmLabel={t('auth.logout_confirm_btn')}
        danger
        onCancel={() => setConfirmLogout(false)}
        onConfirm={async () => {
          setConfirmLogout(false);
          await logout();
          toast.success(t('auth.logout_success'));
          navigate('/', { replace: true });
        }}
      />
    </div>
  );
};

export default ProfilePage;
