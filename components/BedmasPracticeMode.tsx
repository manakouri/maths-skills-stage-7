import React, { useState, useEffect, useCallback } from 'react';
import { generateQuestion } from '../utils/questionGenerator';
import { Question, BedmasQuestion, EquationToken, ColorTheme } from '../types';
import { GameMode } from '../types';
import { BedmasQuestionCard } from './BedmasQuestionCard';
import { Button } from './Button';
import { PRACTICE_SESSION_LENGTH } from '../constants';

const BedmasPracticeMode: React.FC<{ onBack: () => void; colorTheme: ColorTheme; }> = ({ onBack, colorTheme }) => {
    const [question, setQuestion] = useState<Question | null>(null);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [equationHistory, setEquationHistory] = useState<EquationToken[][]>([]);
    const [correctlyAnsweredCount, setCorrectlyAnsweredCount] = useState(0);
    const [isSessionComplete, setIsSessionComplete] = useState(false);

    const loadNewQuestion = useCallback(() => {
        const newQuestion = generateQuestion(GameMode.BEDMAS);
        setQuestion(newQuestion);
        const bedmasData = newQuestion.answer as BedmasQuestion;
        setEquationHistory([bedmasData.steps[0].equation]);
        setCurrentStepIndex(0);
    }, []);

    useEffect(() => {
        loadNewQuestion();
    }, [loadNewQuestion]);

    const handleCorrectStep = (newEquation: EquationToken[]) => {
        const bedmasData = question!.answer as BedmasQuestion;
        const isLastStep = currentStepIndex === bedmasData.steps.length - 1;

        if (isLastStep) {
            setEquationHistory(prev => [...prev, newEquation]);
            setCorrectlyAnsweredCount(prev => prev + 1);
            if (correctlyAnsweredCount + 1 >= PRACTICE_SESSION_LENGTH) {
                setIsSessionComplete(true);
            } else {
                setTimeout(() => {
                    loadNewQuestion();
                }, 1500);
            }
        } else {
            const nextStepEquation = bedmasData.steps[currentStepIndex + 1].equation;
            setEquationHistory(prev => [...prev, nextStepEquation]);
            setCurrentStepIndex(prev => prev + 1);
        }
    };
    
    const resetSession = useCallback(() => {
        setCorrectlyAnsweredCount(0);
        setIsSessionComplete(false);
        loadNewQuestion();
    }, [loadNewQuestion]);

    if (isSessionComplete) {
        return (
           <div className="bg-white p-8 rounded-xl shadow-xl border border-slate-200 text-center animate-fade-in text-slate-800">
             <h2 className="text-3xl font-bold text-green-600 mb-4">Session Complete!</h2>
             <p className="text-lg text-slate-600 mb-8">You solved {PRACTICE_SESSION_LENGTH} equations correctly.</p>
             <div className="flex space-x-4">
              <Button onClick={resetSession} fullWidth colorTheme={colorTheme}>Practice Again</Button>
              <Button onClick={onBack} variant="light" fullWidth>Main Menu</Button>
             </div>
           </div>
        );
    }
    
    const progressPercentage = (correctlyAnsweredCount / PRACTICE_SESSION_LENGTH) * 100;
    
    const progressBarColorClass: Record<ColorTheme, string> = {
        primary: 'bg-blue-600', powers: 'bg-red-500', rounding: 'bg-green-500',
        fractions: 'bg-purple-600', bedmas: 'bg-sky-500',
    };

    return (
        <div className="w-full animate-fade-in-slide-up">
            <h2 className="text-3xl font-bold text-center mb-2 text-slate-900">BEDMAS Practice</h2>
             <p className="text-center text-slate-500 mb-6">Correctly Solved: {correctlyAnsweredCount} / {PRACTICE_SESSION_LENGTH}</p>
            <div className="w-full bg-slate-200 rounded-full h-2.5 mb-6">
                <div className={`${progressBarColorClass[colorTheme]} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${progressPercentage}%` }}></div>
            </div>
            {question && (
                <BedmasQuestionCard
                    key={question.id}
                    question={question.answer as BedmasQuestion}
                    currentStepIndex={currentStepIndex}
                    equationHistory={equationHistory}
                    onCorrectStep={handleCorrectStep}
                    colorTheme={colorTheme}
                />
            )}
        </div>
    );
};

export default BedmasPracticeMode;