import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Plus, Trash2, Calendar, Search, Feather } from 'lucide-react';

const Journal = () => {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('journal_entries');
    return saved ? JSON.parse(saved) : [];
  });
  const [newEntry, setNewEntry] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    localStorage.setItem('journal_entries', JSON.stringify(entries));
  }, [entries]);

  const handleAddEntry = () => {
    if (!newEntry.trim()) return;
    const entry = {
      id: Date.now(),
      text: newEntry,
      date: new Date().toISOString(),
      mood: 'neutral'
    };
    setEntries([entry, ...entries]);
    setNewEntry('');
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const filteredEntries = entries.filter(e => 
    e.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-soft-cream">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-12">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3 tracking-tight">Private Journal</h1>
            <p className="text-gray-500 font-light leading-relaxed">A quiet place for your honest reflections.</p>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
            <input 
              type="text"
              placeholder="Find an entry..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 pr-5 py-3 rounded-2xl border border-gray-100 focus:border-brand-300 outline-none transition-all w-72 bg-white shadow-soft text-sm font-light"
            />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Editor */}
          <div className="lg:col-span-2">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-soft border border-gray-100 mb-8">
              <div className="flex items-center gap-3 mb-8 text-gray-400">
                <Feather size={20} className="text-brand-400" />
                <span className="text-xs font-bold uppercase tracking-widest">New Reflection</span>
              </div>
              <textarea
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                placeholder="What's on your mind today?"
                className="w-full h-72 bg-transparent text-gray-700 text-lg leading-relaxed focus:outline-none resize-none font-light placeholder-gray-300"
              />
              <div className="flex justify-end mt-8">
                <button
                  onClick={handleAddEntry}
                  disabled={!newEntry.trim()}
                  className="bg-brand-500 text-white px-10 py-3.5 rounded-2xl font-medium flex items-center gap-2 hover:bg-brand-600 transition-all disabled:opacity-50 shadow-soft"
                >
                  <Plus size={18} />
                  Save Reflection
                </button>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="space-y-8">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-2">
              <Book size={16} className="text-brand-300" />
              Previous Entries
            </h2>
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredEntries.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 text-gray-300 flex flex-col items-center"
                  >
                    <Book size={40} className="mb-4 opacity-10" />
                    <p className="text-sm font-light italic">Your journey begins here.</p>
                  </motion.div>
                ) : (
                  filteredEntries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white p-6 rounded-3xl shadow-soft border border-gray-50 relative group hover:border-brand-50 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-[10px] text-brand-400 font-bold mb-4 uppercase tracking-[0.2em]">
                        <Calendar size={12} />
                        {new Date(entry.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </div>
                      <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed font-light">
                        {entry.text}
                      </p>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="absolute top-6 right-6 p-2 text-gray-200 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Journal;
