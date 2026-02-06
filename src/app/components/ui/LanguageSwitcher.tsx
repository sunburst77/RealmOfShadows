import { Languages } from 'lucide-react';
import { Language } from '../../translations';

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  const languages: { code: Language; label: string }[] = [
    { code: 'ko', label: '한국어' },
    { code: 'en', label: 'English' },
    { code: 'ja', label: '日本語' }
  ];

  return (
    <div className="flex items-center gap-1">
      <Languages className="w-4 h-4 text-[var(--color-primary-gold)]" />
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onLanguageChange(lang.code)}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
            currentLanguage === lang.code
              ? 'text-[var(--color-background-deep-black)]'
              : 'text-[var(--color-primary-gold)]/60 hover:text-[var(--color-primary-gold)]'
          }`}
          style={{
            backgroundColor: currentLanguage === lang.code ? 'var(--color-primary-gold)' : 'transparent'
          }}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}