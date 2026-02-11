
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from './translations';

export type Language = 'en' | 'vn' | 'zh';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('upbot-lang');
      if (saved === 'en' || saved === 'vn' || saved === 'zh') {
        return saved;
      }
      return 'vn'; // Default to Vietnamese for DNSE
    } catch {
      return 'vn';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('upbot-lang', lang);
    } catch (e) {
      console.error('Failed to save language preference', e);
    }
  }, [lang]);

  // We cast to the English structure as they are identical
  const t = translations[lang] as typeof translations.en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
