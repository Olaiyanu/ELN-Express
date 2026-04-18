
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Smartphone,
  CheckCircle2,
  Package,
  Clock,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  MessageSquare,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage, Language } from '../src/contexts/LanguageContext';

const Typewriter: React.FC<{ text: string; delay?: number; speed?: number }> = ({ text, delay = 0, speed = 50 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          setIsComplete(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay, speed]);

  return (
    <span>
      {displayedText}
      {!isComplete && <span className="typewriter-cursor" />}
    </span>
  );
};

const Counter: React.FC<{ end: number; duration?: number; suffix?: string }> = ({ end, duration = 2, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!isInView) return;
    
    let start = 0;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <motion.span 
      onViewportEnter={() => setIsInView(true)}
      viewport={{ once: true }}
    >
      {count.toLocaleString()}{suffix}
    </motion.span>
  );
};

const HERO_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000&auto=format&fit=crop",
    alt: "Modern Logistics"
  },
  {
    url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop",
    alt: "Fashion Boutique"
  },
  {
    url: "https://images.unsplash.com/photo-1558603668-6570496b66f8?q=80&w=2000&auto=format&fit=crop",
    alt: "Tailoring & Craft"
  },
  {
    url: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=2000&auto=format&fit=crop",
    alt: "Delivery & Packages"
  }
];

const LANG_NAMES: Record<Language, string> = {
  en: "English",
  yo: "Yoruba"
};

