import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageSquare, Shield, Activity, Heart, ArrowRight } from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: <MessageSquare className="w-6 h-6 text-brand-500" />,
      title: "AI-based conversation",
      description: "A gentle, supportive AI that listens without judgment, available whenever you need to talk."
    },
    {
      icon: <Activity className="w-6 h-6 text-brand-500" />,
      title: "Mood tracking",
      description: "Simple, effortless tracking to help you understand your emotional patterns over time."
    },
    {
      icon: <Shield className="w-6 h-6 text-brand-500" />,
      title: "Private & secure",
      description: "Your conversations are private and your data is encrypted. A safe space for your mind."
    },
    {
      icon: <Heart className="w-6 h-6 text-brand-500" />,
      title: "Self-help tools",
      description: "Thoughtfully designed exercises for breathing, journaling, and finding calm."
    }
  ];

  return (
    <div className="min-h-screen bg-soft-cream selection:bg-brand-100 selection:text-brand-700">
      {/* Simple Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-soft-cream/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <Heart className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">MindTrack</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <Link to="/auth" className="hover:text-brand-500 transition-colors">Login</Link>
            <Link to="/chat" className="bg-brand-500 text-white px-6 py-2.5 rounded-xl hover:bg-brand-600 transition-all shadow-soft">
              Start Chat
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-32 px-8">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-[1.1] tracking-tight">
              A calm space to <br />
              <span className="text-brand-500">talk and reflect</span>
            </h1>
            <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              Navigate your emotions with clarity. A private, AI-supported companion designed to help you find balance in your daily life.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/chat" className="w-full sm:w-auto bg-brand-500 text-white px-10 py-4 rounded-2xl text-lg font-medium hover:bg-brand-600 transition-all shadow-soft flex items-center justify-center gap-2 group">
                Start Chat <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Subtle Abstract Shape */}
          <div className="mt-24 relative">
             <div className="absolute inset-0 bg-brand-100/30 blur-[100px] rounded-full -z-10" />
             <div className="glass p-2 rounded-[2.5rem] soft-shadow border border-white/50">
                <img 
                  src="https://images.unsplash.com/photo-1499209974431-9dac36a44404?auto=format&fit=crop&q=80&w=1200" 
                  alt="Calm water" 
                  className="w-full h-[450px] object-cover rounded-[2rem] opacity-90"
                />
             </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-32 px-8 border-t border-gray-100 bg-white/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-start"
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 soft-shadow border border-gray-50">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed font-light text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <Heart className="text-brand-500 w-5 h-5" />
            <span className="text-lg font-bold text-gray-800">MindTrack</span>
          </div>
          <div className="flex gap-10 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-brand-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-brand-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-brand-500 transition-colors">Contact</a>
          </div>
          <p className="text-gray-400 text-sm font-light">© 2026 MindTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
