
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Award, Users, Globe, Target, Heart, Shield } from 'lucide-react';
import Logo from '../components/Logo';
import { motion } from 'motion/react';
import { useLanguage } from '../src/contexts/LanguageContext';

const AboutPage: React.FC = () => {
  const { t: translations } = useLanguage();
  const t = translations.about;
  const common = translations.common;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="min-h-screen selection:bg-eln-primary/10">
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Logo className="h-6" showText={true} />
          </Link>
          <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-eln-primary transition-colors flex items-center group">
            <ArrowLeft className="h-3 w-3 mr-1 group-hover:-translate-x-1 transition-transform" /> {common.back}
          </Link>
        </div>
      </nav>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="pt-32 pb-24 px-6 max-w-5xl mx-auto space-y-32"
      >
        {/* Hero Section */}
        <motion.section variants={itemVariants} className="text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-eln-primary/10 rounded-full text-eln-primary text-[10px] font-black uppercase tracking-widest mb-4">
            <span>Established 2023</span>
          </div>
          <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black text-gray-900 tracking-tighter leading-[0.9]">
            {t.title.split(' ')[0]} <br />
            <span className="text-eln-primary">{t.title.split(' ')[1]}</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-500 font-medium leading-relaxed max-w-3xl mx-auto">
            {t.vision}
          </p>
        </motion.section>

        {/* Split Content Section */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-[3rem] overflow-hidden aspect-square shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1556905055-8f358a7a4bb4?q=80&w=1000&auto=format&fit=crop" 
              alt="Fashion Logistics" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-eln-primary/10 mix-blend-multiply"></div>
          </div>
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">{t.tailoredTitle}</h2>
              <p className="text-lg text-gray-500 font-medium leading-relaxed">
                {t.tailoredDesc}
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">{t.pulseTitle}</h2>
              <p className="text-lg text-gray-500 font-medium leading-relaxed">
                {t.pulseDesc}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.section variants={itemVariants} className="space-y-16">
          <div className="text-center">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">{t.valuesTitle}</h2>
            <p className="text-gray-500 font-medium mt-2">The principles that drive every delivery.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: Target, title: t.precision, desc: t.precisionDesc },
              { icon: Heart, title: t.care, desc: t.careDesc },
              { icon: Shield, title: t.integrity, desc: t.integrityDesc }
            ].map((value, i) => (
              <div key={i} className="bg-gray-50 p-10 rounded-[2.5rem] space-y-6 hover:bg-gradient-eln hover:text-white transition-all duration-500 group">
                <div className="bg-eln-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center text-eln-primary group-hover:bg-white/20 group-hover:text-white transition-colors">
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-black tracking-tight">{value.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed group-hover:text-white/80 transition-colors">{value.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-3 gap-12 text-center py-20 border-y border-gray-100">
          <div className="space-y-2">
            <Award className="h-10 w-10 mx-auto text-eln-primary" />
            <p className="text-4xl font-black">{t.rated}</p>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">{t.ratedDesc}</p>
          </div>
          <div className="space-y-2">
            <Users className="h-10 w-10 mx-auto text-eln-primary" />
            <p className="text-4xl font-black">{t.partners}</p>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">{t.partnersDesc}</p>
          </div>
          <div className="space-y-2">
            <Globe className="h-10 w-10 mx-auto text-eln-primary" />
            <p className="text-4xl font-black">{t.grid}</p>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">{t.gridDesc}</p>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section variants={itemVariants} className="bg-eln-orange-deep p-12 sm:p-20 rounded-[4rem] text-center space-y-8 relative overflow-hidden shadow-2xl shadow-eln-orange-deep/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -ml-32 -mb-32"></div>
          
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">{t.ctaTitle}</h2>
            <p className="text-white/80 font-medium max-w-xl mx-auto text-lg">
              {t.ctaDesc}
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              <Link to="/signup" className="px-10 py-5 bg-white text-eln-orange-deep rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
                {common.getStarted}
              </Link>
            </div>
          </div>
        </motion.section>
      </motion.main>
    </div>
  );
};

export default AboutPage;
