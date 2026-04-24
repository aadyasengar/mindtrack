import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, BookOpen, Sun, Play, Pause, Compass, HelpCircle } from 'lucide-react';
import { mindTrackApi } from '../utils/api';

const SelfHelp = () => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathText, setBreathText] = useState('Ready?');
  const [resources, setResources] = useState(null);

  useEffect(() => {
    mindTrackApi.getSelfHelp().then(setResources);
  }, []);

  const startBreathing = () => {
    setIsBreathing(true);
    let count = 0;
    const sequence = ['Inhale...', 'Hold...', 'Exhale...', 'Rest...'];
    
    const interval = setInterval(() => {
      setBreathText(sequence[count % 4]);
      count++;
    }, 4000);

    return () => clearInterval(interval);
  };

  return (
    <div className="flex h-screen bg-soft-cream">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-10">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 tracking-tight">Self-Help Resources</h1>
          <p className="text-gray-500 font-light">Thoughtfully curated tools to help you find balance and calm.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Breathing Exercise */}
          <div className="bg-white p-12 rounded-[2.5rem] shadow-soft border border-gray-100 flex flex-col items-center justify-center text-center relative overflow-hidden h-[600px]">
            <div className="relative z-10 w-full">
              <div className="flex items-center justify-center gap-2 mb-8 text-brand-500">
                <Compass size={24} />
                <h2 className="text-xl font-bold tracking-tight">Box Breathing</h2>
              </div>
              
              <div className="relative flex items-center justify-center mb-16 h-64">
                <AnimatePresence>
                  {isBreathing && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ 
                        scale: [1, 1.4, 1.4, 1],
                        opacity: [0.3, 0.6, 0.6, 0.3]
                      }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 16,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-48 h-48 bg-brand-100 rounded-full blur-3xl absolute"
                    />
                  )}
                </AnimatePresence>
                
                <motion.div
                  animate={isBreathing ? {
                    scale: [1, 1.3, 1.3, 1],
                  } : {}}
                  transition={{
                    duration: 16,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-40 h-40 border border-brand-200 rounded-full flex items-center justify-center relative bg-white shadow-soft"
                >
                  <span className="text-brand-600 font-medium text-lg">{isBreathing ? breathText : 'Ready?'}</span>
                </motion.div>
              </div>

              <button 
                onClick={() => setIsBreathing(!isBreathing)}
                className={`px-12 py-4 rounded-2xl font-medium transition-all flex items-center gap-3 mx-auto ${
                  isBreathing ? 'bg-gray-50 text-gray-400 border border-gray-100' : 'bg-brand-500 text-white shadow-soft hover:bg-brand-600'
                }`}
              >
                {isBreathing ? <Pause size={20} /> : <Play size={20} />}
                {isBreathing ? 'Stop Session' : 'Begin Exercise'}
              </button>
            </div>
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50/20 rounded-full blur-3xl -mr-32 -mt-32" />
          </div>

          {/* Resources Column */}
          <div className="space-y-8">
            {/* Journaling Section */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-500">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Daily Prompts</h3>
              </div>
              <div className="space-y-4">
                {resources?.journaling.map((prompt, i) => (
                  <div key={i} className="p-5 bg-gray-50/50 rounded-2xl text-gray-600 border border-gray-100 font-light text-sm leading-relaxed hover:bg-white transition-colors cursor-default">
                    {prompt}
                  </div>
                ))}
                {!resources && <div className="text-gray-300 text-sm italic">Loading prompts...</div>}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-500">
                  <Sun size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Calming Tips</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {resources?.tips.map((tip, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl text-gray-600 text-sm font-light">
                    <div className="w-1.5 h-1.5 bg-brand-300 rounded-full" />
                    {tip}
                  </div>
                ))}
                {!resources && <div className="text-gray-300 text-sm italic">Loading tips...</div>}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SelfHelp;
