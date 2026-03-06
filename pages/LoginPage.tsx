
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { mockDb } from '../services/mockDb';
import { User, UserRole } from '../types';
import AuthLayout from '../components/auth/AuthLayout';
import AuthInput from '../components/auth/AuthInput';
import AuthButton from '../components/auth/AuthButton';
import { useLanguage } from '../src/contexts/LanguageContext';

import { motion } from 'motion/react';

interface LoginPageProps {
  onLogin: (user: User) => void;
  isAdminOnly?: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, isAdminOnly = false }) => {
  const { t: translations } = useLanguage();
  const t = translations.auth;
  const common = translations.common;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const users = mockDb.getUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        setError('Invalid credentials');
        setIsLoading(false);
        return;
      }

      if (isAdminOnly && user.role !== UserRole.ADMIN) {
        setError('Unauthorized access');
        setIsLoading(false);
        return;
      }

      if (user.role !== UserRole.ADMIN && user.isEmailConfirmed === false) {
        setError('Please confirm your email before logging in');
        setIsLoading(false);
        return;
      }

      onLogin(user);
      
      if (user.role === UserRole.ADMIN) navigate('/admin-dashboard');
      else if (user.role === UserRole.MERCHANT) navigate('/merchant-dashboard');
      else if (user.role === UserRole.RIDER) navigate('/rider-dashboard');
      
      setIsLoading(false);
    }, 800);
  };

  return (
    <AuthLayout
      title={isAdminOnly ? t.admin : t.loginTitle}
      subtitle={isAdminOnly ? 'Secure access for logistics managers' : t.loginSubtitle}
    >
      <form onSubmit={handleLogin} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center text-sm border border-red-100 animate-in shake duration-300">
            <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
            <span className="font-bold">{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <AuthInput
            label={t.emailLabel}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="hello@eln.com"
            icon={Mail}
          />
          <AuthInput
            label={t.passwordLabel}
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            icon={Lock}
          />
        </div>

        <AuthButton type="submit" isLoading={isLoading}>
          {isAdminOnly ? 'Access Dashboard' : common.login}
        </AuthButton>
      </form>

      {!isAdminOnly && (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-500 font-medium">
              New to ELN? <Link to="/signup" className="text-eln font-black hover:underline tracking-tight">{common.signup}</Link>
            </p>
            <div className="pt-2">
              <Link 
                to="/admin-login" 
                className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] hover:text-eln transition-colors"
              >
                Admin Login
              </Link>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-100">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-50 p-5 rounded-2xl space-y-3"
            >
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{t.demoCredentials}</p>
              <div className="grid grid-cols-1 gap-2 text-[11px] font-bold text-gray-600">
                <motion.div whileHover={{ scale: 1.02 }} className="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-100">
                  <span className="text-gray-400 uppercase tracking-tighter">{t.admin}</span>
                  <span>admin@eln.com</span>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-100">
                  <span className="text-gray-400 uppercase tracking-tighter">{t.merchant}</span>
                  <span>zara@merchant.com</span>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-100">
                  <span className="text-gray-400 uppercase tracking-tighter">{t.rider}</span>
                  <span>tunde@rider.com</span>
                </motion.div>
              </div>
              <p className="text-[9px] text-gray-400 italic text-center">{t.passwordHint}</p>
            </motion.div>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

export default LoginPage;
