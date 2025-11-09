import React from 'react';
import { GameMode, Question, SkillCheckType, FractionAnswer, ConversionAnswer, FDPValue, BedmasQuestion, EquationToken, BedmasStep } from '../types';
import { SQUARES_MAX, CUBES_MAX, SQUARE_ROOTS_MAX } from '../constants';

// --- Helper Functions ---

const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);

// Highest Common Factor
const hcf = (a: number, b: number): number => {
  return b === 0 ? a : hcf(b, a % b);
};

// Fisher-Yates shuffle algorithm
const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};


const generateRoundingExplanation = (
  original: number,
  rounded: number,
  placeName: string,
  decidingDigit: number,
  decidingDigitIndex: number,
) => {
  const originalStr = original.toString();
  const highlightedOriginal = React.createElement(
    React.Fragment,
    null,
    originalStr.slice(0, decidingDigitIndex),
    React.createElement(
      'span',
      { className: 'text-blue-500 font-bold' },
      originalStr[decidingDigitIndex],
    ),
    originalStr.slice(decidingDigitIndex + 1),
  );

  return React.createElement(
    React.Fragment,
    null,
    'To round ',
    React.createElement('strong', null, formatNumber(original)),
    ` to the nearest ${placeName}:`,
    React.createElement(
      'ol',
      { className: 'list-decimal list-inside mt-2 space-y-1 text-left' },
      React.createElement(
        'li',
        null,
        `Find the digit to the right of the ${placeName} place. This is the 'deciding' digit: `,
        highlightedOriginal,
      ),
      React.createElement(
        'li',
        null,
        'The deciding digit is ',
        React.createElement(
          'strong',
          { className: 'text-blue-500' },
          decidingDigit,
        ),
        '.',
      ),
      React.createElement(
        'li',
        null,
        `Since ${decidingDigit} is ${
          decidingDigit < 5 ? 'less than 5, we round' : '5 or more, we round'
        } `,
        React.createElement('strong', null, decidingDigit < 5 ? 'down' : 'up'),
        '.',
      ),
      React.createElement(
        'li',
        null,
        'The correct answer is ',
        React.createElement('strong', null, formatNumber(rounded)),
        '.',
      ),
    ),
  );
};


const generateFractionExplanation = (numerator: number, denominator: number, divisor: number) => {
    return React.createElement(
      React.Fragment,
      null,
      'To simplify the fraction, we find the Highest Common Factor (HCF).',
      React.createElement(
        'ol',
        { className: 'list-decimal list-inside mt-2 space-y-1 text-left' },
        React.createElement(
          'li',
          null,
          'The HCF of ',
          React.createElement('strong', null, numerator),
          ' and ',
          React.createElement('strong', null, denominator),
          ' is ',
          React.createElement('strong', { className: 'text-blue-500' }, divisor),
          '.',
        ),
        React.createElement(
          'li',
          null,
          'Divide both the numerator and the denominator by the HCF.',
        ),
        React.createElement(
            'li',
            null,
             `${numerator} ÷ ${divisor} = `,
             React.createElement('strong', null, numerator / divisor),
        ),
        React.createElement(
            'li',
            null,
             `${denominator} ÷ ${divisor} = `,
             React.createElement('strong', null, denominator / divisor),
        ),
        React.createElement(
          'li',
          null,
          'The simplified fraction is ',
          React.createElement('strong', null, `${numerator / divisor} / ${denominator / divisor}`),
          '.',
        ),
      ),
      React.createElement(
        'a',
        {
          href: 'https://manakouri.github.io/factors_primes_multiples/',
          target: '_blank',
          rel: 'noopener noreferrer',
          className: 'mt-4 block text-center w-full px-4 py-2 bg-blue-100 text-blue-800 font-semibold rounded-lg hover:bg-blue-200 transition-colors text-xs sm:text-sm'
        },
        'Practice finding the HCF by playing HCF Heights in the Factors, Primes and Multiples Arena!'
      )
    );
};

const F_TO_D_EXPLANATION = (n: number, d: number, dec: number) => React.createElement(
  'div', null,
  React.createElement('h5', { className: 'font-bold text-blue-800 mb-1' }, 'Fraction to Decimal:'),
  'To convert a fraction to a decimal, divide the numerator by the denominator.',
  React.createElement('p', { className: 'font-mono mt-1' }, `${n} ÷ ${d} = `, React.createElement('strong', { className: 'text-blue-500' }, dec))
);

