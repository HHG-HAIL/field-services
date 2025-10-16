import React from 'react';
import { X, Moon, Sun, Monitor, Palette } from 'lucide-react';
import { ThemeSetting, useTheme } from '../../context/ThemeContext';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const themeOptions: Array<{
  label: string;
  value: ThemeSetting;
  icon: React.ReactNode;
  description: string;
}> = [
  {
    label: 'Light',
    value: 'light',
    icon: <Sun className="h-4 w-4" />,
    description: 'Bright, crisp surfaces with vibrant accents.',
  },
  {
    label: 'Dark',
    value: 'dark',
    icon: <Moon className="h-4 w-4" />,
    description: 'Dimmed UI for low-light and evening operations.',
  },
  {
    label: 'System',
    value: 'system',
    icon: <Monitor className="h-4 w-4" />,
    description: 'Synchronise with your OS appearance preference.',
  },
];

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { setting, resolvedTheme, setTheme } = useTheme();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity dark:bg-slate-950/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className="relative h-full w-full max-w-md bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-2xl border-l border-slate-200/80 dark:border-slate-800/70 transition-transform animate-slide-in-right"
        role="dialog"
        aria-modal="true"
        aria-label="Application settings"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/80 dark:border-slate-800/70">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Settings
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Personalise your field service workspace.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            aria-label="Close settings"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-8 custom-scrollbar overflow-y-auto h-full pb-24">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Palette className="h-5 w-5 text-primary-500" />
              <div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
                  Appearance
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Switch between light and dark surfaces.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {themeOptions.map((option) => {
                const isActive = setting === option.value;
                const isResolved = resolvedTheme === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={`w-full text-left rounded-2xl border px-4 py-3 transition-all duration-200 ${
                      isActive
                        ? 'border-primary-500/70 bg-primary-50/70 dark:bg-primary-500/10 dark:border-primary-500/80 shadow-[0_12px_30px_-12px_rgba(14,165,233,0.6)]'
                        : 'border-slate-200/80 bg-white/70 hover:border-primary-300 hover:bg-primary-50/50 dark:border-slate-800/60 dark:bg-slate-900/60 dark:hover:border-primary-500/60 dark:hover:bg-primary-500/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`rounded-full p-2 ${
                            isActive
                              ? 'bg-primary-500 text-white shadow-md'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {option.icon}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {option.label}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {option.description}
                          </p>
                        </div>
                      </div>
                      {option.value === 'system' && (
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          Currently {resolvedTheme}
                        </span>
                      )}
                      {option.value !== 'system' && isActive && (
                        <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                          Selected
                        </span>
                      )}
                      {option.value !== 'system' && !isActive && isResolved && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Using
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200/80 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/60 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide mb-3">
              Quick Tips
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-disc list-inside">
              <li>Use light mode for bright environments.</li>
              <li>Dark mode reduces eye strain during night shifts.</li>
              <li>System mode automatically adapts as your OS switches.</li>
            </ul>
          </section>
        </div>
      </aside>
    </div>
  );
};

export default SettingsPanel;

