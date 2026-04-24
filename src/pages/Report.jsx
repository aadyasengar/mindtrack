import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { FileText, Download, Sparkles, TrendingUp, Calendar, Info } from 'lucide-react';
import { mindTrackApi } from '../utils/api';

const Report = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = '123e4567-e89b-12d3-a456-426614174000';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await mindTrackApi.getMoodAnalytics(userId);
      setAnalytics(data);
    } catch (error) {
      console.error('Report error:', error);
    } finally {
      setLoading(false);
    }
  };

  const moodData = analytics?.history ? Object.entries(
    analytics.history.reduce((acc, curr) => {
      acc[curr.mood] = (acc[curr.mood] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value })) : [];

  const COLORS = {
    happy: '#8c9dbf',
    neutral: '#cbd5e1',
    sad: '#94a3b8',
    stressed: '#7171a6'
  };

  return (
    <div className="flex h-screen bg-soft-cream">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-12">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3 tracking-tight">Wellness Report</h1>
            <p className="text-gray-500 font-light leading-relaxed">A detailed analysis of your emotional patterns this week.</p>
          </div>
          <button className="bg-white text-gray-500 px-6 py-3 rounded-2xl font-medium border border-gray-100 shadow-soft flex items-center gap-2 hover:bg-gray-50 transition-all text-sm">
            <Download size={18} />
            Export PDF
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
          {/* Mood Distribution */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-soft border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
                <TrendingUp size={20} className="text-brand-400" />
                Mood Balance
              </h2>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={moodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {moodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#cbd5e1'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)', padding: '12px 20px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-6">
              {Object.entries(COLORS).map(([name, color]) => (
                <div key={name} className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-soft border border-gray-100 flex flex-col">
            <div className="flex items-center gap-2 mb-10 text-brand-500">
              <div className="p-3 bg-brand-50 rounded-2xl shadow-soft">
                <Sparkles size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">AI Reflection</h2>
            </div>
            <div className="bg-brand-50/30 p-8 rounded-3xl mb-8 flex-1 border border-brand-50">
              <p className="text-gray-600 leading-relaxed italic font-light">
                "{analytics?.insight || "Your records show a consistent path towards mindfulness. Reflecting on your progress is a vital part of growth."}"
              </p>
            </div>
            <div className="flex items-center gap-6 text-[11px] font-bold text-gray-300 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                Last 7 Days
              </div>
              <div className="flex items-center gap-2">
                <Info size={14} />
                {analytics?.count || 0} Data Points
              </div>
            </div>
          </div>
        </div>

        {/* Daily Breakdown */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-soft border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-10 tracking-tight">Daily Breakdown</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.history || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="created_at" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{fill: '#cbd5e1', fontSize: 11, fontWeight: 500}}
                  tickFormatter={(str) => new Date(str).toLocaleDateString([], { weekday: 'short' })}
                  dy={15}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)', padding: '12px 20px' }}
                />
                <Bar 
                  dataKey={(v) => {
                    const map = { happy: 5, neutral: 3, sad: 2, stressed: 1 };
                    return map[v.mood] || 3;
                  }} 
                  radius={[8, 8, 8, 8]}
                  fill="#8c9dbf"
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Report;
