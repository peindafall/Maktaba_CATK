import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  defaultValue?: string;
  autoFocus?: boolean;
  className?: string;
}

export const SearchBar = ({ defaultValue = '', autoFocus, className }: SearchBarProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      navigate(`/recherche?q=${encodeURIComponent(value.trim())}`);
    }
  };

  const handleClear = () => {
    setValue('');
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className={className} role="search">
      <div className="relative">
        <Search
          size={18}
          className="absolute start-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
        />
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t('search.placeholder')}
          autoFocus={autoFocus}
          className="input-base ps-11 pe-10 py-3 text-base"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Effacer"
            className="absolute end-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[var(--border-light)] transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </form>
  );
};
