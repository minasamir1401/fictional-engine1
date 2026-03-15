import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Menu } from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col lg:flex-row-reverse" dir="rtl">
      {/* Mobile Header */}
      <div className="lg:hidden bg-slate-900 border-b border-slate-800 p-3 flex items-center justify-between sticky top-0 z-[80]">
        <h1 className="text-lg sm:text-xl font-bold text-primary flex items-center gap-2 truncate">
          <span className="shrink-0 w-6 h-6 bg-primary rounded flex items-center justify-center text-slate-950 font-black text-xs">WS</span>
          <span className="truncate">ويبينار سبورتس</span>
        </h1>
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 shrink-0"
        >
          <Menu size={20} />
        </button>
      </div>

      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <main className="flex-1 lg:mr-64 transition-all duration-300">
        <div className="hidden lg:block">
          <Navbar />
        </div>
        <div className="p-4 md:p-8 max-w-[100vw] overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
