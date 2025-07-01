'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (savedTheme === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    root.classList.remove('dark');
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else if (newTheme === 'system') {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      }
    }
  };

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    setShowDropdown(false);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-4 h-4 text-yellow-500" />;
      case 'dark':
        return <Moon className="w-4 h-4 text-slate-300" />;
      case 'system':
        return <Monitor className="w-4 h-4 text-slate-600 dark:text-slate-400" />;
      default:
        return <Monitor className="w-4 h-4 text-slate-600 dark:text-slate-400" />;
    }
  };

  if (!mounted) {
    return (
      <div className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 w-9 h-9 shadow-sm">
        <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
        aria-label="Select theme"
        title="Theme options"
      >
        {getThemeIcon()}
      </button>

      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-[9999]">
          <button
            onClick={() => changeTheme('light')}
            className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 ${
              theme === 'light' ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            <Sun className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-700 dark:text-gray-300">Light</span>
          </button>
          <button
            onClick={() => changeTheme('dark')}
            className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 ${
              theme === 'dark' ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            <Moon className="w-4 h-4 text-slate-300" />
            <span className="text-gray-700 dark:text-gray-300">Dark</span>
          </button>
          <button
            onClick={() => changeTheme('system')}
            className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 ${
              theme === 'system' ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
          >
            <Monitor className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span className="text-gray-700 dark:text-gray-300">System</span>
          </button>
        </div>
      )}
    </div>
  );
}