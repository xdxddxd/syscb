'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg border flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-muted animate-pulse" />
      </div>
    );
  }

  const themes = [
    { value: 'light', icon: Sun, label: 'Claro' },
    { value: 'dark', icon: Moon, label: 'Escuro' },
    { value: 'system', icon: Monitor, label: 'Sistema' }
  ];

  return (
    <div className="relative">
      <div 
        className="flex items-center space-x-1 p-1 bg-muted/50 backdrop-blur-sm rounded-lg border border-border/40 animate-fade-in"
      >
        {themes.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={`
              relative flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 group
              ${theme === value 
                ? 'bg-background shadow-sm text-foreground scale-105' 
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50 hover:scale-105'
              }
            `}
            title={label}
          >
            <div
              className={`
                transition-all duration-300 transform
                ${theme === value ? 'rotate-0 opacity-100' : 'group-hover:rotate-12 opacity-100'}
              `}
            >
              <Icon className="w-4 h-4" />
            </div>
            
            {theme === value && (
              <div
                className="absolute inset-0 bg-primary/10 rounded-md border border-primary/20 animate-scale-in"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