const D_TO_P_EXPLANATION = (dec: number, p: number) => React.createElement(
  'div', null,
  React.createElement('h5', { className: 'font-bold text-green-800 mb-1' }, 'Decimal to Percentage:'),
  'To convert a decimal to a percentage, multiply by 100.',
  React.createElement('p', { className: 'font-mono mt-1' }, `${dec} × 100 = `, React.createElement('strong', { className: 'text-green-500' }, `${p}%`))
);

const P_TO_D_EXPLANATION = (p: number, dec: number) => React.createElement(
  'div', null,
  React.createElement('h5', { className: 'font-bold text-blue-800 mb-1' }, 'Percentage to Decimal:'),
  'To convert a percentage to a decimal, divide by 100.',
  React.createElement('p', { className: 'font-mono mt-1' }, `${p}% ÷ 100 = `, React.createElement('strong', { className: 'text-blue-500' }, dec))
);

const D_TO_F_EXPLANATION = (dec: number, n: number, d: number) => {
    const decStr = dec.toString();
    const decimalPlaces = decStr.includes('.') ? decStr.split('.')[1].length : 0;
    const powerOf10 = Math.pow(10, decimalPlaces);
    const initialN = dec * powerOf10;
    const divisor = hcf(initialN, powerOf10);

    return React.createElement(
        'div', null,
        React.createElement('h5', { className: 'font-bold text-red-800 mb-1' }, 'Decimal to Fraction:'),
        React.createElement(
            'ol', { className: 'list-decimal list-inside space-y-1' },
            React.createElement('li', null, `Write the decimal as a fraction over a power of 10. ${dec} = ${initialN}/${powerOf10}.`),
            React.createElement('li', null, `Simplify the fraction by dividing the numerator and denominator by their HCF (${divisor}).`),
            React.createElement('li', null, `The result is `, React.createElement('strong', { className: 'text-red-500' }, `${n}/${d}`))
        )
    );
};

const generateOrderingExplanation = (correctOrder: FDPValue[]) => {
  return React.createElement(
    React.Fragment,
    null,
    "To order these values, it's easiest to convert them all to the same format, like percentages.",
    React.createElement(
      'table',
      { className: 'w-full text-left mt-3 border-collapse' },
      React.createElement(
        'thead',
        null,
        React.createElement(
          'tr',
          null,
          React.createElement('th', { className: 'p-2 border-b-2 border-gray-300 text-gray-600' }, 'Original'),
          React.createElement('th', { className: 'p-2 border-b-2 border-gray-300 text-gray-600' }, 'As Percentage'),
        ),
      ),
      React.createElement(
        'tbody',
        null,
        correctOrder.map(item =>
          React.createElement(
            'tr',
            { key: item.id, className: 'odd:bg-blue-50' },
            React.createElement('td', { className: 'p-2 border-b border-gray-200 font-bold text-gray-800' }, item.display),
            React.createElement('td', { className: 'p-2 border-b border-gray-200 font-mono text-blue-700' }, `${item.value * 100}%`),
          ),
        ),
      ),
    ),
    React.createElement('p', { className: 'mt-3 font-semibold text-gray-800' }, 'Now you can easily see the correct order from smallest to largest.'),
  );
};


// --- Conversion Data ---

const conversionValues = [
    // Core fractions < 100%
    { n: 1, d: 2 }, { n: 1, d: 4 }, { n: 3, d: 4 }, { n: 1, d: 5 }, { n: 2, d: 5 },
    { n: 3, d: 5 }, { n: 4, d: 5 }, { n: 1, d: 10 }, { n: 3, d: 10 }, { n: 7, d: 10 }, { n: 9, d: 10 },
    // Twentieths
    { n: 1, d: 20 }, { n: 3, d: 20 }, { n: 7, d: 20 }, { n: 9, d: 20 }, { n: 11, d: 20 },
    { n: 13, d: 20 }, { n: 17, d: 20 }, { n: 19, d: 20 },
    // Twenty-fifths
    { n: 1, d: 25 }, { n: 2, d: 25 }, { n: 4, d: 25 }, { n: 6, d: 25 },
    // Fiftieths
    { n: 1, d: 50 },
    
    // Core fractions > 100% and <= 200%
    { n: 3, d: 2 }, { n: 5, d: 4 }, { n: 7, d: 4 }, { n: 6, d: 5 }, { n: 7, d: 5 },
    { n: 8, d: 5 }, { n: 9, d: 5 }, { n: 11, d: 10 }, { n: 13, d: 10 }, { n: 17, d: 10 }, { n: 19, d: 10 },
    // Exactly 200%
    { n: 2, d: 1 }
].map(f => ({
    fraction: { numerator: f.n, denominator: f.d },
    decimal: f.n / f.d,
    percentage: (f.n / f.d) * 100
}));

