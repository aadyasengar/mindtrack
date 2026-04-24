import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Smile, Mic, Send } from 'lucide-react';
import Landing from './pages/Landing';
import Chat from './pages/Chat';
import Dashboard from './pages/Dashboard';
import SelfHelp from './pages/SelfHelp';
import Auth from './pages/Auth';
import Journal from './pages/Journal';
import Report from './pages/Report';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-soft-cream">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/self-help" element={<SelfHelp />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/report" element={<Report />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
