import React from 'react';
import { ColorTheme } from '../types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'light' | 'default';
  fullWidth?: boolean;
  children: React.ReactNode;
  colorTheme?: ColorTheme;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', fullWidth = false, children, className, colorTheme = 'primary', ...props }) => {
  const baseClasses = "flex items-center justify-center px-6 py-3 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transform hover:-translate-y-px shadow-md hover:shadow-lg";

  const themeClasses: Record<ColorTheme, string> = {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500 shadow-blue-500/30',
    powers: 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 focus:ring-red-500 shadow-orange-500/30',
    rounding: 'bg-gradient-to-r from-teal-500 to-green-500 text-white hover:from-teal-600 hover:to-green-600 focus:ring-green-500 shadow-green-500/30',
    fractions: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 focus:ring-purple-500 shadow-indigo-500/30',
    bedmas: 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white hover:from-sky-600 hover:to-cyan-600 focus:ring-sky-500 shadow-cyan-500/30',
  };

  const variantClasses = {
    primary: themeClasses[colorTheme],
    light: 'bg-slate-200 text-slate-700 hover:bg-slate-300 focus:ring-slate-400 focus:ring-offset-slate-100',
    default: 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 focus:ring-blue-500 focus:ring-offset-slate-100',
  };

  const fullWidthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${fullWidthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};