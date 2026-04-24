import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import BreathingTool from '../components/BreathingTool';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Frown, Meh, Zap, AlertCircle, ArrowUpRight, Calendar, Loader2, Trophy, Wind, X, CheckCircle2 } from 'lucide-react';
import { mindTrackApi } from '../utils/api';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logging, setLogging] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(true);
  const [streak, setStreak] = useState(4);
  const userId = '123e4567-e89b-12d3-a456-426614174000';

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await mindTrackApi.getMoodAnalytics(userId);
      setAnalytics(data);
    } catch (error) {
      console.error('Analytics error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogMood = async (mood) => {
    setLogging(true);
    try {
      await mindTrackApi.logMood(userId, mood.toLowerCase());
      fetchAnalytics();
      setShowCheckIn(false);
    } catch (error) {
      console.error('Mood log error:', error);
    } finally {
      setLogging(false);
    }
  };

  const moods = [
    { emoji: <Smile className="text-brand-500" />, label: 'Happy', color: 'bg-gray-50' },
    { emoji: <Meh className="text-brand-500" />, label: 'Neutral', color: 'bg-gray-50' },
    { emoji: <Frown className="text-brand-500" />, label: 'Sad', color: 'bg-gray-50' },
    { emoji: <Zap className="text-brand-500" />, label: 'Stressed', color: 'bg-gray-50' },
  ];

  return (
    <div className="flex h-screen bg-soft-cream">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-12">
        <header className="mb-12 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3 tracking-tight">How are you, Aadya?</h1>
            <p className="text-gray-500 font-light leading-relaxed">Here's a quiet look at your wellness journey this week.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-6 py-3 rounded-2xl shadow-soft border border-gray-100 flex items-center gap-3 text-brand-600 font-medium">
              <Trophy size={18} className="text-brand-400" />
              <span className="text-sm">{streak} Day Streak</span>
            </div>
            <button className="bg-white px-6 py-3 rounded-2xl shadow-soft border border-gray-100 flex items-center gap-2 text-gray-500 hover:bg-gray-50 transition-all text-sm">
              <Calendar size={18} />
              <span>This Week</span>
            </button>
          </div>
        </header>

        <AnimatePresence>
          {showCheckIn && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white p-10 rounded-[2.5rem] shadow-soft border border-gray-100 mb-12 relative overflow-hidden"
            >
              <button 
                onClick={() => setShowCheckIn(false)}
                className="absolute top-8 right-8 p-2 text-gray-300 hover:text-gray-400 transition-all"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-500 shadow-soft">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 tracking-tight">Daily Check-In</h2>
                  <p className="text-gray-500 font-light text-sm">A moment to listen to yourself.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {moods.map((m) => (
                  <motion.button
                    key={m.label}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLogMood(m.label)}
                    disabled={logging}
                    className={`${m.color} p-6 rounded-3xl flex flex-col items-center gap-3 transition-all hover:bg-white hover:shadow-soft border border-transparent hover:border-brand-50 disabled:opacity-50`}
                  >
                    <div className="text-2xl opacity-70">{m.emoji}</div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{m.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Chart Section */}
          <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-soft border border-gray-100">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">Mood Patterns</h2>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <div className="w-2 h-2 bg-brand-500 rounded-full" />
                <span>Wellness Level</span>
              </div>
            </div>
            <div className="h-[350px] w-full">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="animate-spin text-brand-200" size={32} />
                </div>
              ) : analytics?.history?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics?.history || []}>
                    <defs>
                      <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8c9dbf" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#8c9dbf" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="created_at" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#cbd5e1', fontSize: 11, fontWeight: 500}}
                      tickFormatter={(str) => new Date(str).toLocaleDateString([], { weekday: 'short' })}
                      dy={15}
                    />
                    <YAxis hide domain={['auto', 'auto']} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)', padding: '12px 20px' }}
                      cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                      labelFormatter={(label) => new Date(label).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    />
                    <Area 
                      type="monotone" 
                      dataKey={(v) => {
                        const map = { happy: 5, neutral: 3, sad: 2, stressed: 1 };
                        return map[v.mood] || 3;
                      }}
                      name="Level"
                      stroke="#8c9dbf" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorMood)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-300">
                  <AlertCircle size={40} className="mb-4 opacity-20" />
                  <p className="text-sm font-light">No records found. Begin by logging your mood.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Tools Column */}
          <div className="space-y-10">
            {/* Quick Insight */}
            <div className="bg-brand-500 p-10 rounded-[2.5rem] text-white shadow-soft relative overflow-hidden">
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                  <AlertCircle className="text-white/80" size={20} />
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">Emotional Insight</h3>
                <p className="text-white/80 mb-10 leading-relaxed font-light text-sm">
                  {loading ? 'Reflecting on your data...' : analytics?.insight || "Continue sharing your journey to see patterns emerge."}
                </p>
                <a 
                  href="/report"
                  className="bg-white/10 text-white border border-white/20 px-6 py-3 rounded-2xl font-medium inline-flex items-center gap-2 hover:bg-white hover:text-brand-600 transition-all text-sm"
                >
                  View Report <ArrowUpRight size={16} />
                </a>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            </div>

            {/* Quick Tools */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-gray-100">
              <div className="flex items-center gap-2 mb-6 text-gray-700 font-bold text-sm tracking-tight">
                <Wind size={18} className="text-brand-400" />
                <span>Breath Guide</span>
              </div>
              <div className="scale-90 origin-top">
                <BreathingTool />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
