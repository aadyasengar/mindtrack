import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, LayoutDashboard, HeartHandshake, LogOut, Plus, Search, FileText, Heart } from 'lucide-react';
import { cn } from '../utils/cn';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: <MessageSquare size={18} />, label: "New Chat", path: "/chat", isAction: true },
    { icon: <LayoutDashboard size={18} />, label: "Dashboard", path: "/dashboard" },
    { icon: <HeartHandshake size={18} />, label: "Self Help", path: "/self-help" },
    { icon: <Search size={18} />, label: "Journal", path: "/journal" },
    { icon: <FileText size={18} />, label: "Report", path: "/report" },
  ];

  return (
    <div className="w-72 h-screen bg-white border-r border-gray-100 p-8 flex flex-col hidden lg:flex">
      <div className="flex items-center gap-2.5 mb-12 px-2">
        <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center shadow-soft">
          <Heart className="text-white w-5 h-5" />
        </div>
        <span className="text-xl font-bold text-gray-800 tracking-tight">MindTrack</span>
      </div>

      <div className="space-y-1.5 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={cn(
              "flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 group",
              item.isAction 
                ? "bg-brand-500 text-white shadow-soft hover:bg-brand-600 mb-8" 
                : location.pathname === item.path 
                  ? "bg-brand-50 text-brand-600 font-medium" 
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50/50"
            )}
          >
            <span className={cn(
              "transition-colors",
              item.isAction ? "text-white" : location.pathname === item.path ? "text-brand-500" : "text-gray-300 group-hover:text-gray-500"
            )}>
              {item.isAction ? <Plus size={18} strokeWidth={2.5} /> : item.icon}
            </span>
            <span className="text-[15px]">{item.label}</span>
          </Link>
        ))}

        <div className="pt-12">
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] mb-6 px-4">Recents</p>
          <div className="space-y-1">
            {['Morning Reflection', 'Stress Management', 'Weekly Review'].map((chat) => (
              <button key={chat} className="w-full text-left px-4 py-2.5 text-[13px] text-gray-400 hover:text-gray-600 hover:bg-gray-50/50 rounded-xl transition-all truncate font-light">
                {chat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all text-sm font-medium">
        <LogOut size={18} />
        <span>Sign Out</span>
      </button>
    </div>
  );
};

export default Sidebar;
