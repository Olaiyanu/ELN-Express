
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Store, Phone, AlertCircle, ArrowRight, MapPin, Package, FileText, Camera, ShieldCheck } from 'lucide-react';
import { mockDb } from '../services/mockDb';
import { User, UserRole, VerificationStatus } from '../types';
import AuthLayout from '../components/auth/AuthLayout';
import AuthInput from '../components/auth/AuthInput';
import AuthButton from '../components/auth/AuthButton';
import RoleToggle from '../components/auth/RoleToggle';
import { useLanguage } from '../src/contexts/LanguageContext';

import { motion } from 'motion/react';

interface SignupPageProps {
  onSignup: (user: User) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignup }) => {
  const { t: translations } = useLanguage();
  const t = translations.auth;
  const common = translations.common;

  const [role, setRole] = useState<UserRole>(UserRole.MERCHANT);
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    pickupAddress: '',
    natureOfGoods: '',
    idCardUrl: ''
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const navigate = useNavigate();

  const getPasswordStrength = (password: string) => {
    if (!password) return { label: '', color: '', score: 0 };
    
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

    if (score <= 2) return { label: 'Weak', color: 'text-red-500', score };
    if (score <= 4) return { label: 'Medium', color: 'text-orange-500', score };
    return { label: 'Strong', color: 'text-green-500', score };
  };

  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const emailValid = isEmailValid(formData.email);
  const passwordsMatch = formData.password && formData.confirmPassword ? formData.password === formData.confirmPassword : true;

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) return "Password must be at least 8 characters long";
    if (!hasUpperCase) return "Password must contain at least one uppercase letter";
    if (!hasLowerCase) return "Password must contain at least one lowercase letter";
    if (!hasNumber) return "Password must contain at least one number";
    if (!hasSpecialChar) return "Password must contain at least one special character";
    return null;
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    if (!agreedToTerms) {
      setError('You must agree to the terms and conditions');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    const users = mockDb.getUsers();
    if (users.some(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
      setError('Email already registered');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      const newUser: User = {
        uid: Math.random().toString(36).substring(2, 11),
        name: formData.name,
        email: formData.email,
        role: role,
        phone: formData.phone,
        isEmailConfirmed: false,
        ...(role === UserRole.MERCHANT && { 
          businessName: formData.businessName,
          pickupAddresses: [formData.pickupAddress],
          natureOfGoods: formData.natureOfGoods,
          idCardUrl: formData.idCardUrl,
          verificationStatus: VerificationStatus.PENDING
        }),
        ...(role === UserRole.RIDER && { 
          verificationStatus: VerificationStatus.UNVERIFIED,
          isAvailable: false 
        })
      };

      mockDb.saveUser(newUser);
      setIsEmailSent(true);
      setIsLoading(false);
    }, 1200);
  };

  const confirmEmail = () => {
    const users = mockDb.getUsers();
    const user = users.find(u => u.email.toLowerCase() === formData.email.toLowerCase());
    if (user) {
      user.isEmailConfirmed = true;
      mockDb.saveUser(user);
      onSignup(user);
      navigate('/onboarding');
    }
  };

  if (isEmailSent) {
    return (
      <AuthLayout
        title="Confirm Your Email"
        subtitle={`We've sent a confirmation link to ${formData.email}`}
      >
        <div className="text-center space-y-10">
          <div className="bg-gray-50 p-12 rounded-5xl border border-gray-100 space-y-6">
            <div className="bg-eln w-20 h-20 rounded-4xl flex items-center justify-center text-white mx-auto shadow-2xl shadow-eln/30">
              <Mail className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-gray-900">Check your inbox</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Please click the link in the email we sent to confirm your account and get started with ELN Express.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <button 
              onClick={confirmEmail}
              className="w-full py-6 bg-eln text-white rounded-full font-black text-sm uppercase tracking-widest shadow-2xl shadow-eln/30 flex items-center justify-center space-x-3 active:scale-95 transition-all"
            >
              <span>Simulate Email Link Click</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setIsEmailSent(false)}
              className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-eln transition-colors"
            >
              Back to Signup
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={t.signupTitle}
      subtitle={t.signupSubtitle}
    >
      <div className="space-y-8">
        <RoleToggle activeRole={role} onChange={setRole} />

        <form onSubmit={handleSignup} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center text-sm border border-red-100 animate-in shake duration-300">
              <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
              <span className="font-bold">{error}</span>
            </div>
          )}

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05
                }
              }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              <AuthInput
                label={t.fullNameLabel}
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="John Doe"
                icon={UserIcon}
              />
            </motion.div>

            {role === UserRole.MERCHANT && (
              <motion.div variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}>
                <AuthInput
                  label={t.businessNameLabel}
                  required
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  placeholder="Zara Boutique"
                  icon={Store}
                />
              </motion.div>
            )}

            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              <AuthInput
                label={t.emailLabel}
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="hello@eln.com"
                icon={Mail}
              />
              {formData.email && (
                <div className="mt-1 ml-1 flex items-center space-x-1">
                  <div className={`h-1.5 w-1.5 rounded-full ${emailValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className={`text-[9px] font-black uppercase tracking-widest ${emailValid ? 'text-green-600' : 'text-red-600'}`}>
                    {emailValid ? 'Valid Email Format' : 'Invalid Email Format'}
                  </p>
                </div>
              )}
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              <AuthInput
                label={t.phoneLabel}
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+234..."
                icon={Phone}
              />
            </motion.div>

            {role === UserRole.MERCHANT && (
              <>
                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                  <AuthInput
                    label="Pickup Address"
                    required
                    type="text"
                    value={formData.pickupAddress}
                    onChange={(e) => setFormData({...formData, pickupAddress: e.target.value})}
                    placeholder="123 Business Way, Lagos"
                    icon={MapPin}
                  />
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                  <AuthInput
                    label="Nature of Goods"
                    required
                    type="text"
                    value={formData.natureOfGoods}
                    onChange={(e) => setFormData({...formData, natureOfGoods: e.target.value})}
                    placeholder="Fashion, Electronics, etc."
                    icon={Package}
                  />
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="sm:col-span-2">
                  <div className="space-y-1.5 w-full">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                      Valid Identification (ID Card)
                    </label>
                    <div className="relative group">
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-eln transition-colors" />
                      <div className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-400 truncate">
                          {formData.idCardUrl ? 'ID Card Uploaded' : 'Upload Government ID'}
                        </span>
                        <label className="cursor-pointer bg-white px-4 py-2 rounded-xl border border-gray-100 text-[10px] font-black uppercase tracking-widest hover:bg-eln hover:text-white transition-all">
                          Browse
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => setFormData({...formData, idCardUrl: reader.result as string});
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div className="space-y-1">
              <AuthInput
                label={t.passwordLabel}
                required
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
                icon={Lock}
              />
              {formData.password && (
                <div className="mt-1 ml-1 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <p className={`text-[9px] font-black uppercase tracking-widest ${passwordStrength.color}`}>
                      Strength: {passwordStrength.label}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((step) => (
                      <div 
                        key={step} 
                        className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                          step <= passwordStrength.score 
                            ? (passwordStrength.score <= 2 ? 'bg-red-500' : passwordStrength.score <= 4 ? 'bg-orange-500' : 'bg-green-500')
                            : 'bg-gray-100'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <AuthInput
                label={t.confirmPasswordLabel}
                required
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="••••••••"
                icon={Lock}
              />
              {formData.confirmPassword && (
                <div className="mt-1 ml-1 flex items-center space-x-1">
                  <div className={`h-1.5 w-1.5 rounded-full ${passwordsMatch ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className={`text-[9px] font-black uppercase tracking-widest ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordsMatch ? 'Passwords Match' : 'Passwords Do Not Match'}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {role === UserRole.MERCHANT && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-center"
            >
              <Link 
                to="/merchant-policy" 
                className="group flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-eln transition-all"
              >
                <ShieldCheck className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                <span className="border-b border-transparent group-hover:border-eln">View Merchant Policy</span>
              </Link>
            </motion.div>
          )}

          {role === UserRole.RIDER && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-center"
            >
              <Link 
                to="/rider-policy" 
                className="group flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-eln transition-all"
              >
                <ShieldCheck className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                <span className="border-b border-transparent group-hover:border-eln">View Rider Policy</span>
              </Link>
            </motion.div>
          )}

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center space-x-3 py-2"
          >
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="h-5 w-5 rounded-lg border-2 border-gray-200 text-eln focus:ring-eln transition-all cursor-pointer appearance-none checked:bg-eln checked:border-eln"
              />
              {agreedToTerms && (
                <ShieldCheck className="absolute h-3 w-3 text-white left-1 pointer-events-none" />
              )}
            </div>
            <label htmlFor="terms" className="text-[10px] font-black uppercase tracking-widest text-gray-500 cursor-pointer select-none">
              I agree the terms and conditions
            </label>
          </motion.div>

          <AuthButton type="submit" isLoading={isLoading} icon={ArrowRight} disabled={!agreedToTerms}>
            {t.completeRegistration}
          </AuthButton>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-500 font-medium">
            {t.hasAccount} <Link to="/login" className="text-eln font-black hover:underline tracking-tight">{t.loginInstead}</Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;
