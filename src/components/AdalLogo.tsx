import React from 'react';

interface AdalLogoProps {
  className?: string;
  variant?: 'full' | 'horizontal' | 'icon' | 'stacked';
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Official Adal Energies Logo
 * High-fidelity vector recreation of the corporate emblem and wordmark:
 * - Tri-color geometric 'A' emblem (Navy Blue, Leaf Green, Vibrant Orange)
 * - ADAL uppercase bold geometric typography
 * - ENERGIES tracked green uppercase
 * - TOWARDS CLEAN ENERGY sub-motto
 */
export const AdalLogo: React.FC<AdalLogoProps> = ({
  className = '',
  variant = 'horizontal',
  theme = 'light',
  size = 'md',
}) => {
  // Brand color constants matching the official corporate identity
  const NAVY = theme === 'dark' ? '#38bdf8' : '#0B2953';
  const NAVY_DARK_BG = '#FFFFFF';
  const GREEN = '#2BA829';
  const ORANGE = '#F58220';

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  // Pure SVG Emblem icon (The Geometric 'A')
  const EmblemIcon = ({ iconClass = '' }: { iconClass?: string }) => (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${iconClass} select-none shrink-0 drop-shadow-sm`}
      aria-label="Adal Energies Emblem"
    >
      {/* 1. Left Navy Blue diagonal stroke & base */}
      <path
        d="M20 84C17.79 84 16 82.21 16 80V77C16 75.3 16.92 73.74 18.39 72.92L48.8 55.8C50.28 54.98 52.12 55.1 53.47 56.12L54.2 56.66C55.78 57.85 55.97 60.15 54.6 61.57L31.8 83.2C30.9 83.71 29.87 84 28.8 84H20Z"
        fill="#071E3D"
        opacity="0.2"
      />
      {/* Main Navy Left Wing */}
      <path
        d="M22 84H34C36.2 84 38.3 82.9 39.5 81.1L57.5 53.5C58.8 51.5 58.2 48.8 56.2 47.5L54.8 46.5C52.8 45.2 50.1 45.8 48.8 47.8L21.5 75.2C20.5 76.2 20 77.5 20 78.9V82C20 83.1 20.9 84 22 84Z"
        fill="#0B2B56"
      />
      <path
        d="M21 78.5L52.8 26.2C54.6 23.2 58.7 22.8 61.1 25.4L64 28.6C65.5 30.2 65.6 32.7 64.2 34.5L34.5 81.2C33.2 83.2 30.8 84 28.4 83.4L22.5 81.8C20.8 81.3 19.9 79.5 20.5 77.8C20.6 77.5 20.8 77.2 21 78.5Z"
        fill={theme === 'dark' ? '#38BDF8' : '#0B2953'}
      />
      {/* Left Navy Leg solid accurate contour */}
      <path
        d="M22 80L50.5 29C52.4 25.6 56.8 24.8 59.8 27.2L62.2 29.2C64.2 30.8 64.8 33.7 63.5 36L35.2 80.5C33.8 82.7 31.4 84 28.8 84H22C20.3 84 19.2 82.2 20 80.7L22 80Z"
        fill="#0B2953"
      />

      {/* 2. Right Green diagonal stroke & base */}
      <path
        d="M59.5 27.5L88.5 74.8C89.8 76.9 89.6 79.6 88 81.5L85.2 84.8C83.7 86.6 81.1 87.2 78.9 86.2L76.5 85.1C74.2 84 72.8 81.7 72.8 79.2V78C72.8 76.5 73.4 75.1 74.5 74L77.2 71.3C78.5 70 78.5 67.8 77.2 66.5L62.8 32.5C61.8 30.1 62.9 27.4 65.3 26.4L66 26.1C67.5 25.5 69.2 26.1 70.1 27.5L59.5 27.5Z"
        fill={GREEN}
        opacity="0.1"
      />
      <path
        d="M62 26C64.2 24.2 67.4 24.5 69.2 26.7L97.5 67.8C99.2 70.3 98.8 73.7 96.5 75.7L88.2 82.8C86.4 84.4 83.7 84.6 81.6 83.3L77.5 80.8C75.3 79.4 74 77 74 74.4V72.5C74 70.8 74.8 69.2 76.1 68.2L85 61.2C86.6 59.9 87 57.6 85.8 55.9L68.5 29.8C67.2 27.9 64.6 27.2 62.5 28.3L62 26Z"
        fill="#239B2E"
      />
      {/* Precision Green Leg */}
      <path
        d="M64 26.5C65.8 24.8 68.7 25.1 70.2 27.1L98.5 66.2C100.2 68.6 99.8 72 97.6 73.9L87.5 82.5C85.5 84.2 82.6 84.3 80.4 82.8L76.2 80C74.2 78.6 73 76.3 73 73.8V71C73 69.3 73.8 67.8 75.2 66.8L84.8 59.8C86.4 58.6 86.8 56.3 85.7 54.6L68.8 29.8C67.7 28.2 65.9 27.2 64 26.5Z"
        fill="#2BA829"
      />

      {/* 3. Center Orange Chevron / Triangle flame */}
      <path
        d="M57 41.5C58.6 39.2 62 39.2 63.6 41.5L74.8 57.8C76.6 60.4 75.1 64 71.9 64H48.7C45.5 64 44 60.4 45.8 57.8L57 41.5Z"
        fill={ORANGE}
      />
      {/* Orange extended lower accent bar */}
      <path
        d="M53.5 59H73C75.2 59 77.2 60.3 78.1 62.3L86.2 78.8C87.3 81.1 85.9 83.8 83.4 84.4L80.5 85.1C78.2 85.7 75.8 84.6 74.8 82.5L67.5 67.8C66.8 66.4 65.4 65.5 63.8 65.5H51.5C49 65.5 47.3 62.9 48.4 60.6L49.5 58.5C50.3 56.8 52 59 53.5 59Z"
        fill="#F58220"
      />
      {/* Inner upward dynamic cut-out */}
      <polygon
        points="60.3,44 51,57.5 69.6,57.5"
        fill="#FFFFFF"
        opacity="0.95"
      />
      <polygon
        points="60.3,47 53.5,57 67.1,57"
        fill={ORANGE}
      />
    </svg>
  );

  // Icon only
  if (variant === 'icon') {
    return <EmblemIcon iconClass={`${iconSizes[size]} ${className}`} />;
  }

  // Full Stacked (Emblem on top, text centered below)
  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <EmblemIcon iconClass={iconSizes[size]} />
        <div className="mt-2 flex flex-col items-center">
          <span
            className="font-display font-black text-2xl tracking-widest leading-tight"
            style={{ color: theme === 'dark' ? NAVY_DARK_BG : NAVY }}
          >
            ADAL
          </span>
          <span
            className="font-display font-extrabold text-sm tracking-[0.32em] -mt-0.5"
            style={{ color: GREEN }}
          >
            ENERGIES
          </span>
          <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-slate-400 mt-1">
            Towards Clean Energy
          </span>
        </div>
      </div>
    );
  }

  // Horizontal variant (default: Emblem left + Wordmark right)
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <EmblemIcon iconClass={iconSizes[size]} />
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline gap-1.5">
          <span
            className="font-display font-black text-xl sm:text-2xl tracking-wider leading-none"
            style={{ color: theme === 'dark' ? NAVY_DARK_BG : NAVY }}
          >
            ADAL
          </span>
          <span
            className="font-display font-black text-lg sm:text-xl tracking-widest leading-none"
            style={{ color: GREEN }}
          >
            ENERGIES
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">
            Towards Clean Energy
          </span>
          <span className="w-1 h-1 rounded-full bg-orange-500"></span>
          <span className="text-[9px] sm:text-[10px] font-semibold text-orange-600">
            Mbarara
          </span>
        </div>
      </div>
    </div>
  );
};
