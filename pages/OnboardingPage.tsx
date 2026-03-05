
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Store, 
  Bike, 
  ShieldCheck, 
  Package, 
  MapPin, 
  Sparkles,
  Camera,
  ChevronRight,
  FileText,
  Upload,
  Loader2
} from 'lucide-react';
import { User, UserRole, VerificationStatus } from '../types';
import { useLanguage } from '../src/contexts/LanguageContext';
import { mockDb } from '../services/mockDb';

interface OnboardingPageProps {
  user: User | null;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ user }) => {
  const { t: translations } = useLanguage();
  const t = translations.onboarding;

  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationData, setVerificationData] = useState({
    idCardUrl: '',
    selfieUrl: '',
    plateNumber: ''
  });
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleComplete = async () => {
    if (user.role === UserRole.RIDER) {
      setIsSubmitting(true);
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      mockDb.submitVerification(user.uid, {
        idCardUrl: verificationData.idCardUrl || 'https://picsum.photos/seed/id/400/300',
        selfieUrl: verificationData.selfieUrl || 'https://picsum.photos/seed/selfie/400/300',
        plateNumber: verificationData.plateNumber || 'LAG-123-ABC'
      });
      setIsSubmitting(false);
      navigate('/rider-dashboard');
    } else {
      navigate('/merchant-dashboard');
    }
  };

  const merchantSteps = [
    {
      title: t.welcome,
      description: t.welcomeDesc,
      icon: <Sparkles className="h-12 w-12 text-eln" />,
      content: (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="aspect-video rounded-3xl overflow-hidden bg-gray-100 relative group">
            <img 
              src="https://picsum.photos/seed/business-logistics/800/450" 
              alt="Business Logistics" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-eln/20 backdrop-blur-[2px] flex items-center justify-center">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/90 p-4 rounded-2xl shadow-xl"
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-eln">Professional Service</p>
              </motion.div>
            </div>
          </div>
          <p className="text-gray-500 font-medium leading-relaxed">
            ELN Express is designed specifically for the handling and rapid delivery requirements of modern businesses.
          </p>
        </motion.div>
      )
    },
    {
      title: t.identity,
      description: t.identityDesc,
      icon: <Store className="h-12 w-12 text-eln" />,
      content: (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="space-y-8"
        >
          <motion.div variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }} className="flex flex-col items-center space-y-4">
            <div className="h-32 w-32 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center space-y-2 group hover:border-eln hover:bg-eln/5 transition-all cursor-pointer">
              <Camera className="h-6 w-6 text-gray-300 group-hover:text-eln" />
              <span className="text-[10px] font-black uppercase text-gray-400">{t.uploadLogo}</span>
            </div>
            <p className="text-xs text-gray-400 font-medium italic">This will appear on your digital waybills.</p>
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">{t.brandColor}</label>
              <div className="flex space-x-3">
                {['#034287', '#1a1a1a', '#e11d48', '#059669'].map(color => (
                  <motion.button 
                    key={color}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="h-10 w-10 rounded-xl border-2 border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
                <button className="h-10 w-10 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center">
                  <span className="text-xs text-gray-400">+</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )
    },
    {
      title: t.ready,
      description: t.readyDesc,
      icon: <CheckCircle2 className="h-12 w-12 text-green-500" />,
      content: (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-2">
              <Package className="h-6 w-6 text-eln" />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Step 1</p>
              <p className="text-sm font-bold text-gray-800">Create Order</p>
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-2">
              <MapPin className="h-6 w-6 text-eln" />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Step 2</p>
              <p className="text-sm font-bold text-gray-800">Track Rider</p>
            </motion.div>
          </div>
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-eln/5 p-6 rounded-3xl border border-eln/10">
            <p className="text-xs font-medium text-eln leading-relaxed">
              {t.proTip}
            </p>
          </motion.div>
        </motion.div>
      )
    }
  ];

  const riderSteps = [
    {
      title: t.elite,
      description: t.eliteDesc,
      icon: <Bike className="h-12 w-12 text-eln" />,
      content: (
        <div className="space-y-6">
          <div className="aspect-video rounded-3xl overflow-hidden bg-gray-100 relative group">
            <img 
              src="https://picsum.photos/seed/rider-onboarding/800/450" 
              alt="Rider Onboarding" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-eln/20 backdrop-blur-[2px] flex items-center justify-center">
              <div className="bg-white/90 p-4 rounded-2xl shadow-xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-eln">Elite Fleet</p>
              </div>
            </div>
          </div>
          <p className="text-gray-500 font-medium leading-relaxed">
            As an ELN Express Rider, you are the face of the brand. Professionalism and care are our top priorities for every business we serve.
          </p>
        </div>
      )
    },
    {
      title: t.safety,
      description: t.safetyDesc,
      icon: <ShieldCheck className="h-12 w-12 text-eln" />,
      content: (
        <div className="space-y-4">
          {[
            "Always wear your ELN branded helmet.",
            "Ensure your delivery box is clean and secure.",
            "Handle all packages with maximum care.",
            "Maintain a professional appearance at all times."
          ].map((item, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="h-6 w-6 rounded-full bg-eln/10 flex items-center justify-center text-eln text-[10px] font-black">
                {i + 1}
              </div>
              <p className="text-sm font-bold text-gray-700">{item}</p>
            </div>
          ))}
        </div>
      )
    },
    {
      title: t.verification,
      description: t.verificationDesc,
      icon: <ShieldCheck className="h-12 w-12 text-eln" />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Government ID Card</label>
              <div className="relative group">
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                  onChange={(e) => setVerificationData({...verificationData, idCardUrl: e.target.value})}
                />
                <div className="w-full p-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-between group-hover:border-eln group-hover:bg-eln/5 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <span className="text-sm font-bold text-gray-500">
                      {verificationData.idCardUrl ? 'ID Uploaded' : 'Upload ID Card'}
                    </span>
                  </div>
                  <Upload className="h-5 w-5 text-gray-300" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Selfie Verification</label>
              <div className="relative group">
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                  onChange={(e) => setVerificationData({...verificationData, selfieUrl: e.target.value})}
                />
                <div className="w-full p-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-between group-hover:border-eln group-hover:bg-eln/5 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <Camera className="h-5 w-5 text-gray-400" />
                    </div>
                    <span className="text-sm font-bold text-gray-500">
                      {verificationData.selfieUrl ? 'Selfie Captured' : 'Take a Selfie'}
                    </span>
                  </div>
                  <Upload className="h-5 w-5 text-gray-300" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Vehicle Plate Number</label>
              <input 
                type="text" 
                placeholder="e.g. LAG-123-ABC"
                value={verificationData.plateNumber}
                onChange={(e) => setVerificationData({...verificationData, plateNumber: e.target.value})}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 focus:ring-2 focus:ring-eln focus:bg-white transition-all"
              />
            </div>
          </div>
          <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
            <p className="text-xs font-medium text-orange-700 leading-relaxed">
              Note: Our compliance team will review your documents within 24 hours.
            </p>
          </div>
        </div>
      )
    }
  ];

  const steps = user.role === UserRole.MERCHANT ? merchantSteps : riderSteps;
  const currentStep = steps[step];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full">
        {/* Progress Bar */}
        <div className="flex space-x-2 mb-12">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-eln' : 'bg-gray-200'}`} 
            />
          ))}
        </div>

        <motion.div 
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-[3rem] shadow-2xl shadow-eln/5 p-8 sm:p-16 border border-gray-100"
        >
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="bg-eln/5 p-6 rounded-[2rem]">
              {currentStep.icon}
            </div>
            
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                {currentStep.title}
              </h2>
              <p className="text-gray-500 font-medium max-w-sm mx-auto">
                {currentStep.description}
              </p>
            </div>

            <div className="w-full text-left">
              {currentStep.content}
            </div>

            <button 
              onClick={() => step < steps.length - 1 ? setStep(step + 1) : handleComplete()}
              disabled={isSubmitting}
              className="w-full py-5 bg-eln text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-eln/20 flex items-center justify-center space-x-3 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span>{step === steps.length - 1 ? t.goDashboard : t.continue}</span>
                  {step === steps.length - 1 ? <Sparkles className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </>
              )}
            </button>
          </div>
        </motion.div>

        <div className="mt-8 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
            ELN EXPRESS LIMITED • ONBOARDING
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