const LandingPage: React.FC = () => {
  const { lang, setLang, t: translations } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const t = translations.landing;
  const common = translations.common;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen selection:bg-eln-primary/10">
      {/* Enhanced Navigation - Floating Island Style */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        className="fixed top-0 left-0 right-0 z-50 py-4 sm:py-6"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className={`flex justify-between items-center transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            isScrolled 
              ? 'bg-white/95 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl px-6 sm:px-8 h-14' 
              : 'bg-white border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.05)] rounded-[2rem] px-8 sm:px-10 h-16'
          }`}>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-3"
            >
              <Logo 
                className={`transition-all duration-500 ${isScrolled ? 'h-5 scale-90' : 'h-6 scale-100'}`} 
                showText={true} 
                variant="primary"
              />
            </motion.div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="relative">
                <button 
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsLangDropdownOpen(false), 200)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-300 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-100"
                >
                  <span>{LANG_NAMES[lang]}</span>
                  <ChevronDown className={`h-2.5 w-2.5 transition-transform duration-300 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isLangDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-4 w-44 bg-white rounded-[2rem] shadow-2xl border border-gray-100 py-3 z-50 overflow-hidden"
                    >
                      {(Object.keys(LANG_NAMES) as Array<Language>).map((l) => (
                        <button
                          key={l}
                          onClick={() => { setLang(l); setIsLangDropdownOpen(false); }}
                          className={`w-full text-left px-6 py-3.5 text-[10px] font-black uppercase tracking-widest transition-all ${lang === l ? 'text-eln-primary bg-eln-primary/5' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                          {LANG_NAMES[l]}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <Link to="/login">
                <motion.span 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-[9px] font-black uppercase tracking-widest transition-all duration-300 inline-block text-gray-500 hover:text-eln-primary"
                >
                  {common.login}
                </motion.span>
              </Link>
              <Link to="/signup">
                <motion.div 
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-500 shadow-lg bg-eln-primary text-white shadow-eln-primary/10 hover:shadow-eln-primary/20"
                >
                  {common.joinNow}
                </motion.div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-3">
              <button 
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center space-x-1 px-3 py-2 rounded-full text-[10px] font-black bg-gray-100 text-gray-500"
              >
                <span>{lang.toUpperCase()}</span>
              </button>
              
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 rounded-full transition-all bg-gray-100 text-gray-900"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-6 py-8 space-y-6">
                <Link 
                  to="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center text-sm font-black uppercase tracking-widest text-gray-900 py-4 border border-gray-100 rounded-2xl"
                >
                  {common.login}
                </Link>
                <Link 
                  to="/signup" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center text-sm font-black uppercase tracking-widest text-white bg-eln-primary py-5 rounded-2xl shadow-xl shadow-eln-primary/20"
                >
                  {common.joinNow}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section: Immersive Background Slider */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden bg-eln-orange-black">
        {/* Background Image Slider */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 2.5, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0"
            >
              <img 
                src={HERO_IMAGES[currentImageIndex].url} 
                alt={HERO_IMAGES[currentImageIndex].alt} 
                className="w-full h-full object-cover grayscale-[0.4] brightness-[0.2]"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </AnimatePresence>
          
          {/* Refined Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-eln-orange-black via-transparent to-eln-orange-black z-10 opacity-80"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-eln-orange-black/60 via-transparent to-eln-orange-black/60 z-10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(18,6,0,0.8)_100%)] z-10"></div>
          
          {/* Subtle Noise Texture */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-20 text-center pt-32 sm:pt-40">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center space-x-3 px-5 py-2.5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full text-white text-[10px] font-black uppercase tracking-[0.25em] mb-12 shadow-2xl"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-eln-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-eln-primary"></span>
            </span>
            <span className="opacity-80">{t.badge}</span>
          </motion.div>

          {/* Title */}
          <div className="overflow-hidden mb-8">
            <motion.h1 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="text-6xl sm:text-8xl lg:text-[10rem] font-black text-white leading-[0.88] tracking-tighter"
            >
              {t.heroTitle1}
            </motion.h1>
            <motion.h1 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="text-6xl sm:text-8xl lg:text-[10rem] font-black text-eln-primary leading-[0.88] tracking-tighter mt-2"
            >
              {t.heroTitle2}
            </motion.h1>
          </div>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="text-base sm:text-lg text-white/60 font-medium max-w-2xl mx-auto mb-14 leading-relaxed tracking-wide"
          >
            {t.heroDesc}
          </motion.p>

          {/* Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link to="/signup" className="group relative w-full sm:w-auto px-10 py-5 bg-eln-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-widest overflow-hidden transition-all hover:scale-[1.05] active:scale-95 shadow-2xl shadow-eln-primary/20">
              <span className="relative z-10 flex items-center justify-center space-x-3">
                <span>{common.getStarted}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Link>

            <button className="w-full sm:w-auto px-10 py-5 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all hover:bg-white/10 active:scale-95">
              {t.learnMore}
            </button>
          </motion.div>
        </div>

        {/* Hero Indicators & Floating Trust */}
        <div className="absolute bottom-12 left-0 right-0 z-30 px-6 lg:px-12 flex flex-col md:flex-row justify-between items-end gap-8">
          {/* Floating Trust Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="bg-white/10 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 space-y-2 hidden sm:block"
          >
            <div className="flex items-center space-x-2 text-white">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Verified Merchant Network</span>
            </div>
            <p className="text-xl font-black text-white leading-tight">Trusted by 500+ <br/>Growing Businesses</p>
          </motion.div>

          {/* Image Indicators */}
          <div className="flex space-x-3 mb-4">
            {HERO_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImageIndex(i)}
                className={`h-1 rounded-full transition-all duration-700 ${i === currentImageIndex ? 'w-12 bg-white' : 'w-4 bg-white/20 hover:bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* MVP Features: Expanded Services */}
      <section id="services" className="py-32 bg-eln-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 px-4 py-1.5 bg-eln-primary/10 rounded-full text-eln-primary text-[10px] font-black uppercase tracking-widest mb-6"
            >
              <span>Our Capabilities</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-5xl lg:text-7xl font-black mb-8 tracking-tighter text-eln-orange-deep"
            >
              {t.servicesTitle}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 text-lg sm:text-xl max-w-2xl mx-auto font-medium"
            >
              Specialized infrastructure built for the unique demands of modern fashion logistics and high-growth retail.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
            {[
              { 
                title: t.swiftDispatch, 
                desc: t.swiftDispatchDesc, 
                icon: Zap, 
                image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
                tag: "Speed"
              },
              { 
                title: t.productIntegrity, 
                desc: t.productIntegrityDesc, 
                icon: ShieldCheck, 
                image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1200&auto=format&fit=crop",
                tag: "Safety"
              },
              { 
                title: t.realTimeGrid, 
                desc: t.realTimeGridDesc, 
                icon: Smartphone, 
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
                tag: "Transparency"
              },
              { 
                title: t.bulkShipping, 
                desc: t.bulkShippingDesc, 
                icon: Package, 
                image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop",
                tag: "Volume"
              },
              { 
                title: t.scheduledPickups, 
                desc: t.scheduledPickupsDesc, 
                icon: Clock, 
                image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop",
                tag: "Planning"
              },
              { 
                title: "Verified Network", 
                desc: "Every rider in our network is background-checked and professionally trained to represent your brand.", 
                icon: CheckCircle2, 
                image: "https://images.unsplash.com/photo-1558603668-6570496b66f8?q=80&w=1200&auto=format&fit=crop",
                tag: "Trust"
              }
            ].map((service, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.15, duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="relative group h-[450px] sm:h-[550px] rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden shadow-2xl shadow-black/5 transition-all duration-500"
              >
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 transition-transform duration-1000 ease-out group-hover:scale-105">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent opacity-90"></div>
                </div>
                
                {/* Content */}
                <div className="relative h-full p-6 sm:p-10 flex flex-col justify-end">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.15 + 0.4 }}
                    className="absolute top-6 left-6 sm:top-10 sm:left-10"
                  >
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-white mb-6">
                      <service.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                  </motion.div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[8px] font-black uppercase tracking-widest text-white/80">
                        {service.tag}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">
                      {service.title}
                    </h3>
                    
                    <p className="text-white/60 font-medium leading-relaxed text-sm">
                      {service.desc}
                    </p>

                    <div className="pt-6 flex items-center justify-between transition-all duration-500">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Service 0{idx + 1}</span>
                      <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-gray-900">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Brand Section */}
      <section className="py-32 bg-eln-orange-deep text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-eln-primary rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-eln-primary rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-full text-white text-[10px] font-black uppercase tracking-widest"
              >
                <span>Our Identity</span>
              </motion.div>
              <h2 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[0.9]">
                {t.aboutTitle} <br />
                <span className="text-white/40">{t.aboutSubtitle}</span>
              </h2>
              <p className="text-white/60 text-lg font-medium leading-relaxed max-w-xl">
                {t.aboutDesc}
              </p>
              <div className="grid grid-cols-2 gap-8 pt-8">
                <div>
                  <div className="text-4xl font-black mb-1">
                    <Counter end={500} suffix="+" />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Active Merchants</div>
                </div>
                <div>
                  <div className="text-4xl font-black mb-1">
                    <Counter end={15000} suffix="+" />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Successful Missions</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 0.5, 0]
                }}
                transition={{ 
                  initial: { duration: 0.8 },
                  animate: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                }}
                viewport={{ once: true }}
                className="rounded-[4rem] overflow-hidden aspect-square relative shadow-2xl shadow-eln-primary/30 border border-white/10"
              >
                <img 
                  src="https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=1000&auto=format&fit=crop" 
                  alt="Professional Business Logistics"
                  className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-1000 scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-eln-primary/20 to-transparent mix-blend-overlay" />
              </motion.div>
              <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[3rem] text-eln-orange-deep shadow-2xl hidden md:block">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-eln-primary rounded-2xl flex items-center justify-center text-white">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm font-black uppercase tracking-widest">Secured</div>
                    <div className="text-[10px] text-gray-400 font-bold">Transit Insurance Included</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 bg-gradient-eln-deep text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter mb-6">
              {t.howItWorksTitle}
            </h2>
            <p className="text-white/80 font-medium text-lg">
              {t.howItWorksDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-white/20 -translate-y-1/2 hidden md:block z-0" />
            
            {t.merchantSteps.map((step: any, i: number) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10 text-center space-y-6"
              >
                <div className="w-20 h-20 bg-white border-4 border-white/10 rounded-full flex items-center justify-center mx-auto shadow-xl text-eln-primary font-black text-2xl">
                  0{i + 1}
                </div>
                <h3 className="text-xl font-black text-white">{step.title}</h3>
                <p className="text-white/70 text-sm font-medium leading-relaxed px-4">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-32 bg-eln-bg">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-20">
            <div className="lg:w-1/3 space-y-8">
              <h2 className="text-4xl sm:text-5xl font-black text-eln-orange-deep tracking-tighter leading-[0.9]">
                {t.whyChooseUsTitle}
              </h2>
              <p className="text-gray-500 font-medium">
                {t.whyChooseUsDesc}
              </p>
              <div className="pt-4">
                <Link to="/signup" className="inline-flex items-center space-x-3 text-eln-primary font-black text-[10px] uppercase tracking-widest group">
                  <span>Start Shipping Now</span>
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {t.reasons.map((reason: any, i: number) => (
                <div key={i} className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-eln-primary/10 rounded-2xl flex items-center justify-center text-eln-primary mb-6">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-black text-eln-orange-deep mb-3">{reason.title}</h3>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">{reason.desc}</p>
                </div>
              ))}
              <div className="bg-eln-orange-deep p-10 rounded-[3rem] text-white flex flex-col justify-between">
                <h3 className="text-2xl font-black leading-tight">Ready to experience the Elite difference?</h3>
                <Link to="/signup" className="mt-8 py-4 bg-eln-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest text-center hover:bg-eln-primary/90 transition-all">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional FAQ Section */}
      <section id="faq" className="py-32 bg-eln-bg relative overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/50 -skew-x-12 translate-x-1/4 z-0"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            {/* Left Side: Context & CTA */}
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center space-x-2 px-4 py-1.5 bg-eln-orange-deep text-white rounded-full text-[10px] font-black uppercase tracking-widest"
                >
                  <span>Knowledge Base</span>
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl sm:text-6xl font-black text-eln-orange-deep tracking-tighter leading-[0.9]"
                >
                  Common <br/>
                  <span className="text-eln-primary">Questions.</span>
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-500 text-lg font-medium max-w-md leading-relaxed"
                >
                  {t.faqDesc}
                </motion.p>
              </div>

              {/* Support Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-eln-orange-deep p-10 rounded-[3rem] text-white space-y-8 shadow-2xl shadow-eln-orange-deep/20 relative overflow-hidden group"
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
                <div className="relative z-10 space-y-6">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tight">Still have questions?</h3>
                    <p className="text-white/60 text-sm font-medium leading-relaxed">Our concierge team is available 24/7 to assist with your specific logistics needs.</p>
                  </div>
                  <Link to="/support" className="inline-flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-white hover:text-eln-primary transition-colors group/btn">
                    <span>Contact Support</span>
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Right Side: Accordion */}
            <div className="lg:col-span-7 space-y-4">
              {t.faqs?.map((faq: any, index: number) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`group border-b border-gray-100 transition-all duration-500 ${openFaqIndex === index ? 'pb-8' : 'pb-0'}`}
                >
                  <button 
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full py-8 flex items-start justify-between text-left group-hover:px-4 transition-all duration-500 rounded-2xl hover:bg-gray-50/50"
                  >
                    <div className="flex items-start space-x-6">
                      <span className="text-[10px] font-black text-gray-300 mt-1.5 font-mono">0{index + 1}</span>
                      <span className={`font-black text-eln-orange-deep text-lg sm:text-xl tracking-tight transition-colors ${openFaqIndex === index ? 'text-eln-primary' : ''}`}>
                        {faq.question}
                      </span>
                    </div>
                    <div className={`mt-1.5 flex-shrink-0 transition-transform duration-500 ${openFaqIndex === index ? 'rotate-180' : ''}`}>
                      <ChevronDown className={`h-5 w-5 ${openFaqIndex === index ? 'text-eln-primary' : 'text-gray-300'}`} />
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {openFaqIndex === index && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pl-16 pr-8 pb-4 text-gray-500 font-medium leading-relaxed text-base sm:text-lg">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Simple CTA Section */}
      <section className="py-24 bg-eln-bg text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-6"
        >
          <h2 className="text-3xl sm:text-5xl font-black text-eln-orange-deep mb-6">Ready to Scale your Business?</h2>
          <p className="text-gray-500 font-medium text-lg mb-10">
            Join the network of merchants and riders redefining the order-to-doorstep experience.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Link to="/signup" className="block px-12 py-5 bg-eln-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-eln-primary/30 transition-all">
                Join as Merchant
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Link to="/signup" className="block px-12 py-5 bg-eln-orange-deep text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                Become a Rider
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-eln-black-orange text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="space-y-8">
              <Logo className="h-8" showText={true} variant="white" />
              <p className="text-white/80 text-sm leading-relaxed max-w-xs">
                The specialized delivery partner for fashion brands and small businesses. We handle your products with the care they deserve.
              </p>
              <div className="flex space-x-4">
                {[
                  { name: 'Twitter', icon: Twitter },
                  { name: 'Instagram', icon: Instagram },
                  { name: 'LinkedIn', icon: Linkedin }
                ].map(social => (
                  <div key={social.name} className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-eln-primary transition-colors cursor-pointer group">
                    <span className="sr-only">{social.name}</span>
                    <social.icon className="h-4 w-4 text-white/40 group-hover:text-white transition-colors" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 mb-8">Platform</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li><Link to="/signup" className="text-white/80 hover:text-white transition-colors">{t.joinMerchant}</Link></li>
                <li><Link to="/signup" className="text-white/80 hover:text-white transition-colors">{t.becomeRider}</Link></li>
                <li><Link to="/login" className="text-white/80 hover:text-white transition-colors">{common.login}</Link></li>
                <li><Link to="/admin-login" className="text-white/80 hover:text-white transition-colors">{common.admin}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 mb-8">Company</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li><Link to="/about" className="text-white/80 hover:text-white transition-colors">{common.about}</Link></li>
                <li><Link to="/support" className="text-white/80 hover:text-white transition-colors">{common.support}</Link></li>
                <li><Link to="/privacy" className="text-white/80 hover:text-white transition-colors">{common.privacy}</Link></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 mb-8">Contact</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li className="text-white/80">Victoria Island, Lagos</li>
                <li className="text-white/80">hello@elnexpress.com</li>
                <li className="text-white/80">+234 800-ELN-SUPPORT</li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em]">
              &copy; {new Date().getFullYear()} ELN EXPRESS LIMITED. ALL RIGHTS RESERVED.
            </p>
            <div className="flex space-x-8 text-[10px] font-black uppercase tracking-widest text-white/40">
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
