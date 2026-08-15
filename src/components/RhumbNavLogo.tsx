import React from 'react';

interface Props {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
}

export default function RhumbNavLogo({ className = "", showText = true, size = 'md' }: Props) {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-9 h-9 md:w-10 md:h-10',
    lg: 'w-12 h-12 md:w-14 md:h-14',
    xl: 'w-16 h-16 md:w-20 md:h-20',
    hero: 'w-20 h-20 md:w-28 md:h-28'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl md:text-3xl',
    lg: 'text-3xl md:text-4xl',
    xl: 'text-4xl md:text-5xl',
    hero: 'text-5xl md:text-7xl'
  };

  return (
    <div className={`inline-flex items-center gap-3 md:gap-4 select-none ${className}`}>
      {/* Aviation Directional Vector Icon */}
      <div className={`relative flex-shrink-0 flex items-center justify-center ${iconSizes[size]}`}>
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_12px_rgba(6,182,212,0.4)]"
        >
          <defs>
            <linearGradient id="rnGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="rnGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
          
          {/* Compass / Navigation Ring */}
          <circle cx="50" cy="50" r="44" stroke="url(#rnGrad1)" strokeWidth="4" strokeDasharray="6 3" className="opacity-40" />
          <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="2" className="text-text-primary opacity-20" />
          
          {/* 4 Cardinal tick marks */}
          <line x1="50" y1="2" x2="50" y2="10" stroke="url(#rnGrad1)" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="50" y1="90" x2="50" y2="98" stroke="url(#rnGrad1)" strokeWidth="3" strokeLinecap="round" className="opacity-60" />
          <line x1="2" y1="50" x2="10" y2="50" stroke="url(#rnGrad1)" strokeWidth="3" strokeLinecap="round" className="opacity-60" />
          <line x1="90" y1="50" x2="98" y2="50" stroke="url(#rnGrad1)" strokeWidth="3" strokeLinecap="round" className="opacity-60" />
          
          {/* Aircraft / Rhumb Navigation Arrow */}
          <path 
            d="M50 16L76 78L50 64L24 78L50 16Z" 
            fill="url(#rnGrad1)" 
          />
          <path 
            d="M50 16L50 64L24 78L50 16Z" 
            fill="url(#rnGrad2)" 
            fillOpacity="0.8"
          />
          
          {/* Core Horizon / Beacon Indicator */}
          <circle cx="50" cy="50" r="5" fill="#ffffff" className="drop-shadow-[0_0_6px_#38bdf8]" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className={`font-bold tracking-tight text-text-primary flex items-baseline ${textSizes[size]}`}>
            <span>Rhumb</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-extrabold ml-0.5">
              Nav
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
