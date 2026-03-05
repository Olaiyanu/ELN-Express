
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Mail, Phone, HelpCircle, ChevronDown, ChevronUp, Search, Clock, ShieldCheck } from 'lucide-react';
import Logo from '../components/Logo';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../src/contexts/LanguageContext';

const SupportPage: React.FC = () => {
  const { t: translations } = useLanguage();
  const t = translations.support;
  const common = translations.common;
  const landing = translations.landing;
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = landing.faqs.filter((f: any) => 
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen selection:bg-eln/10">
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Logo className="h-6" showText={true} />
          </Link>
          <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-eln transition-colors flex items-center group">
            <ArrowLeft className="h-3 w-3 mr-1 group-hover:-translate-x-1 transition-transform" /> {common.back}
          </Link>
        </div>
      </nav>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="pt-32 pb-24 px-6 max-w-5xl mx-auto space-y-20"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center space-y-6">
          <h1 className="text-5xl sm:text-7xl font-black text-gray-900 tracking-tight leading-none">
            Concierge <br />
            <span className="text-eln">{common.support}.</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
            {t.desc}
          </p>
          
          <div className="max-w-xl mx-auto relative mt-10">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-[2rem] shadow-xl shadow-gray-200/40 focus:ring-2 focus:ring-eln/20 focus:border-eln transition-all font-medium"
            />
          </div>
        </motion.div>

        {/* Contact Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: MessageCircle, title: t.liveChat, detail: t.liveChatDesc, action: t.startChat, color: "bg-blue-500" },
            { icon: Mail, title: t.email, detail: t.emailDesc, action: t.sendEmail, color: "bg-eln" },
            { icon: Phone, title: t.phone, detail: t.phoneDesc, action: t.callNow, color: "bg-emerald-500" }
          ].map((contact, i) => (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 text-center space-y-6 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
              <div className={`${contact.color} w-16 h-16 rounded-3xl flex items-center justify-center text-white mx-auto shadow-lg group-hover:scale-110 transition-transform`}>
                <contact.icon className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-gray-900">{contact.title}</h3>
                <p className="text-sm text-gray-500 font-medium">{contact.detail}</p>
              </div>
              <button className="w-full py-4 bg-gray-50 text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-eln hover:text-white transition-all">
                {contact.action}
              </button>
            </div>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <motion.div variants={itemVariants} className="space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-gray-900 flex items-center">
              <HelpCircle className="h-8 w-8 mr-3 text-eln" /> {landing.faqTitle}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {filteredFaqs.map((f: any, i: number) => (
              <div key={i} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden transition-all hover:border-eln/20">
                <button 
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-black text-gray-900 text-lg">{f.question}</span>
                  {openFaqIndex === i ? (
                    <ChevronUp className="h-5 w-5 text-eln" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-300" />
                  )}
                </button>
                <AnimatePresence>
                  {openFaqIndex === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-8 pb-8 text-gray-500 font-medium leading-relaxed">
                        {f.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            {filteredFaqs.length === 0 && (
              <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200">
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No matching questions found</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Trust Banner */}
        <motion.div variants={itemVariants} className="bg-eln p-12 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 text-white">
          <div className="flex items-center space-x-6">
            <div className="bg-white/20 p-4 rounded-2xl">
              <ShieldCheck className="h-10 w-10" />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-tight">{t.securityTitle}</h3>
              <p className="text-white/70 font-medium">{t.securityDesc}</p>
            </div>
          </div>
          <div className="flex items-center space-x-8">
            <div className="text-center">
              <p className="text-3xl font-black">{t.uptime}</p>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{t.uptimeDesc}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black">{t.monitoring}</p>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{t.monitoringDesc}</p>
            </div>
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default SupportPage;
