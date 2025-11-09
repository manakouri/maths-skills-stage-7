import React from 'react';
import { Button } from './Button';

interface MainMenuProps {
  onSelectPowersAndRoots: () => void;
  onSelectRounding: () => void;
  onSelectFractions: () => void;
  onSelectBedmas: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onSelectPowersAndRoots, onSelectRounding, onSelectFractions, onSelectBedmas }) => {
  return (
    <div className="bg-white text-slate-800 p-8 rounded-xl shadow-xl border border-slate-200 animate-fade-in">
      <h1 className="text-4xl font-bold text-center mb-2 text-slate-900">
        Maths Skills - Stage 7
      </h1>
      <p className="text-center text-slate-500 mb-8">Select a category to practice.</p>
      
      <div className="space-y-4">
        <Button onClick={onSelectPowersAndRoots} fullWidth colorTheme="powers">
            Powers & Roots
        </Button>
        <Button onClick={onSelectRounding} fullWidth colorTheme="rounding">
            Rounding
        </Button>
        <Button onClick={onSelectFractions} fullWidth colorTheme="fractions">
            Fractions, Decimals and Percentages
        </Button>
        <Button onClick={onSelectBedmas} fullWidth colorTheme="bedmas">
            BEDMAS
        </Button>
      </div>
    </div>
  );
};

export default MainMenu;