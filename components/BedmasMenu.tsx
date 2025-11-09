import React from 'react';
import { Button } from './Button';
import { ColorTheme } from '../types';

interface BedmasMenuProps {
  onStartPractice: () => void;
  onStartChallenge: () => void;
  colorTheme: ColorTheme;
}

const BedmasMenu: React.FC<BedmasMenuProps> = ({ onStartPractice, onStartChallenge, colorTheme }) => {
  return (
    <div className="bg-white text-slate-800 p-8 rounded-xl shadow-xl border border-slate-200 animate-fade-in">
      <h1 className="text-4xl font-bold text-center mb-2 text-slate-900">
        BEDMAS Practice
      </h1>
      <p className="text-center text-slate-500 mb-8">Master the Order of Operations.</p>
      
      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2">Practice Mode</h2>
        <Button onClick={onStartPractice} fullWidth variant="default">
            Full Practice (All Operations)
        </Button>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2">Challenge Mode</h2>
        <Button onClick={onStartChallenge} variant="primary" fullWidth className="mt-4" colorTheme={colorTheme}>
           Timed Challenge
        </Button>
      </div>
    </div>
  );
};

export default BedmasMenu;