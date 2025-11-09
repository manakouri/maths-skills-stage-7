import React from 'react';
import { GameMode, SkillCheckType, ColorTheme } from '../types';
import { Button } from './Button';
import { TargetIcon } from './icons';

interface ConversionsMenuProps {
  onStartPractice: (mode: GameMode) => void;
  onStartChallenge: () => void;
  onStartConversionChallenge: () => void;
  onStartOrderingChallenge: () => void;
  onStartSkillCheck: (type: SkillCheckType) => void;
  colorTheme: ColorTheme;
}

const ConversionsMenu: React.FC<ConversionsMenuProps> = ({ onStartPractice, onStartChallenge, onStartConversionChallenge, onStartOrderingChallenge, onStartSkillCheck, colorTheme }) => {
  return (
    <div className="bg-white text-slate-800 p-8 rounded-xl shadow-xl border border-slate-200 animate-fade-in">
      <h1 className="text-4xl font-bold text-center mb-2 text-slate-900">
        Fractions, Decimals & Percentages
      </h1>
      <p className="text-center text-slate-500 mb-8">Choose a skill to master.</p>
      
      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2">Simplifying Fractions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <Button onClick={() => onStartPractice(GameMode.SIMPLIFY_FRACTIONS)} fullWidth variant="default">
              Practice
          </Button>
          <Button onClick={onStartChallenge} variant="primary" fullWidth colorTheme={colorTheme}>
             Timed Challenge
          </Button>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2">Converting FDP</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <Button onClick={() => onStartPractice(GameMode.CONVERT_FRACTIONS)} fullWidth variant="default">Convert Fractions</Button>
            <Button onClick={() => onStartSkillCheck('convert_fractions')} fullWidth variant="default">
                 <TargetIcon className="w-5 h-5 mr-2" />
                Skill Check
            </Button>

            <Button onClick={() => onStartPractice(GameMode.CONVERT_DECIMALS)} fullWidth variant="default">Convert Decimals</Button>
            <Button onClick={() => onStartSkillCheck('convert_decimals')} fullWidth variant="default">
                 <TargetIcon className="w-5 h-5 mr-2" />
                Skill Check
            </Button>
            <Button onClick={() => onStartPractice(GameMode.CONVERT_PERCENTAGES)} fullWidth variant="default">Convert Percentages</Button>
            <Button onClick={() => onStartSkillCheck('convert_percentages')} fullWidth variant="default">
                 <TargetIcon className="w-5 h-5 mr-2" />
                Skill Check
            </Button>
            <Button onClick={onStartConversionChallenge} variant="primary" fullWidth className="md:col-span-2" colorTheme={colorTheme}>
              Timed Conversions Challenge
            </Button>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2">Ordering FDP</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <Button onClick={() => onStartPractice(GameMode.ORDERING_FDP)} fullWidth variant="default">
              Practice Ordering
          </Button>
          <Button onClick={onStartOrderingChallenge} variant="primary" fullWidth colorTheme={colorTheme}>
             Timed Ordering Challenge
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConversionsMenu;