
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
  ChevronRight
} from 'lucide-react';
import { User, UserRole } from '../types';
import { useLanguage } from '../src/contexts/LanguageContext';

interface OnboardingPageProps {
  user: User | null;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ user }) => {
  const { t: translations } = useLanguage();
  const t = translations.onboarding;

  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleComplete = () => {
    if (user.role === UserRole.MERCHANT) {
      navigate('/merchant-dashboard');
    } else {
      navigate('/rider-dashboard');
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
      icon: <Sparkles className="h-12 w-12 text-eln" />,
      content: (
        <div className="space-y-6">
          <p className="text-gray-500 font-medium leading-relaxed">
            Our verification process ensures the safety of all high-value items. You'll need to upload:
          </p>
          <div className="grid grid-cols-3 gap-3">
            {['Govt. ID', 'Selfie', 'Plate No.'].map(item => (
              <div key={item} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-eln">{item}</p>
              </div>
            ))}
          </div>
          <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
            <p className="text-xs font-medium text-orange-700 leading-relaxed">
              Note: You can browse the app now, but you won't receive delivery requests until verified.
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
              className="w-full py-5 bg-eln text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-eln/20 flex items-center justify-center space-x-3 active:scale-95 transition-all"
            >
              <span>{step === steps.length - 1 ? t.goDashboard : t.continue}</span>
              {step === steps.length - 1 ? <Sparkles className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
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
