import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4 md:w-5 md:h-5" />
      ) : (
        <Sun className="w-4 h-4 md:w-5 md:h-5" />
      )}
    </button>
  );
};

