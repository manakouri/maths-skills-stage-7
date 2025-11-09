import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameMode, Question, AnswerStatus, ColorTheme } from '../types';
import { CHALLENGE_DURATION_SECONDS, HIGH_SCORE_STORAGE_KEY } from '../constants';
import { generateQuestion } from '../utils/questionGenerator';
import { QuestionCard } from './QuestionCard';
import { Button } from './Button';
import { TimerIcon, TrophyIcon } from './icons';

interface ChallengeModeProps {
  onBack: () => void;
  colorTheme: ColorTheme;
}

const POWERS_AND_ROOTS_MODES: GameMode[] = [
    GameMode.SQUARES, GameMode.CUBES, GameMode.SQUARE_ROOTS
];

const generateRandomQuestion = (): Question => {
  const randomMode = POWERS_AND_ROOTS_MODES[Math.floor(Math.random() * POWERS_AND_ROOTS_MODES.length)];
  return generateQuestion(randomMode);
};

const ChallengeMode: React.FC<ChallengeModeProps> = ({ onBack, colorTheme }) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'results'>('intro');
  const [question, setQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(CHALLENGE_DURATION_SECONDS);
  const [highScore, setHighScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>(AnswerStatus.UNANSWERED);
  const [correctAnswerForDisplay, setCorrectAnswerForDisplay] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);

  useEffect(() => {
    const storedHighScore = localStorage.getItem(HIGH_SCORE_STORAGE_KEY);
    setHighScore(storedHighScore ? parseInt(storedHighScore, 10) : 0);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(CHALLENGE_DURATION_SECONDS);
    setIsNewHighScore(false);
    setQuestion(generateRandomQuestion());
    setGameState('playing');
    setAnswerStatus(AnswerStatus.UNANSWERED);
    setCorrectAnswerForDisplay(null);
    isPausedRef.current = false;
    
    timerRef.current = window.setInterval(() => {
      if (!isPausedRef.current) {
          setTimeLeft(prev => {
            if (prev <= 1) {
              stopTimer();
              setGameState('results');
              return 0;
            }
            return prev - 1;
          });
      }
    }, 1000);
  }, [stopTimer]);
  
  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  useEffect(() => {
      if (gameState === 'results') {
          if (score > highScore) {
              setHighScore(score);
              setIsNewHighScore(true);
              localStorage.setItem(HIGH_SCORE_STORAGE_KEY, score.toString());
          }
      }
  }, [gameState, score, highScore]);


  const nextQuestion = useCallback(() => {
    setQuestion(generateRandomQuestion());
    setAnswerStatus(AnswerStatus.UNANSWERED);
    setCorrectAnswerForDisplay(null);
    isPausedRef.current = false;
  }, []);

  const handleAnswerSubmit = (userAnswer: number) => {
    if (answerStatus !== AnswerStatus.UNANSWERED || !question) return;

    const isCorrect = userAnswer === question.answer;

    if(isCorrect) {
        setScore(prev => prev + 1);
        nextQuestion();
    } else {
        setAnswerStatus(AnswerStatus.INCORRECT);
        setCorrectAnswerForDisplay(question.answer as number);
        isPausedRef.current = true;
    }
  };

  if (gameState === 'intro') {
    return (
      <div className="bg-white text-slate-800 p-8 rounded-xl shadow-xl border border-slate-200 text-center animate-fade-in">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Timed Challenge</h2>
        <p className="text-lg text-slate-600 mb-2">Answer as many questions as you can in {CHALLENGE_DURATION_SECONDS} seconds.</p>
        <p className="text-xl font-semibold text-slate-700 mb-8 flex items-center justify-center">
            <TrophyIcon className="w-6 h-6 mr-2 text-yellow-500"/> High Score: {highScore}
        </p>
        <Button onClick={startGame} colorTheme={colorTheme} fullWidth>Start Challenge</Button>
      </div>
    );
  }

  if (gameState === 'results') {
    return (
      <div className="bg-white text-slate-800 p-8 rounded-xl shadow-xl border border-slate-200 text-center animate-fade-in">
        <h2 className="text-3xl font-bold text-blue-600 mb-4">Time's Up!</h2>
        <p className="text-5xl font-bold text-slate-900 my-6">{score}</p>
        <p className="text-xl text-slate-500 mb-6">Your Final Score</p>
        {isNewHighScore && (
            <p className="text-2xl font-bold text-yellow-500 mb-6 animate-pulse">
                New High Score!
            </p>
        )}
        <div className="flex space-x-4 mt-8">
            <Button onClick={startGame} fullWidth colorTheme={colorTheme}>Play Again</Button>
            <Button onClick={onBack} variant="light" fullWidth>Main Menu</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-in-slide-up">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 text-base sm:text-lg font-semibold text-slate-800">
            <div className="bg-white px-3 sm:px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-center">Score: <span className="text-green-600 font-bold">{score}</span></div>
            <div className="bg-white px-3 sm:px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center justify-center">
                <TrophyIcon className="w-5 h-5 mr-2 text-yellow-500"/>
                <span className="text-slate-800 font-bold">{highScore}</span>
            </div>
            <div className="bg-white px-3 sm:px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center justify-center">
                <TimerIcon className="w-5 h-5 mr-2" />
                <span className={`font-bold ${isPausedRef.current ? 'text-slate-400' : 'text-red-500'}`}>{timeLeft}</span>
            </div>
        </div>
      {question && (
        <QuestionCard
          key={question.id}
          question={question}
          onSubmit={handleAnswerSubmit}
          status={answerStatus}
          correctAnswer={correctAnswerForDisplay}
          isChallengeMode={true}
          colorTheme={colorTheme}
        />
      )}
      {answerStatus === AnswerStatus.INCORRECT && (
        <div className="mt-6 flex justify-center">
            <Button onClick={nextQuestion} colorTheme={colorTheme}>
                Next Question
            </Button>
        </div>
      )}
    </div>
  );
};

export default ChallengeMode;