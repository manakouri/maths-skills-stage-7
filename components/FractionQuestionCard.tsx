import React, { useState, useEffect, useRef } from 'react';
import { Question, AnswerStatus, FractionAnswer, ColorTheme } from '../types';
import { Button } from './Button';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface FractionQuestionCardProps {
  question: Question;
  onSubmit: (answer: FractionAnswer) => void;
  status: AnswerStatus;
  correctAnswer: FractionAnswer | null;
  explanation?: React.ReactNode | null;
  isChallengeMode?: boolean;
  colorTheme?: ColorTheme;
}

export const FractionQuestionCard: React.FC<FractionQuestionCardProps> = ({ question, onSubmit, status, correctAnswer, explanation, isChallengeMode = false, colorTheme = 'primary' }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const focusRingClasses: Record<ColorTheme, string> = {
    primary: 'focus-within:ring-blue-500',
    powers: 'focus-within:ring-red-500',
    rounding: 'focus-within:ring-green-500',
    fractions: 'focus-within:ring-purple-500',
    bedmas: 'focus-within:ring-sky-500',
  };

  useEffect(() => {
    setInputValue('');
    inputRef.current?.focus();
  }, [question]);
  
  useEffect(() => {
    if (status === AnswerStatus.UNANSWERED) {
      inputRef.current?.focus();
    }
  }, [status]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '' || status === AnswerStatus.CORRECT || status === AnswerStatus.INCORRECT) return;
    
    const parts = inputValue.split('/');
    if (parts.length !== 2) {
      return;
    }

    const num = parseInt(parts[0], 10);
    const den = parseInt(parts[1], 10);

    if (isNaN(num) || isNaN(den) || den === 0) {
      return;
    }

    onSubmit({
        numerator: num,
        denominator: den
    });

    if(isChallengeMode) {
      setInputValue('');
    }
  };

  const getBorderColor = () => {
    switch (status) {
      case AnswerStatus.CORRECT: return 'ring-green-500';
      case AnswerStatus.INCORRECT: return 'ring-red-500';
      case AnswerStatus.PARTIAL: return 'ring-yellow-500';
      default: return 'ring-transparent';
    }
  };
  
  return (
    <div className="bg-white p-8 rounded-xl shadow-xl border border-slate-200">
      <div className="text-center mb-6">
        <p className="text-slate-500 text-lg">Question</p>
        <div className="text-4xl md:text-5xl font-bold my-4 tracking-wider text-slate-800">{question.text}</div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={`relative transition-colors duration-300 rounded-xl ring-2 ${focusRingClasses[colorTheme]} ${getBorderColor()}`}>
           <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-slate-100 text-slate-900 text-3xl text-center p-4 rounded-xl outline-none border-2 border-transparent"
            placeholder="n/d"
            disabled={status === AnswerStatus.CORRECT || status === AnswerStatus.INCORRECT}
            autoFocus
          />
          {status === AnswerStatus.CORRECT && <CheckCircleIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 text-green-500"/>}
          {status === AnswerStatus.INCORRECT && <XCircleIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 text-red-500"/>}
        </div>
       
        {status === AnswerStatus.INCORRECT && correctAnswer && (
          <div className="text-center text-red-500 mt-4 text-lg">
            <p>Correct answer: <strong>{correctAnswer.numerator} / {correctAnswer.denominator}</strong></p>
          </div>
        )}
        
        {status === AnswerStatus.PARTIAL && (
          <div className="text-center text-yellow-600 mt-4 text-lg">
            <p>Correct, but not fully simplified. <strong>Simplify further!</strong></p>
          </div>
        )}

        {explanation && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-slate-700 text-sm">
            <h4 className="font-bold mb-2 text-blue-800">How to solve:</h4>
            {explanation}
          </div>
        )}
        
        {!isChallengeMode && (
          <div className="mt-6">
            <Button type="submit" fullWidth disabled={status === AnswerStatus.CORRECT || status === AnswerStatus.INCORRECT || !inputValue} colorTheme={colorTheme}>
              Submit Answer
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};