import React from 'react';

// Simplified icon set with strokeWidth={2} for consistency

export const SquareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    <text x="12" y="16" fontSize="10" fontWeight="bold" fill="currentColor" textAnchor="middle">x²</text>
  </svg>
);

export const CubeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    <text x="12" y="16" fontSize="10" fontWeight="bold" fill="currentColor" textAnchor="middle">x³</text>
  </svg>
);

export const SquareRootIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.5 L11 15 L12 10 L14 15 L15 12.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12.5 H 16" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 15 H 9" />
    </svg>
);


export const TimerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h6m6 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <style>
      {`
        @keyframes trophy-shine {
          0%, 100% { transform: scale(1) rotate(-5deg); opacity: 0.8; }
          50% { transform: scale(1.1) rotate(5deg); opacity: 1; }
        }
        .trophy-animated {
          animation: trophy-shine 2s ease-in-out infinite;
        }
      `}
    </style>
    <g className="trophy-animated">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a2.25 2.25 0 0 0 0 4.5h9a2.25 2.25 0 0 0 0-4.5ZM12 14.25V18.75M8.25 9.75h7.5V15a3 3 0 0 1-3 3h-1.5a3 3 0 0 1-3-3V9.75Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9.75H4.5a1.5 1.5 0 0 0-1.5 1.5v1.5a1.5 1.5 0 0 0 1.5 1.5H6m12 0h1.5a1.5 1.5 0 0 0 1.5-1.5v-1.5a1.5 1.5 0 0 0-1.5-1.5H18" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 6.75a1.5 1.5 0 0 1 1.5-1.5h1.5a1.5 1.5 0 0 1 1.5 1.5v3H9.75v-3Z" />
    </g>
  </svg>
);


export const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3 6-6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6m0-6l6 6" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

export const TargetIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m-9-9h2m14 0h2" />
  </svg>
);


export const BrainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        <text x="12" y="16" fontSize="10" fontWeight="bold" fill="currentColor" textAnchor="middle">xʸ</text>
    </svg>
);

export const CurveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
       <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5A9.75 9.75 0 0 1 12.75 14.25h0A9.75 9.75 0 0 1 22.5 4.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 12.75 1.5 1.5 1.5-1.5" />
    </svg>
);

export const DotIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <circle cx="12" cy="12" r="1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" fill="none" />
    </svg>
);

export const FractionIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 12h9" />
        <text x="12" y="10" fontSize="8" textAnchor="middle" fill="currentColor">a</text>
        <text x="12" y="18" fontSize="8" textAnchor="middle" fill="currentColor">b</text>
    </svg>
);