import { useTranslation } from 'react-i18next';

interface SearchFiltersProps {
  activeType: string;
  onTypeChange: (type: string) => void;
}

const TYPES = [
  { value: '', labelKey: 'search.all_types' },
  { value: 'teachings', labelKey: 'search.type_teachings' },
  { value: 'audios', labelKey: 'search.type_audios' },
  { value: 'videos', labelKey: 'search.type_videos' },
  { value: 'questions', labelKey: 'search.type_questions' },
];

export const SearchFilters = ({ activeType, onTypeChange }: SearchFiltersProps) => {
  const { t } = useTranslation();

  return (
    <div className="chips-scroll flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
      {TYPES.map(({ value, labelKey }) => (
        <button
          key={value}
          onClick={() => onTypeChange(value)}
          className={`flex-shrink-0 whitespace-nowrap px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-150 ${
            activeType === value
              ? 'bg-primary text-white shadow-md'
              : 'bg-[var(--surface)] border border-[var(--border-light)] text-[var(--text-secondary)] hover:border-primary hover:text-primary'
          }`}
        >
          {t(labelKey)}
        </button>
      ))}
    </div>
  );
};
