interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const PageHeader = ({ title, subtitle, action }: PageHeaderProps) => (
  <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
    <div className="min-w-0">
      <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-1.5">{title}</h1>
      {subtitle && <p className="text-[var(--text-secondary)]">{subtitle}</p>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);
