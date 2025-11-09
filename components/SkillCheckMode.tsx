import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { GameMode, Question, SkillCheckType, AnswerStatus, ColorTheme } from '../types';
import { generateSkillCheckQuestions } from '../utils/questionGenerator';
import { QuestionCard } from './QuestionCard';
import { Button } from './Button';
import { TrophyIcon } from './icons';

interface SkillCheckModeProps {
  type: SkillCheckType;
  onBack: () => void;
  colorTheme: ColorTheme;
}

const getGameModeName = (mode: GameMode): string => {
    switch (mode) {
      case GameMode.ROUND_TENS: return 'Nearest 10';
      case GameMode.ROUND_HUNDREDS: return 'Nearest 100';
      case GameMode.ROUND_THOUSANDS: return 'Nearest 1,000';
      case GameMode.ROUND_TEN_THOUSANDS: return 'Nearest 10,000';
      case GameMode.ROUND_HUNDRED_THOUSANDS: return 'Nearest 100,000';
      case GameMode.ROUND_TENTHS: return 'Nearest Tenth';
      case GameMode.ROUND_HUNDREDTHS: return 'Nearest Hundredth';
      case GameMode.ROUND_THOUSANDTHS: return 'Nearest Thousandth';
      default: return '';
    }
};

const SkillCheckMode: React.FC<SkillCheckModeProps> = ({ type, onBack, colorTheme }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [incorrectlyAnsweredTypes, setIncorrectlyAnsweredTypes] = useState<Set<GameMode>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>(AnswerStatus.UNANSWERED);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const nextQuestionTimerRef = useRef<number | null>(null);

  const title = `Rounding Skill Check: ${type === 'whole_numbers' ? 'Whole Numbers' : 'Decimals'}`;
  const totalQuestions = questions.length;

  const initializeCheck = useCallback(() => {
    setQuestions(generateSkillCheckQuestions(type));
    setCurrentQuestionIndex(0);
    setIncorrectlyAnsweredTypes(new Set());
    setIsComplete(false);
    setAnswerStatus(AnswerStatus.UNANSWERED);
    setCorrectAnswer(null);
  }, [type]);

  useEffect(() => {
    initializeCheck();
    return () => {
        if (nextQuestionTimerRef.current) {
            clearTimeout(nextQuestionTimerRef.current);
        }
    }
  }, [initializeCheck]);
  
  const moveToNextQuestion = useCallback(() => {
    if (currentQuestionIndex + 1 >= totalQuestions) {
      setIsComplete(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setAnswerStatus(AnswerStatus.UNANSWERED);
      setCorrectAnswer(null);
    }
  }, [currentQuestionIndex, totalQuestions]);

  const handleAnswerSubmit = (userAnswer: number) => {
    if (answerStatus !== AnswerStatus.UNANSWERED) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    if (userAnswer === currentQuestion.answer) {
        setAnswerStatus(AnswerStatus.CORRECT);
        nextQuestionTimerRef.current = window.setTimeout(moveToNextQuestion, 1000);
    } else {
      setIncorrectlyAnsweredTypes(prev => new Set(prev).add(currentQuestion.type));
      setAnswerStatus(AnswerStatus.INCORRECT);
      setCorrectAnswer(currentQuestion.answer as number);
    }
  };
  
  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);
  const progressPercentage = totalQuestions > 0 ? ((currentQuestionIndex) / totalQuestions) * 100 : 0;
  
  const progressBarColorClass: Record<ColorTheme, string> = {
    primary: 'bg-green-500', // Fallback
    powers: 'bg-green-500',
    rounding: 'bg-green-500',
    fractions: 'bg-green-500',
    bedmas: 'bg-green-500',
  };

  if (isComplete) {
    const isMastered = incorrectlyAnsweredTypes.size === 0;
    return (
       <div className="bg-white p-8 rounded-xl shadow-xl border border-slate-200 text-center animate-fade-in text-slate-800">
         {isMastered ? (
            <>
                <div className="flex justify-center text-yellow-500 mb-4">
                    <TrophyIcon className="w-24 h-24" />
                </div>
                <h2 className="text-3xl font-bold text-green-600 mb-4">Skill Mastered!</h2>
                <p className="text-lg text-slate-600 mb-8">Congratulations! You answered all {totalQuestions} questions correctly.</p>
            </>
         ) : (
            <>
                <h2 className="text-3xl font-bold text-blue-600 mb-4">Great Effort!</h2>
                <p className="text-lg text-slate-600 mb-6">You've completed the skill check. Here are the areas to focus on for more practice:</p>
                <ul className="text-left bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-2 mb-8">
                   {Array.from(incorrectlyAnsweredTypes).map((mode: GameMode) => (
                       <li key={mode} className="font-semibold text-yellow-800">{getGameModeName(mode)}</li>
                   ))}
                </ul>
            </>
         )}
         <div className="flex space-x-4">
          <Button onClick={initializeCheck} fullWidth colorTheme={colorTheme}>Try Again</Button>
          <Button onClick={onBack} variant="light" fullWidth>Back to Menu</Button>
         </div>
       </div>
    );
  }

  return (
    <div className="w-full animate-fade-in-slide-up">
      <h2 className="text-3xl font-bold text-center mb-2 text-slate-900">{title}</h2>
      <p className="text-center text-slate-500 mb-6">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
      
      <div className="w-full bg-slate-200 rounded-full h-2.5 mb-6">
        <div className={`${progressBarColorClass[colorTheme]} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${progressPercentage}%` }}></div>
      </div>
      
      {currentQuestion && (
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          onSubmit={handleAnswerSubmit}
          status={answerStatus}
          correctAnswer={correctAnswer}
          colorTheme={colorTheme}
        />
      )}

      {answerStatus === AnswerStatus.INCORRECT && (
        <div className="mt-6 flex justify-center">
            <Button onClick={moveToNextQuestion} colorTheme={colorTheme}>
                Next Question
            </Button>
        </div>
      )}
    </div>
  );
};

export default SkillCheckMode;