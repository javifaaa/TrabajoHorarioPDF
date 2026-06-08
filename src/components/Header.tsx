import React from 'react';
import type { ThemeMode } from '../types';

interface HeaderProps {
  mode: ThemeMode;
  onToggleMode: () => void;
  guardado: boolean;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ mode, onToggleMode, guardado, onLogout }) => {
  return (
    <header className="relative overflow-hidden bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 dark:from-primary-900 dark:via-primary-800 dark:to-primary-900">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/20" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-5 sm:px-6 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Company Logo */}
            <div className="flex-shrink-0 h-14 sm:h-16 bg-white rounded-xl flex items-center justify-center px-3 sm:px-4 shadow-lg">
              <img
                src="/logo.png"
                alt="Donca"
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Parte de Incidencias
              </h1>
              <p className="text-xs sm:text-sm text-primary-200 font-medium">
                Gestión de Servicios
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Auto-save indicator */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-500 ${
                guardado
                  ? 'bg-accent-500/20 text-accent-200 border border-accent-400/30'
                  : 'bg-white/10 text-primary-200 border border-white/10'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                guardado ? 'bg-accent-400 animate-pulse' : 'bg-primary-300'
              }`} />
              <span className="hidden sm:inline">
                {guardado ? 'Guardado' : 'Borrador'}
              </span>
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={onToggleMode}
              className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 active:scale-95"
              aria-label={mode === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
              id="dark-mode-toggle"
            >
              {mode === 'dark' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 006.002-2.082 9.718 9.718 0 003-3.916z" />
                </svg>
              )}
            </button>

            {/* Logout button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-red-500/10 backdrop-blur-sm border border-red-500/20 flex items-center justify-center text-red-100 hover:bg-red-500/20 transition-all duration-200 active:scale-95"
                title="Cerrar sesión"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
