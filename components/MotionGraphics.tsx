
import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

const MotionGraphics: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -400]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Digital Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#034287 1px, transparent 1px), linear-gradient(90deg, #034287 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Floating AR Elements */}
      <motion.div 
        style={{ x: mousePos.x * 1.5, y: mousePos.y * 1.5 }}
        className="absolute top-1/4 left-10 w-32 h-32 border border-eln/20 rounded-full flex items-center justify-center"
      >
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 border-t-2 border-eln/40 rounded-full"
        />
        <div className="absolute text-[8px] font-black text-eln/30 uppercase tracking-widest">Tracking</div>
      </motion.div>

      <motion.div 
        style={{ x: -mousePos.x, y: -mousePos.y + 100 }}
        className="absolute bottom-1/4 right-10 w-48 h-48 border border-eln/10 rounded-lg"
      >
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-eln/40" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-eln/40" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-eln/40" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-eln/40" />
        <div className="absolute inset-4 flex flex-col justify-between">
            <div className="h-1 bg-eln/10 w-full" />
            <div className="h-1 bg-eln/10 w-2/3" />
            <div className="h-1 bg-eln/10 w-full" />
            <div className="h-1 bg-eln/10 w-1/2" />
        </div>
      </motion.div>

      {/* Particle Nodes */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight
          }}
          transition={{ 
            duration: 5 + Math.random() * 5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-1 h-1 bg-eln rounded-full"
        />
      ))}

      {/* HUD Scanning Line */}
      <motion.div 
        animate={{ y: ['0%', '100%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-eln/20 to-transparent"
      />
    </div>
  );
};

export default MotionGraphics;
