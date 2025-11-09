import React from 'react';
import { Button } from './Button';
import { HomeIcon } from './icons';
import { ColorTheme } from '../types';

interface HeaderProps {
    onHomeClick: () => void;
    showHomeButton: boolean;
    colorTheme: ColorTheme;
}

export const Header: React.FC<HeaderProps> = ({ onHomeClick, showHomeButton, colorTheme }) => {
    const logoBgClasses: Record<ColorTheme, string> = {
        primary: 'bg-blue-600',
        powers: 'bg-gradient-to-br from-red-500 to-orange-500',
        rounding: 'bg-gradient-to-br from-teal-500 to-green-500',
        fractions: 'bg-gradient-to-br from-purple-600 to-indigo-600',
        bedmas: 'bg-gradient-to-br from-sky-500 to-cyan-500',
    };

  return (
    <header className="w-full max-w-2xl mx-auto mb-6 flex items-center justify-between h-16">
        <div className="flex items-center">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 font-bold text-xl shadow-lg text-white transition-colors duration-300 ${logoBgClasses[colorTheme]}`}>M7</div>
            <span className="text-2xl font-bold text-slate-900">Maths Skills - Stage 7</span>
        </div>
      {showHomeButton && (
        <Button onClick={onHomeClick} variant="light" className="px-4 py-2 text-sm shadow-md">
            <HomeIcon className="w-5 h-5 mr-2" />
            Menu
        </Button>
      )}
    </header>
  );
};