import React from 'react';

interface Props {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
}

export default function PogoLogo({ className = "", showText = true, size = 'md' }: Props) {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-9 h-9 md:w-10 md:h-10',
    lg: 'w-12 h-12 md:w-14 md:h-14',
    xl: 'w-16 h-16 md:w-20 md:h-20',
    hero: 'w-20 h-20 md:w-28 md:h-28'
  };

  const textSizes = {
    sm: 'text-xl tracking-tight',
    md: 'text-2xl md:text-3xl tracking-tight',
    lg: 'text-3xl md:text-4xl tracking-tighter',
    xl: 'text-4xl md:text-5xl tracking-tighter',
    hero: 'text-5xl md:text-7xl lg:text-8xl tracking-tighter'
  };

  return (
    <div className={`inline-flex items-center gap-3 md:gap-4 select-none ${className}`}>
      {/* Bouldering Mountain / Dynamic Hold Mark */}
      <div className={`relative flex-shrink-0 flex items-center justify-center ${iconSizes[size]}`}>
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_14px_rgba(217,70,239,0.4)]"
        >
          <defs>
            <linearGradient id="pogoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="50%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="#86198f" />
            </linearGradient>
            <linearGradient id="pogoGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a21caf" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
          </defs>
          
          {/* Dynamic climbing geometric peak & leap path */}
          <path 
            d="M50 12L88 82H68L50 48L32 82H12L50 12Z" 
            fill="url(#pogoGrad1)" 
          />
          <path 
            d="M50 12L50 48L32 82H12L50 12Z" 
            fill="url(#pogoGrad2)" 
            fillOpacity="0.85"
          />
          
          {/* Climbing hold / Boulder beacon */}
          <circle cx="50" cy="34" r="6.5" fill="#ffffff" className="drop-shadow-[0_0_8px_#f472b6]" />
          
          {/* Dynamic arc base */}
          <path 
            d="M20 88C38 94 62 94 80 88" 
            stroke="url(#pogoGrad1)" 
            strokeWidth="4" 
            strokeLinecap="round" 
          />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className={`font-black text-text-primary flex items-baseline ${textSizes[size]}`}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-500 to-fuchsia-600">
              Pogo
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