// --- BEDMAS Question Generator ---
const generateBedmasQuestion = (): BedmasQuestion | null => {
    let attempts = 0;
    while (attempts < 50) {
        attempts++;
        const equation = buildRandomEquation();
        const steps = solveEquation(equation);
        if (steps) {
            return {
                initialEquation: equation,
                steps,
            };
        }
    }
    console.error("Failed to generate a valid BEDMAS question after 50 attempts.");
    // Fallback to a simple, guaranteed valid question
    const fallbackInitialEquation: EquationToken[] = [{type: 'number', value: 2}, {type: 'operator', value: '+'}, {type: 'number', value: 3}, {type: 'operator', value: '*'}, {type: 'number', value: 4}];
    const fallbackStep2Equation: EquationToken[] = [{type: 'number', value: 2}, {type: 'operator', value: '+'}, {type: 'number', value: 12}];
    return {
        initialEquation: fallbackInitialEquation,
        steps: [
            { equation: fallbackInitialEquation, startIndex: 2, endIndex: 4, answer: 12, explanation: 'Multiplication' },
            { equation: fallbackStep2Equation, startIndex: 0, endIndex: 2, answer: 14, explanation: 'Addition' }
        ]
    };
};

const buildRandomEquation = (): EquationToken[] => {
    const templates = [
        (): EquationToken[] => { // a + b * c
            const a = Math.floor(Math.random() * 10) + 1;
            const b = Math.floor(Math.random() * 10) + 1;
            const c = Math.floor(Math.random() * 10) + 1;
            return [{type: 'number', value: a}, {type: 'operator', value: '+'}, {type: 'number', value: b}, {type: 'operator', value: '*'}, {type: 'number', value: c}];
        },
        (): EquationToken[] => { // a * (b + c)
            const a = Math.floor(Math.random() * 5) + 2;
            const b = Math.floor(Math.random() * 10) + 1;
            const c = Math.floor(Math.random() * 10) + 1;
            return [{type: 'number', value: a}, {type: 'operator', value: '*', isImplied: true}, {type: 'bracket', value: '('}, {type: 'number', value: b}, {type: 'operator', value: '+'}, {type: 'number', value: c}, {type: 'bracket', value: ')'}];
        },
        (): EquationToken[] => { // (a+b)^2
            const a = Math.floor(Math.random() * 5) + 1;
            const b = Math.floor(Math.random() * 5) + 1;
            return [{type: 'bracket', value: '('}, {type: 'number', value: a}, {type: 'operator', value: '+'}, {type: 'number', value: b}, {type: 'bracket', value: ')'}, {type: 'operator', value: '^'}, {type: 'number', value: 2}];
        },
        (): EquationToken[] => { // a*b - c
             const a = Math.floor(Math.random() * 10) + 2;
             const b = Math.floor(Math.random() * 10) + 2;
             const c = Math.floor(Math.random() * (a*b -1)) + 1;
             return [{type: 'number', value: a}, {type: 'operator', value: '*'}, {type: 'number', value: b}, {type: 'operator', value: '-'}, {type: 'number', value: c}];
        },
        (): EquationToken[] => { // a * b / c
             const c = Math.floor(Math.random() * 5) + 2;
             const b = Math.floor(Math.random() * 5) + 2;
             const a = Math.floor(Math.random() * 5) + 2;
             return [{type: 'number', value: a*c}, {type: 'operator', value: '/'}, {type: 'number', value: c}, {type: 'operator', value: '*'}, {type: 'number', value: b}];
        }
    ];
    return templates[Math.floor(Math.random() * templates.length)]();
};

