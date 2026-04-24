import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Menu, X, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center soft-shadow">
              <Heart className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-gray-800 tracking-tight">MindTrack</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/chat" className="text-gray-600 hover:text-brand-600 transition-colors">AI Chat</Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-brand-600 transition-colors">Dashboard</Link>
            <Link to="/self-help" className="text-gray-600 hover:text-brand-600 transition-colors">Self Help</Link>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-600"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link to="/auth" className="bg-brand-500 text-white px-6 py-2 rounded-xl hover:bg-brand-600 transition-all hover:shadow-lg hover:shadow-brand-200">
              Get Started
            </Link>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass border-b border-white/20 p-4 space-y-4"
        >
          <Link to="/chat" className="block text-gray-600 px-4 py-2">AI Chat</Link>
          <Link to="/dashboard" className="block text-gray-600 px-4 py-2">Dashboard</Link>
          <Link to="/self-help" className="block text-gray-600 px-4 py-2">Self Help</Link>
          <Link to="/auth" className="block bg-brand-500 text-white px-4 py-2 rounded-xl text-center">
            Get Started
          </Link>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
