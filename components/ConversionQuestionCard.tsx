import React, { useState, useEffect, useRef } from 'react';
import { Question, AnswerStatus, ConversionAnswer, GameMode, FractionAnswer, ColorTheme } from '../types';
import { Button } from './Button';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface ConversionQuestionCardProps {
  question: Question;
  onSubmit: (answer: ConversionAnswer) => void;
  status: AnswerStatus;
  correctAnswer: ConversionAnswer | null;
  explanation?: React.ReactNode | null;
  isChallengeMode?: boolean;
  colorTheme?: ColorTheme;
}

const isFraction = (answer: any): answer is FractionAnswer => {
  return (answer as FractionAnswer).numerator !== undefined;
};

export const ConversionQuestionCard: React.FC<ConversionQuestionCardProps> = ({ question, onSubmit, status, correctAnswer, explanation, isChallengeMode = false, colorTheme = 'primary' }) => {
  const [decimalValue, setDecimalValue] = useState('');
  const [percentageValue, setPercentageValue] = useState('');
  const [fractionValue, setFractionValue] = useState('');
  
  const decimalInputRef = useRef<HTMLInputElement>(null);
  const percentageInputRef = useRef<HTMLInputElement>(null);
  const fractionInputRef = useRef<HTMLInputElement>(null);
  
  const focusRingClasses: Record<ColorTheme, string> = {
    primary: 'focus-within:ring-blue-500',
    powers: 'focus-within:ring-red-500',
    rounding: 'focus-within:ring-green-500',
    fractions: 'focus-within:ring-purple-500',
    bedmas: 'focus-within:ring-sky-500',
  };

  useEffect(() => {
    setDecimalValue('');
    setPercentageValue('');
    setFractionValue('');
    if (question.type === GameMode.CONVERT_FRACTIONS) decimalInputRef.current?.focus();
    if (question.type === GameMode.CONVERT_DECIMALS) fractionInputRef.current?.focus();
    if (question.type === GameMode.CONVERT_PERCENTAGES) fractionInputRef.current?.focus();
  }, [question]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== AnswerStatus.UNANSWERED) return;

    const answerPayload: ConversionAnswer = {};
    let isFormValid = true;

    if (question.type === GameMode.CONVERT_FRACTIONS) {
      if (decimalValue.trim() === '' || percentageValue.trim() === '') isFormValid = false;
      answerPayload.decimal = parseFloat(decimalValue);
      answerPayload.percentage = parseFloat(percentageValue);
    } else if (question.type === GameMode.CONVERT_DECIMALS) {
      if (fractionValue.trim() === '' || percentageValue.trim() === '') isFormValid = false;
      const parts = fractionValue.split('/');
      if (parts.length === 2) {
        answerPayload.fraction = { numerator: parseInt(parts[0]), denominator: parseInt(parts[1]) };
      } else {
        isFormValid = false;
      }
      answerPayload.percentage = parseFloat(percentageValue);
    } else if (question.type === GameMode.CONVERT_PERCENTAGES) {
      if (fractionValue.trim() === '' || decimalValue.trim() === '') isFormValid = false;
      const parts = fractionValue.split('/');
      if (parts.length === 2) {
        answerPayload.fraction = { numerator: parseInt(parts[0]), denominator: parseInt(parts[1]) };
      } else {
        isFormValid = false;
      }
      answerPayload.decimal = parseFloat(decimalValue);
    }
    
    if (!isFormValid) return;

    onSubmit(answerPayload);
  };

  const getRingColor = (isCorrect: boolean | null) => {
    if (status === AnswerStatus.UNANSWERED) return focusRingClasses[colorTheme];
    if (isCorrect === true) return 'ring-green-500';
    if (isCorrect === false) return 'ring-red-500';
    return 'ring-transparent';
  };

  // Check individual field correctness for incorrect answers
  let isDecimalCorrect: boolean | null = null;
  let isPercentageCorrect: boolean | null = null;
  let isFractionCorrect: boolean | null = null;

  if (status === AnswerStatus.INCORRECT && correctAnswer) {
    if (correctAnswer.decimal !== undefined) {
        isDecimalCorrect = parseFloat(decimalValue) === correctAnswer.decimal;
    }
    if (correctAnswer.percentage !== undefined) {
        isPercentageCorrect = parseFloat(percentageValue) === correctAnswer.percentage;
    }
    if (correctAnswer.fraction && isFraction(correctAnswer.fraction)) {
        const parts = fractionValue.split('/');
        if (parts.length === 2) {
            isFractionCorrect = parseInt(parts[0]) === correctAnswer.fraction.numerator && parseInt(parts[1]) === correctAnswer.fraction.denominator;
        } else {
            isFractionCorrect = false;
        }
    }
  }
  
  const ringClasses = 'relative transition-colors duration-300 rounded-xl ring-2';


  const renderDecimalInput = () => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Decimal</label>
        <div className={`${ringClasses} ${status === AnswerStatus.CORRECT ? 'ring-green-500' : getRingColor(isDecimalCorrect)}`}>
        <input ref={decimalInputRef} type="number" step="any" value={decimalValue} onChange={e => setDecimalValue(e.target.value)} className="w-full bg-slate-100 text-slate-900 text-2xl text-center p-3 rounded-xl outline-none" placeholder="0.0" disabled={status !== AnswerStatus.UNANSWERED} autoFocus={question.type === GameMode.CONVERT_FRACTIONS} />
        {status === AnswerStatus.CORRECT && <CheckCircleIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 text-green-500"/>}
        {status === AnswerStatus.INCORRECT && (isDecimalCorrect ? <CheckCircleIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 text-green-500"/> : <XCircleIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 text-red-500"/>)}
        </div>
        {status === AnswerStatus.INCORRECT && !isDecimalCorrect && correctAnswer?.decimal !== undefined && <p className="text-sm text-red-500 mt-1 text-center">Correct: <strong>{correctAnswer.decimal}</strong></p>}
    </div>
  );

  const renderPercentageInput = () => (
     <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Percentage</label>
        <div className={`${ringClasses} ${status === AnswerStatus.CORRECT ? 'ring-green-500' : getRingColor(isPercentageCorrect)}`}>
            <input ref={percentageInputRef} type="number" step="any" value={percentageValue} onChange={e => setPercentageValue(e.target.value)} className="w-full bg-slate-100 text-slate-900 text-2xl text-center p-3 rounded-xl outline-none pr-10" placeholder="0" disabled={status !== AnswerStatus.UNANSWERED} />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-slate-500">%</span>
            {status === AnswerStatus.CORRECT && <CheckCircleIcon className="absolute right-10 top-1/2 -translate-y-1/2 w-7 h-7 text-green-500"/>}
            {status === AnswerStatus.INCORRECT && (isPercentageCorrect ? <CheckCircleIcon className="absolute right-10 top-1/2 -translate-y-1/2 w-7 h-7 text-green-500"/> : <XCircleIcon className="absolute right-10 top-1/2 -translate-y-1/2 w-7 h-7 text-red-500"/>)}
        </div>
        {status === AnswerStatus.INCORRECT && !isPercentageCorrect && correctAnswer?.percentage !== undefined && <p className="text-sm text-red-500 mt-1 text-center">Correct: <strong>{correctAnswer.percentage}%</strong></p>}
    </div>
  );

  const renderFractionInput = () => (
     <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Fraction (improper)</label>
        <div className={`${ringClasses} ${status === AnswerStatus.CORRECT ? 'ring-green-500' : getRingColor(isFractionCorrect)}`}>
            <input ref={fractionInputRef} type="text" value={fractionValue} onChange={e => setFractionValue(e.target.value)} className="w-full bg-slate-100 text-slate-900 text-2xl text-center p-3 rounded-xl outline-none" placeholder="n/d" disabled={status !== AnswerStatus.UNANSWERED} autoFocus={question.type !== GameMode.CONVERT_FRACTIONS} />
            {status === AnswerStatus.CORRECT && <CheckCircleIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 text-green-500"/>}
            {status === AnswerStatus.INCORRECT && (isFractionCorrect ? <CheckCircleIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 text-green-500"/> : <XCircleIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 text-red-500"/>)}
        </div>
        {status === AnswerStatus.INCORRECT && !isFractionCorrect && correctAnswer?.fraction && <p className="text-sm text-red-500 mt-1 text-center">Correct: <strong>{correctAnswer.fraction.numerator}/{correctAnswer.fraction.denominator}</strong></p>}
    </div>
  );


  return (
    <div className="bg-white p-8 rounded-xl shadow-xl border border-slate-200">
      <div className="text-center mb-6">
        <p className="text-slate-500 text-lg">Question</p>
        <div className="text-4xl md:text-5xl font-bold my-2 tracking-wider text-slate-800">{question.text}</div>
        <p className="text-sm text-slate-500">(Enter fractions as improper fractions, e.g., 5/4)</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
           {question.type === GameMode.CONVERT_PERCENTAGES && renderFractionInput()}
           {question.type === GameMode.CONVERT_DECIMALS && renderFractionInput()}

           {question.type === GameMode.CONVERT_FRACTIONS && renderDecimalInput()}
           {question.type === GameMode.CONVERT_PERCENTAGES && renderDecimalInput()}

           {question.type === GameMode.CONVERT_FRACTIONS && renderPercentageInput()}
           {question.type === GameMode.CONVERT_DECIMALS && renderPercentageInput()}
        </div>
       
        {explanation && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-slate-700 text-sm">
            <h4 className="font-bold mb-2 text-blue-800">How to solve:</h4>
            {explanation}
          </div>
        )}
        
        {!isChallengeMode && (
          <div className="mt-6">
            <Button type="submit" fullWidth disabled={status !== AnswerStatus.UNANSWERED} colorTheme={colorTheme}>
              Submit Answer
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};