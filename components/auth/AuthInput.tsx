
import React, { useState } from 'react';
import { LucideIcon, Eye, EyeOff } from 'lucide-react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
}

const AuthInput: React.FC<AuthInputProps> = ({ label, icon: Icon, type, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="space-y-3 w-full">
      <label className="text-sm font-bold text-gray-900 ml-1">
        {label}
      </label>
      <div className="relative group">
        <Icon className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-300 group-focus-within:text-eln-primary transition-colors" />
        <input
          {...props}
          type={inputType}
          className={`w-full pl-16 ${isPassword ? 'pr-16' : 'pr-6'} py-5 bg-gray-50 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-eln-primary focus:bg-white transition-all font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-medium`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-5 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-eln-primary transition-all"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthInput;
