
import React from 'react';
import { Store, Bike } from 'lucide-react';
import { UserRole } from '../../types';
import { useLanguage } from '../../src/contexts/LanguageContext';

interface RoleToggleProps {
  activeRole: UserRole;
  onChange: (role: UserRole) => void;
}

const RoleToggle: React.FC<RoleToggleProps> = ({ activeRole, onChange }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-gray-100 p-2 rounded-full flex items-center space-x-1">
      <button 
        type="button"
        onClick={() => onChange(UserRole.MERCHANT)}
        className={`flex-1 py-4 px-6 rounded-full font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2 ${
          activeRole === UserRole.MERCHANT ? 'bg-white text-eln shadow-lg' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <Store className="h-5 w-5" />
        <span>{t.auth.merchant}</span>
      </button>
      <button 
        type="button"
        onClick={() => onChange(UserRole.RIDER)}
        className={`flex-1 py-4 px-6 rounded-full font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2 ${
          activeRole === UserRole.RIDER ? 'bg-white text-eln shadow-lg' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <Bike className="h-5 w-5" />
        <span>{t.auth.rider}</span>
      </button>
    </div>
  );
};

export default RoleToggle;
