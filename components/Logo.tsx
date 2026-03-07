
import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'white' | 'primary';
}

const Logo: React.FC<LogoProps> = ({ 
  className = "h-8", 
  showText = true, 
  variant = 'primary' 
}) => {
  const color = variant === 'white' ? '#FFFFFF' : '#FF7A00';
  
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="relative h-full aspect-square">
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          <rect x="10" y="10" width="80" height="80" rx="24" fill={color} />
          <path 
            d="M30 50L45 65L70 35" 
            stroke={variant === 'white' ? '#FF7A00' : 'white'} 
            strokeWidth="12" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`text-xl font-black tracking-tight ${variant === 'white' ? 'text-white' : 'text-eln-text'}`}>
            ELN<span className="text-eln-primary">Express</span>
          </span>
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${variant === 'white' ? 'text-white/60' : 'text-gray-400'}`}>
            Logistics
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
