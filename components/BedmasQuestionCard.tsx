import React, { useState, useEffect, useRef } from 'react';
import { BedmasQuestion, EquationToken, ColorTheme } from '../types';
import { Button } from './Button';

interface BedmasQuestionCardProps {
    question: BedmasQuestion;
    currentStepIndex: number;
    equationHistory: EquationToken[][];
    onCorrectStep: (newEquation: EquationToken[]) => void;
    colorTheme: ColorTheme;
}

const renderToken = (token: EquationToken, nextToken?: EquationToken) => {
    if (token.isImplied) return null;
    if (token.type === 'operator' && token.value === '*') return '×';
    if (token.type === 'operator' && token.value === '/') return '÷';
    if (token.type === 'operator' && token.value === '^' && nextToken?.type === 'number') {
        return <sup>{nextToken.value}</sup>;
    }
    return token.value.toString();
};

const BedmasGuide = ({ hintStepType, colorTheme }: { hintStepType: string, colorTheme: ColorTheme }) => {
    const steps = [
        { id: 'B', label: 'Brackets', types: ['Brackets'] },
        { id: 'E', label: 'Exponents', types: ['Exponents'] },
        { id: 'DM', label: 'Division & Multiplication', types: ['Division', 'Multiplication'] },
        { id: 'AS', label: 'Addition & Subtraction', types: ['Addition', 'Subtraction'] }
    ];

    const themeClasses: Record<ColorTheme, string> = {
        primary: 'bg-blue-200 text-blue-900 ring-blue-500',
        powers: 'bg-red-200 text-red-900 ring-red-500',
        rounding: 'bg-green-200 text-green-900 ring-green-500',
        fractions: 'bg-purple-200 text-purple-900 ring-purple-500',
        bedmas: 'bg-sky-200 text-sky-900 ring-sky-500',
    };

    return (
        <div className="flex justify-center space-x-1 sm:space-x-2 text-xs sm:text-base">
            {steps.map(step => {
                const isHintActive = step.types.includes(hintStepType);
                return (
                    <div key={step.id} className={`p-2 rounded-md text-center transition-all duration-300 ${isHintActive ? `${themeClasses[colorTheme]} font-bold ring-2` : 'bg-slate-200 text-slate-600'}`}>
                        <div className="font-bold">{step.id}</div>
                        <div className="hidden sm:block text-xs">{step.label}</div>
                    </div>
                );
            })}
        </div>
    );
};

