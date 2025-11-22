export interface LanguageSwitcherProps {
  locale: 'EN' | 'FR';
  onChange: (locale: 'EN' | 'FR') => void;
}

export function LanguageSwitcher({ locale, onChange }: LanguageSwitcherProps) {
  return (
    <div className="inline-flex rounded-full border border-border bg-card p-1 text-xs font-semibold text-muted-foreground">
      {(['EN', 'FR'] as const).map((language) => (
        <button
          key={language}
          type="button"
          className={`rounded-full px-3 py-1 transition ${
            locale === language ? 'bg-violet-500 text-white' : 'hover:text-foreground'
          }`}
          onClick={() => onChange(language)}
        >
          {language === 'EN' ? 'English' : 'Français'}
        </button>
      ))}
    </div>
  );
}


