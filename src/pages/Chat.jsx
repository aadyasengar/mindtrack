import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Send, Mic, Sparkles, Smile, Info, Moon, Sun, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mindTrackApi } from '../utils/api';

const Chat = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello. I'm your MindTrack companion. How are you feeling today? I'm here to listen and support you in this quiet space." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [detectedMood, setDetectedMood] = useState('neutral');
  const [calmMode, setCalmMode] = useState(false);
  const scrollRef = useRef(null);
  
  const userId = '123e4567-e89b-12d3-a456-426614174000';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const analyzeSentiment = (text) => {
    const lowerText = text.toLowerCase();
    if (/anxious|tired|overwhelmed|stressed|pressure/.test(lowerText)) return 'stressed';
    if (/low|unhappy|lonely|sad|cry/.test(lowerText)) return 'sad';
    if (/happy|good|excited|great|wonderful/.test(lowerText)) return 'positive';
    return 'neutral';
  };

  const handleSend = async (customText) => {
    const messageText = typeof customText === 'string' ? customText : input;
    if (!messageText.trim()) return;

    const userMood = analyzeSentiment(messageText);
    if (userMood !== 'neutral') setDetectedMood(userMood);

    const userMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const data = await mindTrackApi.sendMessage(userId, messageText);
      const aiResponse = { role: 'ai', content: data.response };
      setMessages(prev => [...prev, aiResponse]);
      if (data.mood) setDetectedMood(data.mood);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { role: 'ai', content: "I'm having a bit of trouble connecting right now. Please try again in a moment." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    { label: "I feel anxious", color: "bg-gray-50 text-gray-500 border-gray-100" },
    { label: "I feel low", color: "bg-gray-50 text-gray-500 border-gray-100" },
    { label: "I can't focus", color: "bg-gray-50 text-gray-500 border-gray-100" },
    { label: "I need motivation", color: "bg-gray-50 text-gray-500 border-gray-100" },
  ];

  return (
    <div className={`flex h-screen transition-colors duration-700 ${calmMode ? 'bg-[#1a1c23]' : 'bg-soft-cream'}`}>
      <Sidebar />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Chat Header */}
        <header className={`h-20 border-b flex items-center justify-between px-12 z-10 transition-colors duration-700 ${calmMode ? 'bg-[#1a1c23]/80 border-white/5 text-white' : 'bg-white/80 border-gray-100 text-gray-800'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full animate-pulse ${calmMode ? 'bg-brand-400' : 'bg-brand-500'}`} />
            <h2 className="font-bold tracking-tight text-lg">MindTrack AI</h2>
          </div>
          <div className="flex items-center gap-6">
             <div className={`${calmMode ? 'bg-white/5 text-white/60' : 'bg-brand-50 text-brand-600'} px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all shadow-soft`}>
               <Smile size={16} />
               <span>
                 {detectedMood === 'stressed' && "Stress Detected"}
                 {detectedMood === 'sad' && "Support Mode"}
                 {detectedMood === 'positive' && "Positive Energy"}
                 {detectedMood === 'neutral' && "Quiet Reflection"}
               </span>
             </div>
             <button 
               onClick={() => setCalmMode(!calmMode)}
               className={`p-2.5 rounded-xl transition-all shadow-soft border ${calmMode ? 'bg-brand-500 border-transparent text-white' : 'bg-white border-gray-100 text-gray-400'}`}
               title="Toggle Calm Mode"
             >
               {calmMode ? <Sun size={18} /> : <Moon size={18} />}
             </button>
          </div>
        </header>

        {/* Chat Area - Centered Layout */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto scroll-smooth"
        >
          <div className="max-w-3xl mx-auto p-12 space-y-10">
            {messages.length > 5 && (
              <div className="flex justify-center">
                <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full ${calmMode ? 'bg-white/5 text-white/30' : 'bg-gray-100 text-gray-400'}`}>
                  Based on your previous chats
                </span>
              </div>
            )}
            
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] flex gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center transition-colors duration-700 ${msg.role === 'user' ? 'bg-brand-500 shadow-soft' : (calmMode ? 'bg-white/5' : 'bg-white border border-gray-100 shadow-soft')}`}>
                      {msg.role === 'user' ? <div className="text-white text-[10px] font-bold">ME</div> : <Sparkles className="text-brand-500 w-4 h-4" />}
                    </div>
                    <div className={`p-6 rounded-3xl leading-relaxed transition-all duration-700 text-sm font-light ${
                      msg.role === 'user' 
                        ? 'bg-brand-500 text-white rounded-tr-none shadow-medium' 
                        : (calmMode ? 'bg-[#252833] text-gray-300 border border-white/5 rounded-tl-none' : 'bg-white text-gray-600 rounded-tl-none shadow-soft border border-gray-50')
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                 <div className={`${calmMode ? 'bg-[#252833]' : 'bg-white shadow-soft'} p-4 rounded-2xl flex gap-1.5 border border-transparent ${calmMode ? 'border-white/5' : 'border-gray-50'}`}>
                   <div className="w-1.5 h-1.5 bg-brand-200 rounded-full animate-bounce" />
                   <div className="w-1.5 h-1.5 bg-brand-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                   <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                 </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <footer className="p-12">
          <div className="max-w-3xl mx-auto">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 mb-8">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleSend(action.label)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest border transition-all hover:bg-white hover:shadow-soft active:scale-95 ${calmMode ? 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10' : 'bg-gray-50 text-gray-400 border-gray-100'}`}
                >
                  {action.label}
                </button>
              ))}
            </div>

            <div className={`p-2 rounded-[2rem] shadow-medium border transition-all duration-700 flex items-center gap-2 ${calmMode ? 'bg-[#252833] border-white/5' : 'bg-white border-gray-100'}`}>
              <button className="p-4 text-gray-300 hover:text-brand-500 transition-all">
                <Mic size={22} />
              </button>
              <input 
                type="text" 
                placeholder="Share your thoughts..." 
                className={`flex-1 bg-transparent border-none focus:ring-0 p-4 text-base font-light ${calmMode ? 'text-white placeholder-white/20' : 'text-gray-700 placeholder-gray-300'}`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className={`p-4 rounded-2xl transition-all ${
                  input.trim() 
                    ? 'bg-brand-500 text-white shadow-soft' 
                    : 'bg-gray-50 text-gray-200'
                }`}
              >
                <Send size={22} />
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-6 font-bold uppercase tracking-widest opacity-40">
              MindTrack Companion • AI-Powered Emotional Support
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Chat;
