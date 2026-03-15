import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  Calendar, 
  BarChart3, 
  Settings,
  LogOut,
  CreditCard
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, setIsAuthenticated } = useAppContext();
  
  const allMenuItems = [
    { icon: LayoutDashboard, label: 'الرئيسية', path: '/', roles: ['admin', 'coach', 'player'] },
    { icon: Users, label: 'اللاعبين', path: '/players', roles: ['admin', 'coach'] },
    { icon: CheckSquare, label: 'تسجيل الحضور', path: '/attendance', roles: ['admin', 'coach', 'player'] },
    { icon: CreditCard, label: 'الاشتراكات', path: '/subscriptions', roles: ['admin', 'coach', 'player'] },
    { icon: Calendar, label: 'الجدول الزمني', path: '/schedule', roles: ['admin', 'coach', 'player'] },
    { icon: BarChart3, label: 'التقارير', path: '/reports', roles: ['admin'] },
    { icon: Settings, label: 'الإعدادات', path: '/settings', roles: ['admin'] },
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(user?.role));

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[90] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed right-0 top-0 h-screen w-64 bg-slate-900 border-l border-slate-800 flex flex-col z-[100] transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'} 
        lg:translate-x-0
      `}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-slate-950 font-black">WS</span>
            ويبينار سبورتس
          </h1>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(101,198,220,0.1)]' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }
              `}
            >
              <item.icon size={20} />
              <span className="font-medium text-lg">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium text-lg">تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
