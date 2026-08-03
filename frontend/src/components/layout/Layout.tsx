import { Header } from './Header';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { ErrorBoundary } from '../common/ErrorBoundary';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ErrorBoundary>
        <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      </ErrorBoundary>
      <Footer />
      <MobileNav />
    </div>
  );
};