const solveEquation = (initialEquation: EquationToken[]): BedmasStep[] | null => {
    const steps: BedmasStep[] = [];
    let currentEq = JSON.parse(JSON.stringify(initialEquation));

    while (currentEq.length > 1) {
        let bracketStartIndex = -1, bracketEndIndex = -1;
        let openBracketIndex = -1;
        for (let i = 0; i < currentEq.length; i++) {
            if (currentEq[i].value === '(') openBracketIndex = i;
            if (currentEq[i].value === ')') {
                bracketStartIndex = openBracketIndex;
                bracketEndIndex = i;
                break;
            }
        }

        const searchStart = bracketStartIndex !== -1 ? bracketStartIndex + 1 : 0;
        const searchEnd = bracketEndIndex !== -1 ? bracketEndIndex : currentEq.length;
        
        let opIndex = -1;
        let opPrecedence = -1; // B=3, E=2, MD=1, AS=0

        // Find Exponents
        for (let i = searchStart; i < searchEnd; i++) {
            if (currentEq[i].value === '^') {
                opIndex = i;
                opPrecedence = 2;
                break;
            }
        }

        // Find Division/Multiplication
        if (opPrecedence < 2) {
            for (let i = searchStart; i < searchEnd; i++) {
                if (currentEq[i].value === '*' || currentEq[i].value === '/') {
                    opIndex = i;
                    opPrecedence = 1;
                    break;
                }
            }
        }
        
        // Find Addition/Subtraction
        if (opPrecedence < 1) {
            for (let i = searchStart; i < searchEnd; i++) {
                if (currentEq[i].value === '+' || currentEq[i].value === '-') {
                    opIndex = i;
                    opPrecedence = 0;
                    break;
                }
            }
        }
        
        if (opIndex === -1) {
            if (bracketStartIndex !== -1 && bracketEndIndex !== -1 && bracketEndIndex === bracketStartIndex + 2) {
                // We have solved everything inside the brackets, now remove them.
                const numberToken = currentEq[bracketStartIndex + 1];
                currentEq.splice(bracketStartIndex, 3, numberToken);

                // Check for implied multiplication and make it explicit
                if (bracketStartIndex > 0 && currentEq[bracketStartIndex - 1]?.isImplied) {
                    currentEq[bracketStartIndex - 1].isImplied = false;
                }
                if (currentEq[bracketStartIndex]?.isImplied){
                    currentEq[bracketStartIndex].isImplied = false;
                }
                continue;
            } else {
                return null; // Invalid state
            }
        }

        const left = currentEq[opIndex - 1].value as number;
        const right = currentEq[opIndex + 1].value as number;
        const op = currentEq[opIndex].value as string;
        let result: number;

        switch (op) {
            case '+': result = left + right; break;
            case '-': result = left - right; break;
            case '*': result = left * right; break;
            case '/': result = left / right; break;
            case '^': result = Math.pow(left, right); break;
            default: return null;
        }

        if (result < 0 || !Number.isInteger(result)) {
            return null; // Invalid result, abort generation
        }
        
        const explanationMap = {
            '(': 'Brackets', '^': 'Exponents', '*': 'Multiplication', '/': 'Division',
            '+': 'Addition', '-': 'Subtraction',
        };
        const opType = bracketStartIndex !== -1 ? '(' : op;

        steps.push({
            equation: JSON.parse(JSON.stringify(currentEq)),
            startIndex: opIndex - 1,
            endIndex: opIndex + 1,
            answer: result,
            explanation: `${explanationMap[opType]}: ${left} ${op === '*' ? '×' : op === '/' ? '÷' : op} ${right}`
        });

        currentEq.splice(opIndex - 1, 3, { type: 'number', value: result });
    }

    return steps.length > 0 ? steps : null;
};


// --- Public Question Generator ---

