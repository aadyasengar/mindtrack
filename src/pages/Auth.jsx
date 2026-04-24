import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, User, Github, Chrome } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-soft-cream">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
              <Heart className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-gray-800 tracking-tight">MindTrack</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            {isLogin ? 'Welcome back' : 'Join MindTrack'}
          </h2>
          <p className="text-gray-500 mt-3 font-light leading-relaxed">
            {isLogin ? 'Your safe space is waiting for you.' : 'Start your journey to mental wellness today.'}
          </p>
        </div>

        <motion.div 
          layout
          className="bg-white p-10 rounded-[2.5rem] shadow-soft border border-gray-100"
        >
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    type="text" 
                    placeholder="Name" 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50/50 rounded-2xl border border-gray-100 focus:border-brand-500 focus:ring-0 transition-all font-light"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/50 rounded-2xl border border-gray-100 focus:border-brand-500 focus:ring-0 transition-all font-light"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/50 rounded-2xl border border-gray-100 focus:border-brand-500 focus:ring-0 transition-all font-light"
                />
              </div>
            </div>

            <button className="w-full bg-brand-500 text-white py-4 rounded-2xl font-medium text-lg hover:bg-brand-600 transition-all shadow-soft mt-2">
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-400 uppercase tracking-widest font-bold">Or</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all">
                <Chrome size={18} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-600">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all">
                <Github size={18} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-600">Github</span>
              </button>
            </div>
          </form>
        </motion.div>

        <p className="text-center mt-10 text-gray-500 font-light">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-brand-500 font-bold hover:text-brand-600 transition-colors"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
