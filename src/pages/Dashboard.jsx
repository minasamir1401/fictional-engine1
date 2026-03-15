import React from 'react';
import { 
  Users, 
  CheckCircle2, 
  TrendingUp, 
  Wallet,
  ArrowUpRight,
  Clock,
  AlertCircle
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const data = [
  { name: 'السبت', value: 85 },
  { name: 'الأحد', value: 92 },
  { name: 'الاثنين', value: 78 },
  { name: 'الثلاثاء', value: 88 },
  { name: 'الأربعاء', value: 95 },
  { name: 'الخميس', value: 82 },
];

const Dashboard = () => {
  const { players, trainings, user } = useAppContext();
  const navigate = useNavigate();

  const isPlayer = user?.role === 'player';

  // Dynamic Statistics
  const adminStats = [
    { title: 'إجمالي اللاعبين', value: players.length.toLocaleString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { title: 'التدريبات المجدولة', value: trainings.length.toString(), icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10' },
    { title: 'متوسط الحضور', value: '91.2%', icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
    { title: 'إجمالي الإيرادات', value: '42,500 ج.م', icon: Wallet, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  const playerStats = [
    { title: 'حضوري الشخصي', value: '94%', icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10' },
    { title: 'مباريات قادمة', value: trainings.filter(t => t.type === 'مباراة ودية').length.toString(), icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { title: 'حالة الاشتراك', value: 'نشط', icon: Wallet, color: 'text-primary', bg: 'bg-primary/10' },
    { title: 'أيام متبقية', value: '15 يوم', icon: Clock, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  const stats = isPlayer ? playerStats : adminStats;

  // Get Next 3 Trainings/Matches
  const upcomingEvents = trainings.slice(0, 3);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 overflow-hidden">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl md:text-3xl font-bold">لوحة التحكم الرئيسية</h2>
        <p className="text-xs md:text-sm text-slate-400">مرحباً بك، إليك ملخص اليوم</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-slate-900 border border-slate-800 p-4 md:p-6 rounded-2xl group hover:border-primary/50 transition-all duration-300">
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <div className={`p-2 md:p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} className="md:w-6 md:h-6" />
              </div>
              <span className="text-green-400 flex items-center gap-1 text-[10px] md:text-xs font-medium">
                <ArrowUpRight size={12} />
                +12%
              </span>
            </div>
            <h3 className="text-slate-400 text-xs md:text-sm mb-1">{stat.title}</h3>
            <p className="text-lg md:text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {!isPlayer && (
        <div className="flex flex-col gap-4">
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-4 text-red-500 animate-pulse">
            <AlertCircle size={20} className="shrink-0" />
            <div>
              <p className="font-bold text-xs md:text-sm">تنبيه: اشتراكات منتهية!</p>
              <p className="text-[10px] md:text-xs opacity-80">يرجى مراجعة قسم الاشتراكات.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-4 md:p-8 rounded-3xl overflow-hidden">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h3 className="text-lg md:text-xl font-bold">{isPlayer ? 'بياناتي' : 'تحليلات الحضور'}</h3>
            <select className="bg-slate-800 border-none rounded-lg px-2 py-1 text-[10px] md:text-sm outline-none font-bold">
              <option>آخر 7 أيام</option>
              <option>آخر 30 يوم</option>
            </select>
          </div>
          <div className="h-[200px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#65c6dc" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#65c6dc" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="value" stroke="#65c6dc" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl relative">
          <h3 className="text-lg md:text-xl font-bold mb-6">التدريبات القادمة</h3>
          <div className="space-y-4 md:space-y-6">
            {upcomingEvents.map((event, i) => (
              <div key={i} className="flex items-start gap-3 md:gap-4 group">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-slate-800 text-primary">
                  <Clock size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-slate-100 text-sm md:text-base truncate">{event.title}</h4>
                  <p className="text-[10px] md:text-sm text-slate-400 font-medium truncate">{event.time} - {event.location}</p>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => navigate('/schedule')}
            className="w-full mt-6 md:mt-8 py-3 md:py-4 bg-slate-800 hover:bg-primary hover:text-slate-950 rounded-xl text-xs md:text-sm font-black transition-all"
          >
            عرض الكل
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
