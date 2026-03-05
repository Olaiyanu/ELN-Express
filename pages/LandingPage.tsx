
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Smartphone,
  CheckCircle2,
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
  const [activeService, setActiveService] = useState<number | null>(null);

  const t = translations.landing;
  const common = translations.common;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen selection:bg-eln/10">
      {/* Enhanced Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl z-50 border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <Logo className="h-7" showText={true} />
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="relative">
                <button 
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  onBlur={() => setTimeout(() => setIsLangDropdownOpen(false), 200)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors text-[10px] font-black uppercase tracking-widest text-gray-500"
                >
                  <span>{LANG_NAMES[lang]}</span>
                  <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isLangDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-2 w-40 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden"
                    >
                      {(Object.keys(LANG_NAMES) as Array<Language>).map((l) => (
                        <button
                          key={l}
                          onClick={() => { setLang(l); setIsLangDropdownOpen(false); }}
                          className={`w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${lang === l ? 'text-eln bg-eln/5' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                          {LANG_NAMES[l]}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-eln transition-colors">
                {common.login}
              </Link>
              <Link to="/signup" className="px-6 py-3 bg-eln text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-eln/20 hover:scale-105 active:scale-95 transition-all">
                {common.joinNow}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-4">
              <div className="relative">
                <button 
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className="flex items-center space-x-1 px-3 py-2 rounded-full bg-gray-50 text-[10px] font-black text-gray-500"
                >
                  <span>{lang.toUpperCase()}</span>
                </button>
                
                <AnimatePresence>
                  {isLangDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                    >
                      {(Object.keys(LANG_NAMES) as Array<Language>).map((l) => (
                        <button
                          key={l}
                          onClick={() => { setLang(l); setIsLangDropdownOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest ${lang === l ? 'text-eln' : 'text-gray-500'}`}
                        >
                          {LANG_NAMES[l]}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
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
                  className="block text-center text-sm font-black uppercase tracking-widest text-white bg-eln py-5 rounded-2xl shadow-xl shadow-eln/20"
                >
                  {common.joinNow}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section: Immersive Background Slider */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
        {/* Background Image Slider */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0"
            >
              <img 
                src={HERO_IMAGES[currentImageIndex].url} 
                alt={HERO_IMAGES[currentImageIndex].alt} 
                className="w-full h-full object-cover grayscale-[0.3] brightness-[0.4]"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </AnimatePresence>
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-transparent to-gray-900 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/40 via-transparent to-gray-900/40 z-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-20 text-center">
          <motion.div 
            key={lang}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-widest mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span>{t.badge}</span>
          </motion.div>

          <h1 
            key={`title-${lang}`}
            className="text-4xl sm:text-7xl lg:text-9xl font-black text-white leading-[1] tracking-tighter mb-8 transform -skew-x-6"
          >
            <span className="reveal-text">
              <span style={{ animationDelay: '0.1s' }}>{t.heroTitle1.split(' ')[0]}</span>
            </span>{' '}
            <span className="reveal-text">
              <span style={{ animationDelay: '0.2s' }}>{t.heroTitle1.split(' ')[1]}</span>
            </span>
            <br />
            <span className="reveal-text text-white/80">
              <span style={{ animationDelay: '0.4s' }}>{t.heroTitle2.split(' ')[0]}</span>
            </span>{' '}
            <span className="reveal-text text-white/80">
              <span style={{ animationDelay: '0.5s' }}>{t.heroTitle2.split(' ')[1]}</span>
            </span>
          </h1>

          <motion.p 
            key={`desc-${lang}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-base sm:text-2xl text-white/60 font-medium max-w-3xl mx-auto mb-12"
          >
            {t.heroDesc}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link to="/signup" className="w-full sm:w-auto px-8 sm:px-12 py-5 sm:py-6 bg-white text-gray-900 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-2xl shadow-white/10 flex items-center justify-center space-x-3 hover:bg-gray-100 transition-all">
              <span>{common.getStarted}</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 sm:px-12 py-5 sm:py-6 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest flex items-center justify-center hover:bg-white/20 transition-all">
              {common.merchantLogin}
            </Link>
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

      {/* Partner Marquee: Auto-Horizontal Scrolling */}
      <div className="overflow-hidden py-12 border-y border-gray-100 bg-white relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex whitespace-nowrap animate-marquee"
        >
          <div className="flex space-x-16 items-center px-8">
            {[
              "ZARA", "GUCCI", "PRADA", "NIKE", "ADIDAS", "H&M", "UNIQLO", "ASOS", "FARFETCH", "VOGUE", "CHANEL", "DIOR", "HERMÈS"
            ].map((brand) => (
              <span key={brand} className="text-3xl sm:text-5xl font-black text-gray-100 tracking-tighter hover:text-eln transition-colors cursor-default select-none">
                {brand}
              </span>
            ))}
          </div>
          {/* Duplicate for seamless loop */}
          <div className="flex space-x-16 items-center px-8">
            {[
              "ZARA", "GUCCI", "PRADA", "NIKE", "ADIDAS", "H&M", "UNIQLO", "ASOS", "FARFETCH", "VOGUE", "CHANEL", "DIOR", "HERMÈS"
            ].map((brand) => (
              <span key={`${brand}-dup`} className="text-3xl sm:text-5xl font-black text-gray-100 tracking-tighter hover:text-eln transition-colors cursor-default select-none">
                {brand}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* MVP Features: No fluff, just utility */}
      <section id="services" className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 px-4 py-1.5 bg-eln/5 rounded-full text-eln text-[10px] font-black uppercase tracking-widest mb-6"
            >
              <span>Our Capabilities</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-5xl lg:text-7xl font-black mb-8 tracking-tighter text-gray-900"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
            {[
              { 
                title: t.swiftDispatch, 
                desc: "Optimized routing for high-priority drops. Our fleet is strategically positioned to ensure your products reach customers while the trend is still hot.", 
                icon: Zap, 
                image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
                tag: "Speed"
              },
              { 
                title: t.productIntegrity, 
                desc: "Bespoke handling protocols for delicate fabrics and luxury items. We use specialized packaging and climate-aware transit to preserve every detail.", 
                icon: ShieldCheck, 
                image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1200&auto=format&fit=crop",
                tag: "Safety"
              },
              { 
                title: t.realTimeGrid, 
                desc: "End-to-end visibility through our proprietary logistics grid. Track every movement with sub-meter precision and automated status updates.", 
                icon: Smartphone, 
                image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=1200&auto=format&fit=crop",
                tag: "Tech"
              },
            ].map((service, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.15, duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
                onClick={() => setActiveService(activeService === idx ? null : idx)}
                className={`relative group h-[400px] sm:h-[500px] rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden shadow-2xl shadow-black/5 cursor-pointer transition-all duration-500 ${activeService === idx ? 'ring-4 ring-eln/20' : ''}`}
              >
                {/* Background Image with Overlay */}
                <div className={`absolute inset-0 transition-transform duration-1000 ease-out ${activeService === idx ? 'scale-110' : 'group-hover:scale-105'}`}>
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className={`w-full h-full object-cover transition-all duration-700 ${activeService === idx ? 'grayscale-0' : 'grayscale group-hover:grayscale-[0.5]'}`}
                    referrerPolicy="no-referrer"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent transition-opacity duration-500 ${activeService === idx ? 'opacity-95' : 'opacity-80 group-hover:opacity-85'}`}></div>
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

                  <div className={`space-y-4 transition-transform duration-500 ease-out ${activeService === idx ? 'translate-y-0' : 'translate-y-10 sm:translate-y-12'}`}>
                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[8px] font-black uppercase tracking-widest text-white/80">
                        {service.tag}
                      </span>
                      {activeService !== idx && (
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/40 animate-pulse">Tap for details</span>
                      )}
                    </div>
                    
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">
                      {service.title}
                    </h3>
                    
                    <p className={`text-white/60 font-medium leading-relaxed text-sm transition-opacity duration-500 ${activeService === idx ? 'opacity-100' : 'opacity-0'}`}>
                      {service.desc}
                    </p>

                    <div className={`pt-6 flex items-center justify-between transition-all duration-500 ${activeService === idx ? 'opacity-100' : 'opacity-0'}`}>
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

      {/* Professional FAQ Section */}
      <section id="faq" className="py-32 bg-white relative overflow-hidden">
        {/* Subtle background element */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-50/50 -skew-x-12 translate-x-1/4 z-0"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            {/* Left Side: Context & CTA */}
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center space-x-2 px-4 py-1.5 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest"
                >
                  <span>Knowledge Base</span>
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tighter leading-[0.9]"
                >
                  Common <br/>
                  <span className="text-eln">Questions.</span>
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
                className="bg-gray-900 p-10 rounded-[3rem] text-white space-y-8 shadow-2xl shadow-gray-900/20 relative overflow-hidden group"
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
                  <Link to="/support" className="inline-flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-white hover:text-eln transition-colors group/btn">
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
                      <span className={`font-black text-gray-900 text-lg sm:text-xl tracking-tight transition-colors ${openFaqIndex === index ? 'text-eln' : ''}`}>
                        {faq.question}
                      </span>
                    </div>
                    <div className={`mt-1.5 flex-shrink-0 transition-transform duration-500 ${openFaqIndex === index ? 'rotate-180' : ''}`}>
                      <ChevronDown className={`h-5 w-5 ${openFaqIndex === index ? 'text-eln' : 'text-gray-300'}`} />
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
      <section className="py-24 bg-white text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-6"
        >
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 mb-6">Ready to Scale your Business?</h2>
          <p className="text-gray-500 font-medium text-lg mb-10">
            Join the network of merchants and riders redefining the order-to-doorstep experience.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Link to="/signup" className="block px-12 py-5 bg-eln text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-eln/30 transition-all">
                Join as Merchant
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Link to="/signup" className="block px-12 py-5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                Become a Rider
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="space-y-8">
              <Logo className="h-8" showText={true} variant="white" />
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                The specialized delivery partner for fashion brands and small businesses. We handle your products with the care they deserve.
              </p>
              <div className="flex space-x-4">
                {[
                  { name: 'Twitter', icon: Twitter },
                  { name: 'Instagram', icon: Instagram },
                  { name: 'LinkedIn', icon: Linkedin }
                ].map(social => (
                  <div key={social.name} className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-eln transition-colors cursor-pointer group">
                    <span className="sr-only">{social.name}</span>
                    <social.icon className="h-4 w-4 text-white/40 group-hover:text-white transition-colors" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-8">Platform</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li><Link to="/signup" className="text-gray-400 hover:text-white transition-colors">{t.joinMerchant}</Link></li>
                <li><Link to="/signup" className="text-gray-400 hover:text-white transition-colors">{t.becomeRider}</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">{common.login}</Link></li>
                <li><Link to="/admin-login" className="text-gray-400 hover:text-white transition-colors">{common.admin}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-8">Company</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">{common.about}</Link></li>
                <li><Link to="/support" className="text-gray-400 hover:text-white transition-colors">{common.support}</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">{common.privacy}</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-8">Contact</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li className="text-gray-400">Victoria Island, Lagos</li>
                <li className="text-gray-400">hello@elnexpress.com</li>
                <li className="text-gray-400">+234 800-ELN-SUPPORT</li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.3em]">
              &copy; {new Date().getFullYear()} ELN EXPRESS LIMITED. ALL RIGHTS RESERVED.
            </p>
            <div className="flex space-x-8 text-[10px] font-black uppercase tracking-widest text-gray-500">
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
