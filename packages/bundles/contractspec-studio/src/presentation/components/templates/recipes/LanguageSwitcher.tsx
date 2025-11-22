export interface LanguageSwitcherProps {
  locale: 'EN' | 'FR';
  onChange: (locale: 'EN' | 'FR') => void;
}

export function LanguageSwitcher({ locale, onChange }: LanguageSwitcherProps) {
  return (
    <div className="border-border bg-card text-muted-foreground inline-flex rounded-full border p-1 text-xs font-semibold">
      {(['EN', 'FR'] as const).map((language) => (
        <button
          key={language}
          type="button"
          className={`rounded-full px-3 py-1 transition ${
            locale === language
              ? 'bg-violet-500 text-white'
              : 'hover:text-foreground'
          }`}
          onClick={() => onChange(language)}
        >
          {language === 'EN' ? 'English' : 'Français'}
        </button>
      ))}
    </div>
  );
}
