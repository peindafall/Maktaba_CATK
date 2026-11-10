import { Link } from 'react-router-dom';
import Logo from '../../assets/logo.png';

export const AuthCard = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <div className="min-h-[75vh] flex items-center justify-center px-4 py-8">
    <div className="w-full max-w-md">
      <div className="text-center mb-6">
        <Link to="/" aria-label="Maktaba CATK">
          <img src={Logo} alt="Maktaba CATK" width={150} height={150} className="h-28 w-auto mx-auto mb-2" />
        </Link>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h1>
        {subtitle && <p className="text-[var(--text-secondary)] mt-1 text-sm">{subtitle}</p>}
      </div>
      <div className="card p-6 sm:p-8">{children}</div>
    </div>
  </div>
);

export const FormError = ({ message }: { message?: string }) =>
  message ? (
    <p role="alert" className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-xl">
      {message}
    </p>
  ) : null;