export const generateQuestion = (mode: GameMode): Question => {
  const id = `${Date.now()}-${Math.random()}`;

  // BEDMAS
  if (mode === GameMode.BEDMAS) {
      const bedmasQuestion = generateBedmasQuestion();
      if (!bedmasQuestion) throw new Error("Could not generate BEDMAS question");
      return {
          id,
          text: 'Solve the equation step-by-step.',
          answer: bedmasQuestion,
          type: mode
      };
  }

  // Powers & Roots
  if (mode === GameMode.SQUARES) {
    const n = Math.floor(Math.random() * SQUARES_MAX) + 1;
    return { id, text: React.createElement(React.Fragment, null, n, React.createElement('sup', null, '2')), answer: n * n, type: mode };
  }
  if (mode === GameMode.CUBES) {
    const n = Math.floor(Math.random() * CUBES_MAX) + 1;
    return { id, text: React.createElement(React.Fragment, null, n, React.createElement('sup', null, '3')), answer: n * n * n, type: mode };
  }
  if (mode === GameMode.SQUARE_ROOTS) {
    const n = Math.floor(Math.random() * SQUARE_ROOTS_MAX) + 1;
    return { id, text: React.createElement(React.Fragment, null, `√${n * n}`), answer: n, type: mode };
  }

  // Rounding Whole Numbers
  if (mode === GameMode.ROUND_TENS) {
    const num = Math.floor(100000 + Math.random() * 900000);
    const answer = Math.round(num / 10) * 10;
    const decidingDigit = num % 10;
    const explanation = generateRoundingExplanation(num, answer, 'ten', decidingDigit, num.toString().length - 1);
    return { id, text: React.createElement(React.Fragment, null, 'Round ', React.createElement('strong', null, formatNumber(num)), ' to the nearest 10'), answer, type: mode, explanation };
  }
  if (mode === GameMode.ROUND_HUNDREDS) {
    const num = Math.floor(100000 + Math.random() * 900000);
    const answer = Math.round(num / 100) * 100;
    const decidingDigit = Math.floor((num % 100) / 10);
    const explanation = generateRoundingExplanation(num, answer, 'hundred', decidingDigit, num.toString().length - 2);
    return { id, text: React.createElement(React.Fragment, null, 'Round ', React.createElement('strong', null, formatNumber(num)), ' to the nearest 100'), answer, type: mode, explanation };
  }
  if (mode === GameMode.ROUND_THOUSANDS) {
    const num = Math.floor(100000 + Math.random() * 900000);
    const answer = Math.round(num / 1000) * 1000;
    const decidingDigit = Math.floor((num % 1000) / 100);
    const explanation = generateRoundingExplanation(num, answer, 'thousand', decidingDigit, num.toString().length - 3);
    return { id, text: React.createElement(React.Fragment, null, 'Round ', React.createElement('strong', null, formatNumber(num)), ' to the nearest 1,000'), answer, type: mode, explanation };
  }
  if (mode === GameMode.ROUND_TEN_THOUSANDS) {
    const num = Math.floor(100000 + Math.random() * 900000);
    const answer = Math.round(num / 10000) * 10000;
    const decidingDigit = Math.floor((num % 10000) / 1000);
    const explanation = generateRoundingExplanation(num, answer, 'ten thousand', decidingDigit, num.toString().length - 4);
    return { id, text: React.createElement(React.Fragment, null, 'Round ', React.createElement('strong', null, formatNumber(num)), ' to the nearest 10,000'), answer, type: mode, explanation };
  }
  if (mode === GameMode.ROUND_HUNDRED_THOUSANDS) {
    const num = Math.floor(100000 + Math.random() * 900000);
    const answer = Math.round(num / 100000) * 100000;
    const decidingDigit = Math.floor((num % 100000) / 10000);
    const explanation = generateRoundingExplanation(num, answer, 'hundred thousand', decidingDigit, num.toString().length - 5);
    return { id, text: React.createElement(React.Fragment, null, 'Round ', React.createElement('strong', null, formatNumber(num)), ' to the nearest 100,000'), answer, type: mode, explanation };
  }
  
  // Rounding Decimals
  if (mode === GameMode.ROUND_TENTHS) {
    const num = parseFloat((Math.random() * 99 + 1).toFixed(2));
    const answer = parseFloat((Math.round(num * 10) / 10).toFixed(1));
    const decidingDigit = Math.floor((num * 100) % 10);
    const explanation = generateRoundingExplanation(num, answer, 'tenth', decidingDigit, num.toString().indexOf('.') + 2);
    return { id, text: React.createElement(React.Fragment, null, 'Round ', React.createElement('strong', null, num), ' to the nearest tenth'), answer, type: mode, explanation };
  }
  if (mode === GameMode.ROUND_HUNDREDTHS) {
    const num = parseFloat((Math.random() * 99 + 1).toFixed(3));
    const answer = parseFloat((Math.round(num * 100) / 100).toFixed(2));
    const decidingDigit = Math.floor((num * 1000) % 10);
    const explanation = generateRoundingExplanation(num, answer, 'hundredth', decidingDigit, num.toString().indexOf('.') + 3);
    return { id, text: React.createElement(React.Fragment, null, 'Round ', React.createElement('strong', null, num), ' to the nearest hundredth'), answer, type: mode, explanation };
  }
  if (mode === GameMode.ROUND_THOUSANDTHS) {
    const num = parseFloat((Math.random() * 99 + 1).toFixed(4));
    const answer = parseFloat((Math.round(num * 1000) / 1000).toFixed(3));
    const decidingDigit = Math.floor((num * 10000) % 10);
    const explanation = generateRoundingExplanation(num, answer, 'thousandth', decidingDigit, num.toString().indexOf('.') + 4);
    return { id, text: React.createElement(React.Fragment, null, 'Round ', React.createElement('strong', null, num), ' to the nearest thousandth'), answer, type: mode, explanation };
  }
  
  // Simplifying Fractions
  if (mode === GameMode.SIMPLIFY_FRACTIONS) {
    const simpleFractions = [
      // Denominator <= 12
      { n: 1, d: 2 }, { n: 1, d: 3 }, { n: 2, d: 3 }, { n: 1, d: 4 }, { n: 3, d: 4 },
      { n: 1, d: 5 }, { n: 2, d: 5 }, { n: 3, d: 5 }, { n: 4, d: 5 }, { n: 1, d: 6 },
      { n: 5, d: 6 }, { n: 1, d: 7 }, { n: 2, d: 7 }, { n: 3, d: 7 }, { n: 4, d: 7 },
      { n: 5, d: 7 }, { n: 6, d: 7 }, { n: 1, d: 8 }, { n: 3, d: 8 }, { n: 5, d: 8 },
      { n: 7, d: 8 }, { n: 1, d: 9 }, { n: 2, d: 9 }, { n: 4, d: 9 }, { n: 5, d: 9 },
      { n: 7, d: 9 }, { n: 8, d: 9 }, { n: 1, d: 10 }, { n: 3, d: 10 }, { n: 7, d: 10 },
      { n: 9, d: 10 }, { n: 1, d: 11 }, { n: 2, d: 11 }, { n: 3, d: 11 }, { n: 4, d: 11 },
      { n: 5, d: 11 }, { n: 6, d: 11 }, { n: 7, d: 11 }, { n: 8, d: 11 }, { n: 9, d: 11 },
      { n: 10, d: 11 }, { n: 1, d: 12 }, { n: 5, d: 12 }, { n: 7, d: 12 }, { n: 11, d: 12 },
    ];
    const base = simpleFractions[Math.floor(Math.random() * simpleFractions.length)];
    const maxMultiplier = Math.floor(100 / base.d);
    if (maxMultiplier < 2) return generateQuestion(mode); 
    const multiplier = Math.floor(Math.random() * (maxMultiplier - 1)) + 2;
    const numerator = base.n * multiplier;
    const denominator = base.d * multiplier;
    const answer: FractionAnswer = { numerator: base.n, denominator: base.d };
    const text = React.createElement('div', { className: 'flex flex-col items-center' }, 'Simplify:', React.createElement('div', { className: 'flex items-center flex-col font-mono text-6xl mt-2' }, React.createElement('span', { className: 'border-b-4 border-gray-800 px-4' }, numerator), React.createElement('span', { className: 'px-4' }, denominator)));
    const divisor = hcf(numerator, denominator);
    const explanation = generateFractionExplanation(numerator, denominator, divisor);
    return { id, text, answer, type: mode, explanation };
  }

  // --- Conversions ---
  if (mode.toString().startsWith('CONVERT_')) {
      const value = conversionValues[Math.floor(Math.random() * conversionValues.length)];

      if (mode === GameMode.CONVERT_FRACTIONS) {
        const { fraction, decimal, percentage } = value;
        const { numerator: n, denominator: d } = fraction;
        let fractionText: React.ReactNode;
        if (n > d && n % d !== 0 && Math.random() < 0.5) {
            const whole = Math.floor(n / d);
            const remN = n % d;
            fractionText = React.createElement('div', { className: 'flex items-center font-mono text-6xl mt-2' }, whole, React.createElement('div', { className: 'flex flex-col text-4xl ml-2' }, React.createElement('span', { className: 'border-b-2 border-gray-800 px-2' }, remN), React.createElement('span', { className: 'px-2' }, d)));
        } else {
            fractionText = React.createElement('div', { className: 'flex items-center flex-col font-mono text-6xl mt-2' }, React.createElement('span', { className: 'border-b-4 border-gray-800 px-4' }, n), React.createElement('span', { className: 'px-4' }, d));
        }
        const text = React.createElement('div', { className: 'flex flex-col items-center' }, 'Convert the fraction:', fractionText);
        const answer: ConversionAnswer = { decimal, percentage };
        const explanation = React.createElement('div', {className: 'space-y-4'}, F_TO_D_EXPLANATION(n, d, decimal), D_TO_P_EXPLANATION(decimal, percentage));
        return { id, text, answer, type: mode, explanation };
      }

      if (mode === GameMode.CONVERT_DECIMALS) {
        const { fraction, decimal, percentage } = value;
        const text = React.createElement('div', { className: 'flex flex-col items-center' }, 'Convert the decimal:', React.createElement('div', { className: 'font-mono text-6xl mt-2' }, decimal));
        const answer: ConversionAnswer = { fraction, percentage };
        const explanation = React.createElement('div', {className: 'space-y-4'}, D_TO_F_EXPLANATION(decimal, fraction.numerator, fraction.denominator), D_TO_P_EXPLANATION(decimal, percentage));
        return { id, text, answer, type: mode, explanation };
      }

      if (mode === GameMode.CONVERT_PERCENTAGES) {
        const { fraction, decimal, percentage } = value;
        const text = React.createElement('div', { className: 'flex flex-col items-center' }, 'Convert the percentage:', React.createElement('div', { className: 'font-mono text-6xl mt-2' }, `${percentage}%`));
        const answer: ConversionAnswer = { fraction, decimal };
        const explanation = React.createElement('div', {className: 'space-y-4'}, P_TO_D_EXPLANATION(percentage, decimal), D_TO_F_EXPLANATION(decimal, fraction.numerator, fraction.denominator));
        return { id, text, answer, type: mode, explanation };
      }
  }

  // --- Ordering FDP ---
  if (mode === GameMode.ORDERING_FDP) {
    const text = 'Order the following from smallest to largest.';
    const selectedValues = shuffleArray([...conversionValues]).slice(0, 5);
    
    const items: FDPValue[] = selectedValues.map((val, index) => {
        const randomType = Math.floor(Math.random() * 3);
        const uniqueId = `${id}-item-${index}`;
        switch(randomType) {
            case 0: // Fraction
                const { numerator: n, denominator: d } = val.fraction;
                let display: React.ReactNode;
                if (n > d && n % d !== 0 && Math.random() < 0.5) { // Mixed number
                    const whole = Math.floor(n / d);
                    const remN = n % d;
                    display = React.createElement('div', { className: 'flex items-center' }, whole, React.createElement('div', { className: 'flex flex-col text-sm ml-1' }, React.createElement('span', { className: 'border-b border-gray-800 px-1' }, remN), React.createElement('span', { className: 'px-1' }, d)));
                } else { // Improper/proper fraction
                    display = React.createElement('div', { className: 'flex flex-col items-center' }, React.createElement('span', { className: 'border-b-2 border-gray-800 px-2' }, n), React.createElement('span', { className: 'px-2' }, d));
                }
                return { id: uniqueId, type: 'fraction', value: val.decimal, display };
            case 1: // Decimal
                return { id: uniqueId, type: 'decimal', value: val.decimal, display: val.decimal.toString() };
            case 2: // Percentage
            default:
                return { id: uniqueId, type: 'percentage', value: val.decimal, display: `${val.percentage}%` };
        }
    });

    const answer = [...items].sort((a, b) => a.value - b.value);
    const explanation = generateOrderingExplanation(answer);

    return { id, text, items: shuffleArray(items), answer, type: mode, explanation };
  }

  throw new Error('Invalid game mode');
};

