'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  resolvedTheme?: string;
  themes: string[];
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  resolvedTheme: 'light',
  themes: ['light', 'dark'],
});

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'mediassist-theme',
}: {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  storageKey?: string;
}) {
  const [theme, setThemeState] = useState<string>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(storageKey);
    if (saved === 'dark' || saved === 'light') {
      setThemeState(saved);
    } else {
      setThemeState('light');
    }
  }, [storageKey]);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const active = theme === 'dark' ? 'dark' : 'light';

    if (active === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, mounted]);

  const setTheme = (newTheme: string) => {
    const valid = newTheme === 'dark' ? 'dark' : 'light';
    setThemeState(valid);
    localStorage.setItem(storageKey, valid);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme: theme, themes: ['light', 'dark'] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

