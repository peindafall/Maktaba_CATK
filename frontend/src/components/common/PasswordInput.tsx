import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Input } from './Input';

type Props = Omit<React.ComponentProps<typeof Input>, 'type' | 'rightIcon' | 'leftIcon'>;

export const PasswordInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  return (
    <Input
      ref={ref}
      {...props}
      type={visible ? 'text' : 'password'}
      leftIcon={<Lock size={16} />}
      rightIcon={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? t('auth.hide_password') : t('auth.show_password')}
          className="p-1"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      }
    />
  );
});
PasswordInput.displayName = 'PasswordInput';
