import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { GameMode, Question, AnswerStatus, FractionAnswer, ConversionAnswer, FDPValue, BedmasQuestion, ColorTheme } from '../types';
import { PRACTICE_SESSION_LENGTH } from '../constants';
import { generateQuestion } from '../utils/questionGenerator';
import { QuestionCard } from './QuestionCard';
import { FractionQuestionCard } from './FractionQuestionCard';
import { ConversionQuestionCard } from './ConversionQuestionCard';
import { OrderingQuestionCard } from './OrderingQuestionCard';
import { Button } from './Button';

const generateUniqueQuestion = (mode: GameMode, existingQuestions: Question[]): Question => {
    let newQuestion: Question;
    let isDuplicate: boolean;
    do {
        newQuestion = generateQuestion(mode);
        isDuplicate = existingQuestions.some(q => JSON.stringify(q.answer) === JSON.stringify(newQuestion.answer) && q.type === newQuestion.type);
    } while (isDuplicate);
    return newQuestion;
};

const isFractionAnswer = (answer: any): answer is FractionAnswer => {
  return (answer as FractionAnswer).numerator !== undefined;
};

const isConversionAnswer = (answer: any): answer is ConversionAnswer => {
  return (answer as ConversionAnswer).decimal !== undefined || (answer as ConversionAnswer).percentage !== undefined || (answer as ConversionAnswer).fraction !== undefined;
};

const isFDPValueArray = (answer: any): answer is FDPValue[] => {
  return Array.isArray(answer) && answer.every(item => item && typeof item.id === 'string');
}


