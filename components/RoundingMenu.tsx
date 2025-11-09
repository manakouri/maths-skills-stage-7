import React from 'react';
import { GameMode, SkillCheckType, ColorTheme } from '../types';
import { Button } from './Button';
import { TargetIcon } from './icons';

interface RoundingMenuProps {
  onStartPractice: (mode: GameMode) => void;
  onStartChallenge: () => void;
  onStartSkillCheck: (type: SkillCheckType) => void;
  colorTheme: ColorTheme;
}

const RoundingMenu: React.FC<RoundingMenuProps> = ({ onStartPractice, onStartChallenge, onStartSkillCheck, colorTheme }) => {
  return (
    <div className="bg-white text-slate-800 p-8 rounded-xl shadow-xl border border-slate-200 animate-fade-in">
      <h1 className="text-4xl font-bold text-center mb-2 text-slate-900">
        Rounding Practice
      </h1>
      <p className="text-center text-slate-500 mb-8">Choose a skill to master.</p>
      
      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2">Whole Numbers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <Button onClick={() => onStartPractice(GameMode.ROUND_TENS)} fullWidth variant="default">Nearest 10</Button>
            <Button onClick={() => onStartPractice(GameMode.ROUND_HUNDREDS)} fullWidth variant="default">Nearest 100</Button>
            <Button onClick={() => onStartPractice(GameMode.ROUND_THOUSANDS)} fullWidth variant="default">Nearest 1,000</Button>
            <Button onClick={() => onStartPractice(GameMode.ROUND_TEN_THOUSANDS)} fullWidth variant="default">Nearest 10,000</Button>
            <Button onClick={() => onStartPractice(GameMode.ROUND_HUNDRED_THOUSANDS)} fullWidth variant="default">Nearest 100,000</Button>
            <Button onClick={() => onStartSkillCheck('whole_numbers')} variant="primary" fullWidth className="md:col-span-2" colorTheme={colorTheme}>
                <TargetIcon className="w-5 h-5 mr-2" />
                Skill Check
            </Button>
        </div>
      </div>
      
       <div className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2">Decimals</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <Button onClick={() => onStartPractice(GameMode.ROUND_TENTHS)} fullWidth variant="default">Nearest Tenth</Button>
            <Button onClick={() => onStartPractice(GameMode.ROUND_HUNDREDTHS)} fullWidth variant="default">Nearest Hundredth</Button>
            <Button onClick={() => onStartPractice(GameMode.ROUND_THOUSANDTHS)} fullWidth variant="default">Nearest Thousandth</Button>
            <Button onClick={() => onStartSkillCheck('decimals')} variant="primary" fullWidth className="md:col-span-2" colorTheme={colorTheme}>
                 <TargetIcon className="w-5 h-5 mr-2" />
                Skill Check
            </Button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2">Challenge Mode</h2>
        <Button onClick={onStartChallenge} variant="primary" fullWidth className="mt-4" colorTheme={colorTheme}>
           Timed Rounding Challenge
        </Button>
      </div>
    </div>
  );
};

export default RoundingMenu;