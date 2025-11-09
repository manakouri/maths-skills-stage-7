import React from 'react';
import { GameMode, ColorTheme } from '../types';
import { Button } from './Button';

interface PowersAndRootsMenuProps {
  onStartPractice: (mode: GameMode) => void;
  onStartChallenge: () => void;
  colorTheme: ColorTheme;
}

const PowersAndRootsMenu: React.FC<PowersAndRootsMenuProps> = ({ onStartPractice, onStartChallenge, colorTheme }) => {
  return (
    <div className="bg-white text-slate-800 p-8 rounded-xl shadow-xl border border-slate-200 animate-fade-in">
      <h1 className="text-4xl font-bold text-center mb-2 text-slate-900">
        Powers & Roots
      </h1>
      <p className="text-center text-slate-500 mb-8">Choose a mode to begin.</p>
      
      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2">Practice Modes</h2>
        <Button onClick={() => onStartPractice(GameMode.SQUARES)} fullWidth variant="default">
            Practice Squares (up to 10²)
        </Button>
        <Button onClick={() => onStartPractice(GameMode.CUBES)} fullWidth variant="default">
            Practice Cubes (up to 5³)
        </Button>
        <Button onClick={() => onStartPractice(GameMode.SQUARE_ROOTS)} fullWidth variant="default">
            Practice Square Roots (up to √100)
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

export default PowersAndRootsMenu;