export const BedmasQuestionCard: React.FC<BedmasQuestionCardProps> = ({ question, currentStepIndex, equationHistory, onCorrectStep, colorTheme }) => {
    const [subAnswer, setSubAnswer] = useState('');
    const [feedback, setFeedback] = useState<string | null>(null);
    const [showSubProblem, setShowSubProblem] = useState(false);
    const [selectedOperatorIndex, setSelectedOperatorIndex] = useState<number | null>(null);
    const [showHint, setShowHint] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const currentStep = question.steps[currentStepIndex];
    const currentEquation = equationHistory[equationHistory.length - 1];
    const stepType = currentStep.explanation.split(':')[0];
    
    const focusRingClasses: Record<ColorTheme, string> = {
        primary: 'focus:ring-blue-500', powers: 'focus:ring-red-500', rounding: 'focus:ring-green-500',
        fractions: 'focus:ring-purple-500', bedmas: 'focus:ring-sky-500',
    };
    const operatorClasses: Record<ColorTheme, string> = {
        primary: 'text-blue-600', powers: 'text-red-600', rounding: 'text-green-600',
        fractions: 'text-purple-600', bedmas: 'text-sky-600',
    };


    useEffect(() => {
        setShowSubProblem(false);
        setSubAnswer('');
        setFeedback(null);
        setSelectedOperatorIndex(null);
        setShowHint(false);
    }, [currentStep]);

    useEffect(() => {
        if (showSubProblem) {
            inputRef.current?.focus();
        }
    }, [showSubProblem]);

    const handleOperatorClick = (index: number) => {
        if (showSubProblem) return;

        const correctOperatorIndex = currentStep.startIndex + 1;
        
        if (index === correctOperatorIndex) {
            setSelectedOperatorIndex(index);
            setShowSubProblem(true);
            setFeedback(null);
        } else {
            const feedbackText = `Not quite! According to BEDMAS, the next step involves ${currentStep.explanation.split(':')[0]}. Try again.`;
            setFeedback(feedbackText);
            setTimeout(() => setFeedback(null), 3000);
        }
    };

    const handleSubAnswerSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const userAnswer = parseInt(subAnswer, 10);
        if (isNaN(userAnswer)) return;

        if (userAnswer === currentStep.answer) {
            const newEquation = [...currentStep.equation];
            newEquation.splice(currentStep.startIndex, currentStep.endIndex - currentStep.startIndex + 1, {
                type: 'number',
                value: currentStep.answer
            });
            
            if (currentStep.equation[currentStep.startIndex].value === '(') {
                 if(newEquation[currentStep.startIndex - 1]?.isImplied) {
                    newEquation[currentStep.startIndex - 1].isImplied = false;
                 }
            }

            onCorrectStep(newEquation);
        } else {
            setFeedback(`Incorrect. The answer to that part is ${currentStep.answer}. Let's try that again.`);
            setShowSubProblem(false);
            setSubAnswer('');
            setSelectedOperatorIndex(null);
             setTimeout(() => setFeedback(null), 3000);
        }
    };
    
    const renderEquation = (equation: EquationToken[], isCurrentStep: boolean) => {
        return equation.map((token, index) => {
            const nextToken = equation[index + 1];
            if (index > 0 && equation[index - 1]?.value === '^') return null;

            if (isCurrentStep && token.type === 'operator') {
                return (
                    <span
                        key={index}
                        className={`p-1 mx-1 ${operatorClasses[colorTheme]} font-bold rounded-md cursor-pointer hover:bg-yellow-200 transition-colors`}
                        onClick={() => handleOperatorClick(index)}
                    >
                       {renderToken(token, nextToken)}
                    </span>
                );
            }
            
            if (token.isImplied) return null;

            return <span key={index} className="mx-1">{renderToken(token, nextToken)}</span>;
        });
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-slate-200 text-slate-800">
            <div className="flex items-center justify-center mb-4 p-2 bg-slate-100 rounded-lg">
                <BedmasGuide hintStepType={showHint ? stepType : ''} colorTheme={colorTheme} />
                <Button 
                    onClick={() => setShowHint(true)} 
                    disabled={showHint}
                    variant="light" 
                    className="ml-2 sm:ml-4 py-1 px-3 text-sm shadow-sm"
                >
                    Hint
                </Button>
            </div>
            <div className="text-center mb-6">
                <p className="text-slate-500 text-lg">Question</p>
                <div className="text-xl font-bold my-2 text-slate-800">Click the correct operator (+, -, ×, ÷, exponent) to solve the next step.</div>
            </div>

            <div className="bg-slate-100 p-2 rounded-lg text-xl sm:text-2xl text-center font-mono space-y-2 mb-4 tracking-wider overflow-x-auto whitespace-nowrap">
                {equationHistory.map((eq, index) => (
                    <div key={index} className={`flex justify-center items-center p-2 rounded-lg ${index === equationHistory.length - 1 ? 'bg-white shadow-inner' : 'opacity-50'}`}>
                        {renderEquation(eq, index === equationHistory.length - 1)}
                    </div>
                ))}
            </div>

            {showSubProblem && selectedOperatorIndex !== null && (
                <form onSubmit={handleSubAnswerSubmit} className="mt-4 animate-fade-in">
                    <p className="text-center text-lg font-semibold mb-2">
                        Solve:{' '}
                        {currentEquation.slice(currentStep.startIndex, currentStep.endIndex + 1).map((token, i, arr) => {
                            if (i > 0 && arr[i - 1]?.value === '^') return null;
                            const nextToken = arr[i + 1];
                            return <span key={i} className="mx-1">{renderToken(token, nextToken)}</span>;
                        })}
                    </p>
                    <div className="flex items-center justify-center space-x-2">
                        <input
                            ref={inputRef}
                            type="number"
                            value={subAnswer}
                            onChange={(e) => setSubAnswer(e.target.value)}
                            className={`w-32 bg-slate-100 text-slate-900 text-2xl text-center p-2 rounded-lg outline-none border-2 border-slate-300 focus:ring-2 ${focusRingClasses[colorTheme]}`}
                            autoFocus
                        />
                        <Button type="submit" colorTheme={colorTheme}>Solve</Button>
                    </div>
                </form>
            )}

            {feedback && (
                <div className="text-center text-red-600 font-semibold mt-4 bg-red-50 p-3 rounded-lg animate-fade-in">
                    {feedback}
                </div>
            )}
        </div>
    );
};