const WHOLE_NUMBER_ROUNDING_MODES: GameMode[] = [GameMode.ROUND_TENS, GameMode.ROUND_HUNDREDS, GameMode.ROUND_THOUSANDS, GameMode.ROUND_TEN_THOUSANDS, GameMode.ROUND_HUNDRED_THOUSANDS];
const DECIMAL_ROUNDING_MODES: GameMode[] = [GameMode.ROUND_TENTHS, GameMode.ROUND_HUNDREDTHS, GameMode.ROUND_THOUSANDTHS];

export const generateSkillCheckQuestions = (type: SkillCheckType): Question[] => {
    let questions: Question[] = [];
    if (type === 'whole_numbers') {
        WHOLE_NUMBER_ROUNDING_MODES.forEach(mode => { for (let i = 0; i < 3; i++) questions.push(generateQuestion(mode)); });
    } else if (type === 'decimals') {
        DECIMAL_ROUNDING_MODES.forEach(mode => { for (let i = 0; i < 5; i++) questions.push(generateQuestion(mode)); });
    }
    return shuffleArray(questions).slice(0, 10);
};

export const generateConversionSkillCheckQuestions = (type: SkillCheckType): Question[] => {
    let questions: Question[] = [];
    const shuffledValues = shuffleArray([...conversionValues]);

    for(let i = 0; i < 10; i++) {
        const value = shuffledValues[i % shuffledValues.length];
        const id = `${Date.now()}-${Math.random()}-${i}`;
        const toDecimal = Math.random() < 0.5; // 50/50 chance to convert to decimal or the other type

        if (type === 'convert_fractions') {
            const { fraction, decimal, percentage } = value;
            const text = `Convert ${fraction.numerator}/${fraction.denominator} to a ${toDecimal ? 'decimal' : 'percentage'}.`;
            const answer = toDecimal ? decimal : percentage;
            const skillCheckSubType = toDecimal ? 'Fraction to Decimal' : 'Fraction to Percentage';
            questions.push({ id, text, answer, type: GameMode.CONVERT_FRACTIONS, skillCheckSubType });
        } else if (type === 'convert_decimals') {
            const { fraction, decimal, percentage } = value;
            const text = `Convert ${decimal} to a ${toDecimal ? 'fraction' : 'percentage'}.`;
            const answer = toDecimal ? fraction : percentage;
            const skillCheckSubType = toDecimal ? 'Decimal to Fraction' : 'Decimal to Percentage';
            questions.push({ id, text, answer, type: GameMode.CONVERT_DECIMALS, skillCheckSubType });
        } else if (type === 'convert_percentages') {
            const { fraction, decimal, percentage } = value;
            const text = `Convert ${percentage}% to a ${toDecimal ? 'fraction' : 'decimal'}.`;
            const answer = toDecimal ? fraction : decimal;
            const skillCheckSubType = toDecimal ? 'Percentage to Fraction' : 'Percentage to Decimal';
            questions.push({ id, text, answer, type: GameMode.CONVERT_PERCENTAGES, skillCheckSubType });
        }
    }
    return questions;
};

