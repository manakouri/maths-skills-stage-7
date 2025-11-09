import React, { useState, useCallback } from 'react';
import MainMenu from './components/MainMenu';
import PowersAndRootsMenu from './components/PowersAndRootsMenu';
import RoundingMenu from './components/RoundingMenu';
import ConversionsMenu from './components/FractionsMenu';
import BedmasMenu from './components/BedmasMenu';
import PracticeMode from './components/PracticeMode';
import BedmasPracticeMode from './components/BedmasPracticeMode';
import ChallengeMode from './components/ChallengeMode';
import RoundingChallengeMode from './components/RoundingChallengeMode';
import FractionsChallengeMode from './components/FractionsChallengeMode';
import ConversionChallengeMode from './components/ConversionChallengeMode';
import OrderingChallengeMode from './components/OrderingChallengeMode';
import BedmasChallengeMode from './components/BedmasChallengeMode';
import SkillCheckMode from './components/SkillCheckMode';
import ConversionSkillCheckMode from './components/ConversionSkillCheckMode';
import { Header } from './components/Header';
import { GameMode, AppState, SkillCheckType, AppView, ColorTheme } from './types';

const getCurrentColorTheme = (state: AppState): ColorTheme => {
    switch(state.view) {
        case 'powers_and_roots_menu':
        case 'challenge':
            return 'powers';
        
        case 'rounding_menu':
        case 'rounding_challenge':
        case 'skill_check':
            return 'rounding';

        case 'conversions_menu':
        case 'fractions_challenge':
        case 'conversion_challenge':
        case 'ordering_challenge':
        case 'conversion_skill_check':
            return 'fractions';

        case 'bedmas_menu':
        case 'bedmas_practice':
        case 'bedmas_challenge':
            return 'bedmas';
        
        case 'practice':
             if (state.mode?.startsWith('ROUND')) return 'rounding';
             if (state.mode?.startsWith('SIMPLIFY') || state.mode?.startsWith('CONVERT') || state.mode?.startsWith('ORDERING')) return 'fractions';
             return 'powers';

        default:
            return 'primary';
    }
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({ view: 'top_menu' });
  
  const colorTheme = getCurrentColorTheme(appState);

  const navigateToTopMenu = useCallback(() => setAppState({ view: 'top_menu' }), []);
  const navigateToPowersAndRootsMenu = useCallback(() => setAppState({ view: 'powers_and_roots_menu' }), []);
  const navigateToRoundingMenu = useCallback(() => setAppState({ view: 'rounding_menu' }), []);
  const navigateToConversionsMenu = useCallback(() => setAppState({ view: 'conversions_menu' }), []);
  const navigateToBedmasMenu = useCallback(() => setAppState({ view: 'bedmas_menu' }), []);

  const startPractice = useCallback((mode: GameMode) => setAppState({ view: 'practice', mode }), []);
  const startBedmasPractice = useCallback(() => setAppState({ view: 'bedmas_practice' }), []);
  
  const startChallenge = useCallback(() => setAppState({ view: 'challenge' }), []);
  const startRoundingChallenge = useCallback(() => setAppState({ view: 'rounding_challenge' }), []);
  const startFractionsChallenge = useCallback(() => setAppState({ view: 'fractions_challenge' }), []);
  const startConversionChallenge = useCallback(() => setAppState({ view: 'conversion_challenge' }), []);
  const startOrderingChallenge = useCallback(() => setAppState({ view: 'ordering_challenge' }), []);
  const startBedmasChallenge = useCallback(() => setAppState({ view: 'bedmas_challenge' }), []);

  const startSkillCheck = useCallback((type: SkillCheckType) => setAppState({ view: 'skill_check', skillCheckType: type }), []);
  const startConversionSkillCheck = useCallback((type: SkillCheckType) => setAppState({ view: 'conversion_skill_check', skillCheckType: type }), []);

  const renderContent = () => {
    switch (appState.view) {
      case 'powers_and_roots_menu':
        return <PowersAndRootsMenu onStartPractice={startPractice} onStartChallenge={startChallenge} colorTheme={colorTheme} />;
      case 'rounding_menu':
        return <RoundingMenu onStartPractice={startPractice} onStartChallenge={startRoundingChallenge} onStartSkillCheck={startSkillCheck} colorTheme={colorTheme} />;
      case 'conversions_menu':
        return <ConversionsMenu onStartPractice={startPractice} onStartChallenge={startFractionsChallenge} onStartConversionChallenge={startConversionChallenge} onStartOrderingChallenge={startOrderingChallenge} onStartSkillCheck={startConversionSkillCheck} colorTheme={colorTheme} />;
      case 'bedmas_menu':
        return <BedmasMenu onStartPractice={startBedmasPractice} onStartChallenge={startBedmasChallenge} colorTheme={colorTheme} />;
      case 'practice':
        const modeStr = appState.mode!.toString();
        let onBack;
        if (modeStr.startsWith('ROUND')) onBack = navigateToRoundingMenu;
        else if (modeStr.startsWith('SIMPLIFY') || modeStr.startsWith('CONVERT') || modeStr.startsWith('ORDERING')) onBack = navigateToConversionsMenu;
        else onBack = navigateToPowersAndRootsMenu;
        return <PracticeMode mode={appState.mode!} onBack={onBack} colorTheme={colorTheme} />;
      case 'bedmas_practice':
        return <BedmasPracticeMode onBack={navigateToBedmasMenu} colorTheme={colorTheme} />;
      case 'challenge':
        return <ChallengeMode onBack={navigateToPowersAndRootsMenu} colorTheme={colorTheme} />;
      case 'rounding_challenge':
        return <RoundingChallengeMode onBack={navigateToRoundingMenu} colorTheme={colorTheme} />;
      case 'fractions_challenge':
        return <FractionsChallengeMode onBack={navigateToConversionsMenu} colorTheme={colorTheme} />;
      case 'conversion_challenge':
        return <ConversionChallengeMode onBack={navigateToConversionsMenu} colorTheme={colorTheme} />;
      case 'ordering_challenge':
        return <OrderingChallengeMode onBack={navigateToConversionsMenu} colorTheme={colorTheme} />;
      case 'bedmas_challenge':
        return <BedmasChallengeMode onBack={navigateToBedmasMenu} colorTheme={colorTheme} />;
      case 'skill_check':
        return <SkillCheckMode type={appState.skillCheckType!} onBack={navigateToRoundingMenu} colorTheme={colorTheme} />;
      case 'conversion_skill_check':
        return <ConversionSkillCheckMode type={appState.skillCheckType!} onBack={navigateToConversionsMenu} colorTheme={colorTheme} />;
      case 'top_menu':
      default:
        return (
          <MainMenu
            onSelectPowersAndRoots={navigateToPowersAndRootsMenu}
            onSelectRounding={navigateToRoundingMenu}
            onSelectFractions={navigateToConversionsMenu}
            onSelectBedmas={navigateToBedmasMenu}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Header onHomeClick={navigateToTopMenu} showHomeButton={appState.view !== 'top_menu'} colorTheme={colorTheme} />
      <main className="w-full max-w-2xl mx-auto">
        {renderContent()}
      </main>
      <footer className="text-center text-slate-500 mt-8 text-sm">
        <p>Welcome to the Maths Skills Arena. Practice and master your skills.</p>
      </footer>
    </div>
  );
};

export default App;