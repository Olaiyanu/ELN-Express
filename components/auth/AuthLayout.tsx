
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Logo from '../Logo';
import { motion } from 'motion/react';
import { useLanguage } from '../../src/contexts/LanguageContext';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  backLink?: string;
  backText?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  subtitle, 
  backLink = "/", 
  backText = "Home" 
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:py-12 bg-white relative overflow-hidden">
      <div className="max-w-xl w-full space-y-8 relative z-10">
        {/* Back Link */}
        <Link 
          to={backLink} 
          className="inline-flex items-center text-gray-900 hover:text-eln transition-all group font-bold text-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span>{backText}</span>
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-5xl shadow-2xl shadow-gray-200/50 p-8 sm:p-16 space-y-10 border border-gray-100"
        >
          <div className="text-center space-y-6">
            <Link to="/" className="inline-flex justify-center hover:scale-105 transition-transform">
              <Logo className="h-12" showText={false} />
            </Link>
            <div className="space-y-3">
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                {title}
              </h2>
              <p className="text-gray-500 text-lg font-medium max-w-[320px] sm:max-w-none mx-auto">
                {subtitle}
              </p>
            </div>
          </div>

          {children}
        </motion.div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          {t.auth.secureAccess}
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