export const generateRandomConversionQuestionForChallenge = (): Question => {
    const value = conversionValues[Math.floor(Math.random() * conversionValues.length)];
    const id = `${Date.now()}-${Math.random()}`;
    const questionType = Math.floor(Math.random() * 6); // 6 possible conversion types

    const { fraction, decimal, percentage } = value;
    let text: string | React.ReactNode;
    let answer: number | FractionAnswer;
    let type: GameMode;

    switch (questionType) {
        // F -> D
        case 0:
            text = `Convert ${fraction.numerator}/${fraction.denominator} to a decimal.`;
            answer = decimal;
            type = GameMode.CONVERT_FRACTIONS;
            break;
        // F -> P
        case 1:
            text = `Convert ${fraction.numerator}/${fraction.denominator} to a percentage.`;
            answer = percentage;
            type = GameMode.CONVERT_FRACTIONS;
            break;
        // D -> F
        case 2:
            text = `Convert ${decimal} to a fraction.`;
            answer = fraction;
            type = GameMode.CONVERT_DECIMALS;
            break;
        // D -> P
        case 3:
            text = `Convert ${decimal} to a percentage.`;
            answer = percentage;
            type = GameMode.CONVERT_DECIMALS;
            break;
        // P -> F
        case 4:
            text = `Convert ${percentage}% to a fraction.`;
            answer = fraction;
            type = GameMode.CONVERT_PERCENTAGES;
            break;
        // P -> D
        case 5:
        default:
            text = `Convert ${percentage}% to a decimal.`;
            answer = decimal;
            type = GameMode.CONVERT_PERCENTAGES;
            break;
    }
    return { id, text, answer, type };
};

