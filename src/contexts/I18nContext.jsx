import { createContext, useContext, useState, useCallback } from 'react';
import fr from '../locales/fr';
import en from '../locales/en';

const translations = { fr, en };
const LS_LANG_KEY = 'tinogreyhat_lang';

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem(LS_LANG_KEY);
      if (saved && translations[saved]) return saved;
    } catch { /* ignore */ }
    // Default to French as per user preference
    return 'fr';
  });

  const changeLanguage = useCallback((newLang) => {
    if (translations[newLang]) {
      setLang(newLang);
      try {
        localStorage.setItem(LS_LANG_KEY, newLang);
      } catch { /* ignore */ }
    }
  }, []);

  const t = useCallback((key, params = {}) => {
    const keys = key.split('.');
    let result = translations[lang];

    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        // Fallback to French if key not found
        result = translations.fr;
        for (const fk of keys) {
          if (result && typeof result === 'object' && fk in result) {
            result = result[fk];
          } else {
            return key; // Return key if not found at all
          }
        }
        break;
      }
    }

    if (typeof result === 'string') {
      // Simple parameter interpolation
      return result.replace(/\{\{(\w+)\}\}/g, (match, param) => params[param] || match);
    }

    // Return arrays and objects as-is (e.g., home.badges, home.titles)
    return result;
  }, [lang]);

  const value = {
    lang,
    setLang: changeLanguage,
    t,
    availableLangs: ['fr', 'en'],
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}