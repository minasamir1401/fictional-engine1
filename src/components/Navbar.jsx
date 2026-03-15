import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Navbar = () => {
  const { user } = useAppContext();

  return (
    <header className="hidden lg:flex h-20 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-8 items-center justify-between">
      <div className="flex items-center gap-4 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700 w-96">
        <Search size={18} className="text-slate-400" />
        <input 
          type="text" 
          placeholder="بحث عن لاعب، تدريب، أو تقرير..." 
          className="bg-transparent border-none outline-none text-slate-100 placeholder:text-slate-500 w-full text-sm"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-primary transition-colors">
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
        </button>
        
        <div className="flex items-center gap-3 pr-6 border-r border-slate-700">
          <div className="text-right">
            <h4 className="text-sm font-semibold text-slate-100">{user.name}</h4>
            <p className="text-xs text-slate-400">{user.role}</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-slate-950">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