export const generateBedmasChallengeQuestion = (): Question => {
    const id = `${Date.now()}-${Math.random()}`;
    const bedmasQuestion = generateBedmasQuestion();
    if (!bedmasQuestion) throw new Error("Could not generate BEDMAS question for challenge");

    const finalAnswer = bedmasQuestion.steps[bedmasQuestion.steps.length - 1].answer;
    
    const renderToken = (token: EquationToken, nextToken?: EquationToken) => {
        if (token.isImplied) return null;
        if (token.type === 'operator' && token.value === '*') return ' × ';
        if (token.type === 'operator' && token.value === '/') return ' ÷ ';
        if (token.type === 'operator' && token.value === '^' && nextToken?.type === 'number') {
            return React.createElement('sup', null, nextToken.value);
        }
        return token.value.toString();
    };

    const text = React.createElement(
        'div',
        { className: 'flex justify-center items-center font-mono' },
        bedmasQuestion.initialEquation.map((token, index) => {
            const nextToken = bedmasQuestion.initialEquation[index + 1];
            if (index > 0 && bedmasQuestion.initialEquation[index - 1]?.value === '^') return null;
            if (token.isImplied) return null;
            return React.createElement('span', { key: index }, renderToken(token, nextToken));
        })
    );

    return {
        id,
        text: text,
        answer: finalAnswer,
        type: GameMode.BEDMAS,
    };
};