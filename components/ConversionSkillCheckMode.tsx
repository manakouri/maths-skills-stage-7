import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { GameMode, Question, SkillCheckType, AnswerStatus, FractionAnswer, ColorTheme } from '../types';
import { generateConversionSkillCheckQuestions } from '../utils/questionGenerator';
import { QuestionCard } from './QuestionCard';
import { FractionQuestionCard } from './FractionQuestionCard';
import { Button } from './Button';
import { TrophyIcon } from './icons';

interface ConversionSkillCheckModeProps {
  type: SkillCheckType;
  onBack: () => void;
  colorTheme: ColorTheme;
}

const isFractionAnswer = (answer: any): answer is FractionAnswer => {
  return (answer as FractionAnswer).numerator !== undefined;
};

const ConversionSkillCheckMode: React.FC<ConversionSkillCheckModeProps> = ({ type, onBack, colorTheme }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [incorrectlyAnsweredTypes, setIncorrectlyAnsweredTypes] = useState<Set<string>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>(AnswerStatus.UNANSWERED);
  const [correctAnswer, setCorrectAnswer] = useState<number | FractionAnswer | null>(null);
  const nextQuestionTimerRef = useRef<number | null>(null);

  const title = useMemo(() => {
      if (type === 'convert_fractions') return 'Skill Check: Fractions';
      if (type === 'convert_decimals') return 'Skill Check: Decimals';
      if (type === 'convert_percentages') return 'Skill Check: Percentages';
      return 'Skill Check';
  }, [type]);

  const totalQuestions = questions.length;

  const initializeCheck = useCallback(() => {
    setQuestions(generateConversionSkillCheckQuestions(type));
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

  const handleAnswerSubmit = (userAnswer: number | FractionAnswer) => {
    if (answerStatus !== AnswerStatus.UNANSWERED) return;

    const currentQuestion = questions[currentQuestionIndex];
    let isCorrect = false;
    
    if (isFractionAnswer(userAnswer) && isFractionAnswer(currentQuestion.answer)) {
        isCorrect = userAnswer.numerator === currentQuestion.answer.numerator && userAnswer.denominator === currentQuestion.answer.denominator;
    } else if (typeof userAnswer === 'number' && typeof currentQuestion.answer === 'number') {
        isCorrect = userAnswer === currentQuestion.answer;
    }

    if (isCorrect) {
        setAnswerStatus(AnswerStatus.CORRECT);
        nextQuestionTimerRef.current = window.setTimeout(moveToNextQuestion, 1000);
    } else {
        if (currentQuestion.skillCheckSubType) {
          setIncorrectlyAnsweredTypes(prev => new Set(prev).add(currentQuestion.skillCheckSubType!));
        }
        setAnswerStatus(AnswerStatus.INCORRECT);
        setCorrectAnswer(currentQuestion.answer as (number | FractionAnswer));
    }
  };
  
  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);
  const progressPercentage = totalQuestions > 0 ? ((currentQuestionIndex) / totalQuestions) * 100 : 0;
  
  const progressBarColorClass = "bg-green-500"; // Skill checks always use green for mastery progress

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
                   {Array.from(incorrectlyAnsweredTypes).map((subType) => (
                       <li key={subType} className="font-semibold text-yellow-800">{subType}</li>
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

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    if (isFractionAnswer(currentQuestion.answer)) {
        return (
            <FractionQuestionCard
                key={currentQuestion.id}
                question={currentQuestion}
                onSubmit={handleAnswerSubmit as (answer: FractionAnswer) => void}
                status={answerStatus}
                correctAnswer={correctAnswer as FractionAnswer | null}
                colorTheme={colorTheme}
            />
        );
    }

    return (
        <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            onSubmit={handleAnswerSubmit as (answer: number) => void}
            status={answerStatus}
            correctAnswer={correctAnswer as number | null}
            colorTheme={colorTheme}
        />
    );
  }

  return (
    <div className="w-full animate-fade-in-slide-up">
      <h2 className="text-3xl font-bold text-center mb-2 text-slate-900">{title}</h2>
      <p className="text-center text-slate-500 mb-6">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
      
      <div className="w-full bg-slate-200 rounded-full h-2.5 mb-6">
        <div className={`${progressBarColorClass} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${progressPercentage}%` }}></div>
      </div>
      
      {renderQuestion()}

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

export default ConversionSkillCheckMode;