import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  systemPreference: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  setSystemPreference: (preference: 'light' | 'dark') => void;
  getEffectiveTheme: () => 'light' | 'dark';
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      systemPreference: 'light',
      setTheme: (theme) => {
        set({ theme });
        applyTheme(get().getEffectiveTheme());
      },
      setSystemPreference: (preference) => {
        set({ systemPreference: preference });
        if (get().theme === 'system') {
          applyTheme(preference);
        }
      },
      getEffectiveTheme: () => {
        const { theme, systemPreference } = get();
        if (theme === 'system') {
          return systemPreference;
        }
        return theme;
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);

function applyTheme(theme: 'light' | 'dark') {
  const html = document.documentElement;
  if (theme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
}

// Initialize theme on app load
export function initTheme() {
  const store = useThemeStore.getState();
  
  // Detect system preference
  if (typeof window !== 'undefined') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    store.setSystemPreference(isDark ? 'dark' : 'light');
    
    // Apply initial theme
    applyTheme(store.getEffectiveTheme());
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      store.setSystemPreference(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }
}
