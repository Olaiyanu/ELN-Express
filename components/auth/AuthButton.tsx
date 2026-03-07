
import React from 'react';
import { LucideIcon, Loader2 } from 'lucide-react';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  icon?: LucideIcon;
  children: React.ReactNode;
}

const AuthButton: React.FC<AuthButtonProps> = ({ 
  isLoading, 
  icon: Icon, 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`w-full py-6 bg-gradient-eln text-white font-black rounded-full hover:scale-[1.02] transition-all shadow-2xl shadow-eln-primary/30 flex items-center justify-center space-x-3 uppercase text-sm tracking-widest active:scale-95 disabled:opacity-50 ${className}`}
    >
      {isLoading ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : (
        <>
          <span>{children}</span>
          {Icon && <Icon className="h-5 w-5" />}
        </>
      )}
    </button>
  );
};

export default AuthButton;
