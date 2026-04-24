import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BreathingTool = () => {
  const [phase, setPhase] = useState('Inhale'); // Inhale, Hold, Exhale

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase((prev) => {
        if (prev === 'Inhale') return 'Exhale';
        return 'Inhale';
      });
    }, 4000); // 4 seconds per phase

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-white/50 soft-shadow min-h-[300px]">
      <div className="relative flex items-center justify-center w-64 h-64">
        {/* Outer Glow */}
        <motion.div
          animate={{
            scale: phase === 'Inhale' ? 1.2 : 0.8,
            opacity: phase === 'Inhale' ? 0.3 : 0.1,
          }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className="absolute w-48 h-48 bg-brand-400 rounded-full blur-2xl"
        />
        
        {/* Breathing Circle */}
        <motion.div
          animate={{
            scale: phase === 'Inhale' ? 1.1 : 0.7,
          }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className="w-40 h-40 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center shadow-xl shadow-brand-100"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-white font-medium text-lg"
            >
              {phase}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      </div>
      
      <p className="mt-8 text-gray-500 text-sm font-medium tracking-wide uppercase">
        Focus on your breath
      </p>
    </div>
  );
};

export default BreathingTool;
