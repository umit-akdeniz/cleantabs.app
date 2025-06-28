import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Logo({ size = 'md', showText = true, className = '', onClick }: LogoProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 hover:opacity-80 transition-opacity duration-200 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Minimalist 3-Panel Logo */}
      <div className="relative">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg">
          <div className="relative">
            {/* Three vertical panels representing the 3-panel layout */}
            <div className="flex gap-0.5">
              <div className="w-1.5 h-4 bg-white rounded-full opacity-90"></div>
              <div className="w-1.5 h-4 bg-white rounded-full opacity-70"></div>
              <div className="w-1.5 h-4 bg-white rounded-full opacity-50"></div>
            </div>
          </div>
        </div>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizeClasses[size]} font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight`}>
            CleanTabs
          </h1>
          {size === 'xl' && (
            <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1">
              Organize • Simplify • Flow
            </p>
          )}
        </div>
      )}
    </button>
  );
}