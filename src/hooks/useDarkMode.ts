import { useState, useEffect } from 'react';
import type { ThemeMode } from '../types';

export function useDarkMode(): [ThemeMode, () => void] {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem('theme-mode');
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  const toggle = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return [mode, toggle];
}
