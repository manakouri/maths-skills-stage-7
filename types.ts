import React from 'react';

export enum GameMode {
  // Powers & Roots
  SQUARES = 'SQUARES',
  CUBES = 'CUBES',
  SQUARE_ROOTS = 'SQUARE_ROOTS',

  // Rounding Whole Numbers
  ROUND_TENS = 'ROUND_TENS',
  ROUND_HUNDREDS = 'ROUND_HUNDREDS',
  ROUND_THOUSANDS = 'ROUND_THOUSANDS',
  ROUND_TEN_THOUSANDS = 'ROUND_TEN_THOUSANDS',
  ROUND_HUNDRED_THOUSANDS = 'ROUND_HUNDRED_THOUSANDS',

  // Rounding Decimals
  ROUND_TENTHS = 'ROUND_TENTHS',
  ROUND_HUNDREDTHS = 'ROUND_HUNDREDTHS',
  ROUND_THOUSANDTHS = 'ROUND_THOUSANDTHS',

  // Fractions
  SIMPLIFY_FRACTIONS = 'SIMPLIFY_FRACTIONS',

  // Conversions
  CONVERT_FRACTIONS = 'CONVERT_FRACTIONS',
  CONVERT_DECIMALS = 'CONVERT_DECIMALS',
  CONVERT_PERCENTAGES = 'CONVERT_PERCENTAGES',

  // Ordering
  ORDERING_FDP = 'ORDERING_FDP',

  // BEDMAS
  BEDMAS = 'BEDMAS',
}

export interface FractionAnswer {
  numerator: number;
  denominator: number;
}

export interface ConversionAnswer {
  decimal?: number;
  percentage?: number;
  fraction?: FractionAnswer;
}

export interface FDPValue {
  id: string;
  type: 'fraction' | 'decimal' | 'percentage';
  value: number; // The underlying numeric value for comparison
  display: string | React.ReactNode;
}

// BEDMAS Types
export type EquationToken = {
  type: 'number' | 'operator' | 'bracket';
  value: number | string;
  isImplied?: boolean;
};

export interface BedmasStep {
  equation: EquationToken[];
  startIndex: number;
  endIndex: number;
  answer: number;
  explanation: string;
}

export interface BedmasQuestion {
  initialEquation: EquationToken[];
  steps: BedmasStep[];
}

export interface Question {
  id:string;
  text: string | React.ReactNode;
  answer: number | FractionAnswer | ConversionAnswer | FDPValue[] | BedmasQuestion;
  type: GameMode;
  explanation?: string | React.ReactNode; // For pedagogical feedback
  skillCheckSubType?: string; // e.g., "Fraction to Decimal"
  items?: FDPValue[]; // For ordering questions
}

export type SkillCheckType = 
  | 'whole_numbers' 
  | 'decimals'
  | 'convert_fractions'
  | 'convert_decimals'
  | 'convert_percentages';

export type AppView =
  | 'top_menu'
  | 'powers_and_roots_menu'
  | 'rounding_menu'
  | 'conversions_menu'
  | 'bedmas_menu'
  | 'practice'
  | 'challenge'
  | 'rounding_challenge'
  | 'fractions_challenge'
  | 'conversion_challenge'
  | 'ordering_challenge'
  | 'skill_check'
  | 'conversion_skill_check'
  | 'bedmas_practice'
  | 'bedmas_challenge';

export type AppState = {
  view: AppView;
  mode?: GameMode; // For practice mode
  skillCheckType?: SkillCheckType; // For skill check mode
};

export enum AnswerStatus {
  UNANSWERED,
  CORRECT,
  INCORRECT,
  PARTIAL, // For fractions that are equivalent but not fully simplified
}

export type ColorTheme = 'primary' | 'powers' | 'rounding' | 'fractions' | 'bedmas';