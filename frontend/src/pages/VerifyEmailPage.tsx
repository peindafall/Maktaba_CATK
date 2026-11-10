import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import { api } from '../services/api';
import { AuthCard } from '../components/common/AuthCard';
import { Spinner } from '../components/common/Spinner';

/** Lien reçu par email après l'inscription : /verifier-email?token=... */
const VerifyEmailPage = () => {
  const [params] = useSearchParams();
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');

  useEffect(() => {
    const token = params.get('token');
    if (!token) return setState('error');
    api
      .post('/auth/verify-email/', { token })
      .then(() => setState('ok'))
      .catch(() => setState('error'));
  }, [params]);

  return (
    <AuthCard title="Email">
      <div className="text-center py-4">
        {state === 'loading' && <Spinner size="lg" className="mx-auto" />}
        {state === 'ok' && <CheckCircle2 size={48} className="text-primary mx-auto" />}
        {state === 'error' && <XCircle size={48} className="text-red-500 mx-auto" />}
        <Link to="/" className="btn-primary inline-block mt-6">Maktaba CATK</Link>
      </div>
    </AuthCard>
  );
};

export default VerifyEmailPage;
