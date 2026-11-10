import { useTranslation } from 'react-i18next';
import { Button } from './Button';

export const ListError = ({ onRetry }: { onRetry: () => void }) => {
  const { t } = useTranslation();
  return (
    <div className="text-center py-12">
      <p className="text-red-500 mb-4">{t('common.error')}</p>
      <Button onClick={onRetry}>{t('common.retry')}</Button>
    </div>
  );
};