const PracticeMode: React.FC<{ mode: GameMode; onBack: () => void; colorTheme: ColorTheme; }> = ({ mode, onBack, colorTheme }) => {
  const [questionQueue, setQuestionQueue] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctlyAnsweredCount, setCorrectlyAnsweredCount] = useState(0);
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>(AnswerStatus.UNANSWERED);
  const [correctAnswer, setCorrectAnswer] = useState<number | FractionAnswer | ConversionAnswer | FDPValue[] | BedmasQuestion | null>(null);
  const [explanation, setExplanation] = useState<React.ReactNode | null>(null);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const nextQuestionTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // Cleanup timer on unmount
    return () => {
      if (nextQuestionTimerRef.current) {
        clearTimeout(nextQuestionTimerRef.current);
      }
    };
  }, []);

  const currentQuestion = useMemo(() => {
    if (questionQueue.length > 0 && currentQuestionIndex < questionQueue.length) {
      return questionQueue[currentQuestionIndex];
    }
    return null;
  }, [questionQueue, currentQuestionIndex]);

  const title = useMemo(() => {
    switch (mode) {
      case GameMode.SQUARES: return 'Practice Squares';
      case GameMode.CUBES: return 'Practice Cubes';
      case GameMode.SQUARE_ROOTS: return 'Practice Square Roots';
      case GameMode.ROUND_TENS: return 'Round to the Nearest 10';
      case GameMode.ROUND_HUNDREDS: return 'Round to the Nearest 100';
      case GameMode.ROUND_THOUSANDS: return 'Round to the Nearest 1,000';
      case GameMode.ROUND_TEN_THOUSANDS: return 'Round to the Nearest 10,000';
      case GameMode.ROUND_HUNDRED_THOUSANDS: return 'Round to the Nearest 100,000';
      case GameMode.ROUND_TENTHS: return 'Round to the Nearest Tenth';
      case GameMode.ROUND_HUNDREDTHS: return 'Round to the Nearest Hundredth';
      case GameMode.ROUND_THOUSANDTHS: return 'Round to the Nearest Thousandth';
      case GameMode.SIMPLIFY_FRACTIONS: return 'Practice Simplifying Fractions';
      case GameMode.CONVERT_FRACTIONS: return 'Convert Fractions';
      case GameMode.CONVERT_DECIMALS: return 'Convert Decimals';
      case GameMode.CONVERT_PERCENTAGES: return 'Convert Percentages';
      case GameMode.ORDERING_FDP: return 'Practice Ordering FDP';
      default: return 'Practice Mode';
    }
  }, [mode]);

  const initializeSession = useCallback(() => {
    const initialQuestions: Question[] = [];
    const uniqueNeeded = !mode.toString().startsWith('ROUND');
    for (let i = 0; i < PRACTICE_SESSION_LENGTH; i++) {
        initialQuestions.push(uniqueNeeded ? generateUniqueQuestion(mode, initialQuestions) : generateQuestion(mode));
    }
    setQuestionQueue(initialQuestions);
    setCurrentQuestionIndex(0);
    setCorrectlyAnsweredCount(0);
    setIsSessionComplete(false);
    setAnswerStatus(AnswerStatus.UNANSWERED);
    setCorrectAnswer(null);
    setExplanation(null);
  }, [mode]);

  const nextQuestion = useCallback(() => {
    if (correctlyAnsweredCount >= PRACTICE_SESSION_LENGTH) {
      setIsSessionComplete(true);
      return;
    }
    
    const nextIndex = currentQuestionIndex + 1;
    const uniqueNeeded = !mode.toString().startsWith('ROUND');

    if (nextIndex >= questionQueue.length) {
        setQuestionQueue(prev => [...prev, uniqueNeeded ? generateUniqueQuestion(mode, prev) : generateQuestion(mode)]);
    }

    setCurrentQuestionIndex(nextIndex);
    setAnswerStatus(AnswerStatus.UNANSWERED);
    setCorrectAnswer(null);
    setExplanation(null);

  }, [correctlyAnsweredCount, currentQuestionIndex, questionQueue, mode]);
  
  const resetSession = useCallback(() => { initializeSession(); }, [initializeSession]);

  useEffect(() => { initializeSession(); }, [mode, initializeSession]);

  const handleAnswerSubmit = (userAnswer: number | FractionAnswer | ConversionAnswer | FDPValue[]) => {
    if (answerStatus !== AnswerStatus.UNANSWERED || !currentQuestion) return;
    
    const correctAnswerValue = currentQuestion.answer;

    let isCorrect = false;

    if (isFDPValueArray(userAnswer) && isFDPValueArray(correctAnswerValue)) {
      if (userAnswer.length === correctAnswerValue.length) {
        isCorrect = userAnswer.every((item, index) => item.id === correctAnswerValue[index].id);
      }
    } else if (isConversionAnswer(userAnswer) && isConversionAnswer(correctAnswerValue)) {
      const isDecimalCorrect = userAnswer.decimal === correctAnswerValue.decimal;
      const isPercentageCorrect = userAnswer.percentage === correctAnswerValue.percentage;
      const isFractionCorrect = userAnswer.fraction && correctAnswerValue.fraction &&
          userAnswer.fraction.numerator === correctAnswerValue.fraction.numerator &&
          userAnswer.fraction.denominator === correctAnswerValue.fraction.denominator;

      if (mode === GameMode.CONVERT_FRACTIONS) {
        isCorrect = isDecimalCorrect && isPercentageCorrect;
      } else if (mode === GameMode.CONVERT_DECIMALS) {
        isCorrect = isFractionCorrect && isPercentageCorrect;
      } else if (mode === GameMode.CONVERT_PERCENTAGES) {
        isCorrect = isFractionCorrect && isDecimalCorrect;
      }

    } else if (isFractionAnswer(userAnswer) && isFractionAnswer(correctAnswerValue)) {
      // Fraction logic
      const isCorrectSimplified = userAnswer.numerator === correctAnswerValue.numerator && userAnswer.denominator === correctAnswerValue.denominator;
      const isEquivalent = userAnswer.numerator * correctAnswerValue.denominator === userAnswer.denominator * correctAnswerValue.numerator;
      
      if (isCorrectSimplified) {
        isCorrect = true;
      } else if (isEquivalent) {
        setAnswerStatus(AnswerStatus.PARTIAL);
        return; 
      }
    } else if (typeof userAnswer === 'number' && typeof correctAnswerValue === 'number') {
      isCorrect = userAnswer === correctAnswerValue;
    }

    if (isCorrect) {
      setAnswerStatus(AnswerStatus.CORRECT);
      setCorrectlyAnsweredCount(prev => prev + 1);
      nextQuestionTimerRef.current = window.setTimeout(nextQuestion, 1000);
    } else {
      setAnswerStatus(AnswerStatus.INCORRECT);
      setCorrectAnswer(correctAnswerValue);
      setExplanation(currentQuestion.explanation ?? null);
      const failedQuestion = { ...currentQuestion, id: `${Date.now()}-${Math.random()}`};
      setQuestionQueue(prev => {
        const newQueue = [...prev];
        newQueue.splice(currentQuestionIndex + 2, 0, failedQuestion);
        return newQueue;
      });
    }
  };

  const progressPercentage = (correctlyAnsweredCount / PRACTICE_SESSION_LENGTH) * 100;
  
  const progressBarColorClass: Record<ColorTheme, string> = {
    primary: 'bg-blue-600',
    powers: 'bg-red-500',
    rounding: 'bg-green-500',
    fractions: 'bg-purple-600',
    bedmas: 'bg-sky-500',
  };

  if (isSessionComplete) {
    return (
       <div className="bg-white p-8 rounded-xl shadow-xl border border-slate-200 text-center animate-fade-in text-slate-800">
         <h2 className="text-3xl font-bold text-green-600 mb-4">Session Complete!</h2>
         <p className="text-lg text-slate-600 mb-8">You answered {PRACTICE_SESSION_LENGTH} questions correctly.</p>
         <div className="flex space-x-4">
          <Button onClick={resetSession} fullWidth colorTheme={colorTheme}>Practice Again</Button>
          <Button onClick={onBack} variant="light" fullWidth>Main Menu</Button>
         </div>
       </div>
    );
  }

  const renderQuestionCard = () => {
    if (!currentQuestion) return null;
    if (mode === GameMode.ORDERING_FDP) {
      return (
        <OrderingQuestionCard 
          key={currentQuestion.id}
          question={currentQuestion}
          onSubmit={handleAnswerSubmit as (answer: FDPValue[]) => void}
          status={answerStatus}
          explanation={explanation}
          colorTheme={colorTheme}
        />
      );
    }
    if (mode.toString().startsWith('CONVERT_')) {
      return (
        <ConversionQuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          onSubmit={handleAnswerSubmit as (answer: ConversionAnswer) => void}
          status={answerStatus}
          correctAnswer={correctAnswer as ConversionAnswer | null}
          explanation={explanation}
          colorTheme={colorTheme}
        />
      )
    }
    if (isFractionAnswer(currentQuestion.answer)) {
        return (
             <FractionQuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              onSubmit={handleAnswerSubmit as (answer: FractionAnswer) => void}
              status={answerStatus}
              correctAnswer={correctAnswer as FractionAnswer | null}
              explanation={explanation}
              colorTheme={colorTheme}
            />
        )
    }
    return (
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          onSubmit={handleAnswerSubmit as (answer: number) => void}
          status={answerStatus}
          correctAnswer={correctAnswer as number | null}
          explanation={explanation}
          colorTheme={colorTheme}
        />
    )
  }

  return (
    <div className="w-full animate-fade-in-slide-up">
      <h2 className="text-3xl font-bold text-center mb-2 text-slate-900">{title}</h2>
      <p className="text-center text-slate-500 mb-6">Correct: {correctlyAnsweredCount} / {PRACTICE_SESSION_LENGTH}</p>
      
      <div className="w-full bg-slate-200 rounded-full h-2.5 mb-6">
        <div className={`${progressBarColorClass[colorTheme]} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${progressPercentage}%` }}></div>
      </div>
      
      {renderQuestionCard()}

      {answerStatus === AnswerStatus.INCORRECT && (
         <div className="mt-6 flex justify-center">
            <Button onClick={nextQuestion} colorTheme={colorTheme}>
              {correctlyAnsweredCount >= PRACTICE_SESSION_LENGTH ? 'Finish Session' : 'Next Question'}
            </Button>
         </div>
      )}
    </div>
  );
};

export default PracticeMode;