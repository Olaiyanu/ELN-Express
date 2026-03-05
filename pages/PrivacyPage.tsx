
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, Eye, FileText, Database, UserCheck } from 'lucide-react';
import Logo from '../components/Logo';
import { motion } from 'motion/react';
import { useLanguage } from '../src/contexts/LanguageContext';

const PrivacyPage: React.FC = () => {
  const { t: translations } = useLanguage();
  const t = translations.privacy;
  const common = translations.common;

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
        className="pt-32 pb-24 px-6 max-w-4xl mx-auto space-y-20"
      >
        {/* Header Section */}
        <motion.section variants={itemVariants} className="text-center space-y-6">
          <div className="bg-eln/5 w-20 h-20 rounded-[2rem] flex items-center justify-center text-eln mx-auto mb-8 shadow-inner">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <h1 className="text-5xl sm:text-7xl font-black text-gray-900 tracking-tight leading-none">
            {t.title.split(' ')[0]} <br />
            <span className="text-eln">{t.title.split(' ')[1]}</span>
          </h1>
          <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.4em]">{t.effectiveDate}</p>
        </motion.section>

        {/* Introduction */}
        <motion.div variants={itemVariants} className="bg-gray-50 p-10 sm:p-16 rounded-[3rem] border border-gray-100 space-y-6">
          <h2 className="text-2xl font-black text-gray-900">{t.commitmentTitle}</h2>
          <p className="text-lg text-gray-500 font-medium leading-relaxed">
            {t.commitmentDesc}
          </p>
        </motion.div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 gap-16">
          {[
            { 
              icon: Eye, 
              title: translations.landing.productIntegrity, 
              content: "We collect information necessary to provide professional logistics services. This includes business names for merchants, driver identification for riders, and location data to ensure real-time tracking for every fashion shipment." 
            },
            { 
              icon: Lock, 
              title: "Security Protocols", 
              content: "Your business data is stored using industry-standard encryption. We never share your customer database or merchant records with third parties. Our internal grid data is used strictly for operational efficiency." 
            },
            { 
              icon: Database, 
              title: "Storage & Retention", 
              content: "Transaction records are maintained for a period of 7 years to comply with financial regulations. Personal identification data is encrypted at rest and only accessible by authorized compliance officers." 
            }
          ].map((section, i) => (
            <motion.section key={i} variants={itemVariants} className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-eln/10 p-3 rounded-2xl text-eln">
                  <section.icon className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">{section.title}</h2>
              </div>
              <p className="text-lg text-gray-500 leading-relaxed font-medium pl-14">
                {section.content}
              </p>
            </motion.section>
          ))}
        </div>

        {/* Rights Section */}
        <motion.section variants={itemVariants} className="bg-gray-900 p-12 sm:p-16 rounded-[4rem] text-white space-y-10 relative overflow-hidden shadow-2xl shadow-eln/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-eln/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-center space-x-4">
              <UserCheck className="h-8 w-8 text-eln" />
              <h3 className="text-3xl font-black tracking-tight">{t.rightsTitle}</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: "Access", desc: "Request a full export of your transaction history and profile data." },
                { title: "Correction", desc: "Update or correct any business information stored in our grid." },
                { title: "Deletion", desc: "Request permanent removal of your account and associated records." },
                { title: "Portability", desc: "Transfer your data to another service provider in a structured format." }
              ].map((right, i) => (
                <div key={i} className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-2 hover:bg-white/10 transition-colors">
                  <h4 className="font-black text-eln uppercase text-xs tracking-widest">{right.title}</h4>
                  <p className="text-white/60 font-medium text-sm leading-relaxed">{right.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Footer Note */}
        <motion.div variants={itemVariants} className="text-center space-y-6 pt-10">
          <FileText className="h-8 w-8 text-gray-200 mx-auto" />
          <p className="text-sm text-gray-400 font-medium italic max-w-2xl mx-auto">
            {t.footerNote}
          </p>
          <button className="text-[10px] font-black text-eln uppercase tracking-[0.3em] hover:underline">
            {t.downloadPdf}
          </button>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default PrivacyPage;
