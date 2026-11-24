import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const THEME_MODES = {
  dark: 'dark',
  light: 'light',
  system: 'system',
};

const LS_THEME_MODE_KEY = 'tinogreyhat_theme_mode';
const LS_COLOR_THEME_KEY = 'tinogreyhat_color_theme';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try {
      const saved = localStorage.getItem(LS_THEME_MODE_KEY);
      if (saved && THEME_MODES[saved]) return saved;
    } catch { /* ignore */ }
    return 'system';
  });

  const [resolvedMode, setResolvedMode] = useState('dark');
  const [colorTheme, setColorTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(LS_COLOR_THEME_KEY);
      if (saved) return saved;
    } catch { /* ignore */ }
    return 'green';
  });

  const [isReady, setIsReady] = useState(false);

  // Apply resolved mode (dark/light) - must be defined before useEffect that uses it
  const applyResolvedMode = useCallback((resolved) => {
    const root = document.documentElement;
    if (resolved === 'dark') {
      root.classList.remove('light-mode');
      root.classList.add('dark-mode');
    } else {
      root.classList.remove('dark-mode');
      root.classList.add('light-mode');
    }
  }, []);

  // Detect system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (mode === 'system') {
        setResolvedMode(e.matches ? 'dark' : 'light');
        applyResolvedMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    // Initial check
    if (mode === 'system') {
      setResolvedMode(mediaQuery.matches ? 'dark' : 'light');
      applyResolvedMode(mediaQuery.matches ? 'dark' : 'light');
    }

    setIsReady(true);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode, applyResolvedMode]);

  // Apply color theme (green, cyan, red, etc.)
  const applyColorTheme = useCallback((themeKey) => {
    // Import themes dynamically to avoid circular dependency
    import('../utils/theme').then(({ THEMES, applyTheme }) => {
      if (THEMES[themeKey]) {
        applyTheme(themeKey);
      }
    });
  }, []);

  // Initialize on mount
  useEffect(() => {
    // Apply resolved mode
    applyResolvedMode(resolvedMode);
    // Apply color theme
    applyColorTheme(colorTheme);
  }, [resolvedMode, colorTheme, applyResolvedMode, applyColorTheme]);

  const changeMode = useCallback((newMode) => {
    if (THEME_MODES[newMode]) {
      setMode(newMode);
      try {
        localStorage.setItem(LS_THEME_MODE_KEY, newMode);
      } catch { /* ignore */ }

      if (newMode === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setResolvedMode(isDark ? 'dark' : 'light');
        applyResolvedMode(isDark ? 'dark' : 'light');
      } else {
        setResolvedMode(newMode);
        applyResolvedMode(newMode);
      }
    }
  }, [applyResolvedMode]);

  const changeColorTheme = useCallback((newTheme) => {
    import('../utils/theme').then(({ THEMES }) => {
      if (THEMES[newTheme]) {
        setColorTheme(newTheme);
        try {
          localStorage.setItem(LS_COLOR_THEME_KEY, newTheme);
        } catch { /* ignore */ }
        applyColorTheme(newTheme);
      }
    });
  }, [applyColorTheme]);

  const toggleMode = useCallback(() => {
    const modes = ['dark', 'light', 'system'];
    const currentIndex = modes.indexOf(mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    changeMode(modes[nextIndex]);
  }, [mode, changeMode]);

  const value = {
    mode,
    resolvedMode,
    colorTheme,
    setMode: changeMode,
    setColorTheme: changeColorTheme,
    toggleMode,
    availableModes: ['dark', 'light', 'system'],
    isReady,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}