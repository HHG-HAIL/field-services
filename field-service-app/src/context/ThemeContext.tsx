import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type ThemeSetting = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  setting: ThemeSetting;
  resolvedTheme: ResolvedTheme;
  setTheme: (setting: ThemeSetting) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'field-service-theme';

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined') {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getInitialTheme = (): ThemeSetting => {
  if (typeof window === 'undefined') {
    return 'light';
  }
  const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeSetting | null;
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'system';
};

const applyThemeToDocument = (setting: ThemeSetting) => {
  if (typeof document === 'undefined') {
    return;
  }
  const root = document.documentElement;
  const resolved = setting === 'system' ? getSystemTheme() : setting;

  root.classList.remove('light', 'dark');
  root.classList.add(resolved);

  if (resolved === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [setting, setSetting] = useState<ThemeSetting>(() => getInitialTheme());
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    setting === 'system' ? getSystemTheme() : setting
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleSystemChange = (event: MediaQueryListEvent) => {
      if (setting === 'system') {
        const newTheme: ResolvedTheme = event.matches ? 'dark' : 'light';
        setResolvedTheme(newTheme);
        applyThemeToDocument('system');
      }
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemChange);

    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [setting]);

  useEffect(() => {
    applyThemeToDocument(setting);
    const resolved = setting === 'system' ? getSystemTheme() : setting;
    setResolvedTheme(resolved);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, setting);
    }
  }, [setting]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      setting,
      resolvedTheme,
      setTheme: (nextSetting: ThemeSetting) => setSetting(nextSetting),
      toggleTheme: () => {
        setSetting((prev) => {
          if (prev === 'system') {
            return resolvedTheme === 'dark' ? 'light' : 'dark';
          }
          return prev === 'dark' ? 'light' : 'dark';
        });
      },
    }),
    [setting, resolvedTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
