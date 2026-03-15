import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  CreditCard, 
  Plus, 
  RefreshCw, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  Calendar,
  Search,
  X,
  Save
} from 'lucide-react';

const Subscriptions = () => {
  const { players, user } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const isPlayer = user?.role === 'player';
  
  // Mock Subscriptions Data
  const [subscriptions, setSubscriptions] = useState([
    { 
      id: 1, 
      playerName: 'سالم الدوسري', 
      plan: 'Monthly', 
      price: 300, 
      startDate: '2026-03-01', 
      endDate: '2026-04-01', 
      paymentStatus: 'Paid', 
      status: 'Active' 
    },
    { 
      id: 2, 
      playerName: 'محمد علي', 
      plan: '3 Months', 
      price: 800, 
      startDate: '2026-01-15', 
      endDate: '2026-04-15', 
      paymentStatus: 'Paid', 
      status: 'Active' 
    },
    { 
      id: 3, 
      playerName: 'خالد يوسف', 
      plan: 'Monthly', 
      price: 300, 
      startDate: '2026-02-10', 
      endDate: '2026-03-10', 
      paymentStatus: 'Unpaid', 
      status: 'Expired' 
    }
  ]);

  const [formData, setFormData] = useState({
    playerName: '',
    plan: 'Monthly',
    price: 300,
    startDate: new Date().toISOString().split('T')[0],
    paymentStatus: 'Paid'
  });

  const plans = {
    'Monthly': { price: 300, months: 1 },
    '3 Months': { price: 800, months: 3 },
    '6 Months': { price: 1500, months: 6 },
    'Yearly': { price: 2800, months: 12 }
  };

  const handlePlanChange = (plan) => {
    setFormData({ ...formData, plan, price: plans[plan].price });
  };

  const calculateEndDate = (start, plan) => {
    const date = new Date(start);
    date.setMonth(date.getMonth() + plans[plan].months);
    return date.toISOString().split('T')[0];
  };

  const handleAddSubscription = (e) => {
    e.preventDefault();
    const newSub = {
      id: Date.now(),
      ...formData,
      endDate: calculateEndDate(formData.startDate, formData.plan),
      status: 'Active'
    };
    setSubscriptions([newSub, ...subscriptions]);
    setIsModalOpen(false);
  };

  const handleRenew = (id) => {
    setSubscriptions(subscriptions.map(sub => {
      if (sub.id === id) {
        const newStart = new Date().toISOString().split('T')[0];
        return {
          ...sub,
          startDate: newStart,
          endDate: calculateEndDate(newStart, sub.plan),
          status: 'Active',
          paymentStatus: 'Paid'
        };
      }
      return sub;
    }));
    alert('تم تجديد الاشتراك بنجاح!');
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400';
  };

  const getPaymentColor = (payment) => {
    return payment === 'Paid' ? 'text-green-400' : 'text-orange-400';
  };

  const filteredSubs = subscriptions.filter(s => {
    const matchesSearch = s.playerName.includes(searchTerm);
    if (isPlayer) return matchesSearch && s.playerName === user.name;
    return matchesSearch;
  });

  const totalRevenue = filteredSubs.reduce((acc, curr) => acc + (curr.paymentStatus === 'Paid' ? curr.price : 0), 0);
  const expiringSoonCount = filteredSubs.filter(s => s.status === 'Active' && new Date(s.endDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length;
  const expiredCount = filteredSubs.filter(s => s.status === 'Expired').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl md:text-3xl font-bold">{isPlayer ? 'اشتراكاتي' : 'إدارة الاشتراكات'}</h2>
          <p className="text-xs md:text-sm text-slate-400">تابع الحالة المالية والاشتراكات</p>
        </div>
        {!isPlayer && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-primary text-slate-950 px-4 py-2.5 md:px-6 md:py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all text-sm"
          >
            <Plus size={18} />
            إضافة اشتراك
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
          <div className="p-2 bg-primary/10 text-primary rounded-xl">
            <CreditCard size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400">{isPlayer ? 'إجمالي المدفوعات' : 'إجمالي الإيرادات'}</p>
            <p className="text-lg font-bold">{totalRevenue.toLocaleString()} ج.م</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
          <div className="p-2 bg-orange-500/10 text-orange-400">
            <AlertCircle size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400">{isPlayer ? 'أيام متبقية' : 'تنتهي قريباً'}</p>
            <p className="text-lg font-bold">{isPlayer ? '15 يوم' : expiringSoonCount + ' لاعبين'}</p>
          </div>
        </div>
        <div className="hidden sm:flex bg-slate-900 border border-slate-800 p-4 rounded-2xl items-center gap-4">
          <div className="p-2 bg-red-500/10 text-red-400">
            <XCircle size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400">الحالة</p>
            <p className="text-lg font-bold">{expiredCount > 0 ? 'منتهي' : 'نشط'}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 md:p-6 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center bg-slate-900/50 gap-4">
          <div className="flex items-center gap-4 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700 w-full md:w-80">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="بحث باسم اللاعب..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-100 placeholder:text-slate-500 w-full text-xs md:text-sm font-bold"
            />
          </div>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden divide-y divide-slate-800">
          {filteredSubs.map((sub) => (
            <div key={sub.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-slate-100 text-sm">{sub.playerName}</p>
                  <p className="text-[10px] text-slate-400">{sub.plan} - {sub.price} ج.م</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[8px] font-black border ${getStatusColor(sub.status)} border-current/20`}>
                  {sub.status === 'Active' ? 'نشط' : 'منتهي'}
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <div className="flex gap-4">
                  <div>
                    <span className="text-slate-500 block">البداية</span>
                    <span className="text-slate-300 font-bold">{sub.startDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">النهاية</span>
                    <span className="text-primary font-black">{sub.endDate}</span>
                  </div>
                </div>
                <span className={`font-black ${getPaymentColor(sub.paymentStatus)}`}>
                  {sub.paymentStatus === 'Paid' ? 'تم الدفع' : 'معلق'}
                </span>
              </div>
              {!isPlayer && (
                <button 
                  onClick={() => handleRenew(sub.id)}
                  className="w-full py-2 bg-primary/10 text-primary hover:bg-primary hover:text-slate-950 rounded-lg text-[10px] font-bold transition-all"
                >
                  تجديد الاشتراك
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <table className="hidden lg:table w-full text-right">
          <thead className="bg-slate-800/30 text-slate-400 text-sm uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold">اللاعب</th>
              <th className="px-6 py-4 font-semibold">نوع الخطة</th>
              <th className="px-6 py-4 font-semibold text-center">البداية</th>
              <th className="px-6 py-4 font-semibold text-center">النهاية</th>
              <th className="px-6 py-4 font-semibold text-center">الدفع</th>
              <th className="px-6 py-4 font-semibold text-center">الحالة</th>
              <th className="px-6 py-4 font-semibold text-left">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredSubs.map((sub) => (
              <tr key={sub.id} className="hover:bg-slate-800/50 transition-colors group">
                <td className="px-6 py-4 font-bold text-slate-100">{sub.playerName}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold">{sub.plan}</span>
                    <span className="text-xs text-slate-500">{sub.price} ج.م</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center text-slate-400 text-sm">{sub.startDate}</td>
                <td className="px-6 py-4 text-center text-slate-300 text-sm font-mono font-bold">{sub.endDate}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`flex items-center justify-center gap-1 font-black ${getPaymentColor(sub.paymentStatus)}`}>
                    {sub.paymentStatus === 'Paid' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                    {sub.paymentStatus === 'Paid' ? 'مدفوع' : 'غير مدفوع'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusColor(sub.status)} border-current/20`}>
                    {sub.status === 'Active' ? 'نشط' : 'منتهي'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {!isPlayer && (
                      <button 
                        onClick={() => handleRenew(sub.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-slate-950 rounded-lg text-xs font-bold transition-all"
                      >
                        <RefreshCw size={14} />
                        تجديد
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Subscription Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h3 className="text-xl font-bold text-primary">إضافة اشتراك جديد</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddSubscription} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 mr-1">اختر اللاعب</label>
                <select 
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 outline-none focus:border-primary/50 transition-all appearance-none font-bold"
                  value={formData.playerName}
                  onChange={(e) => setFormData({...formData, playerName: e.target.value})}
                >
                  <option value="">-- اختر لاعباً --</option>
                  {players.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 mr-1">الخطة</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 outline-none focus:border-primary/50 transition-all appearance-none font-bold"
                    value={formData.plan}
                    onChange={(e) => handlePlanChange(e.target.value)}
                  >
                    {Object.keys(plans).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 mr-1">السعر (ج.م)</label>
                  <input 
                    type="text" 
                    readOnly
                    className="w-full bg-slate-800/50 border border-slate-800 rounded-xl px-4 py-3 text-primary font-black outline-none text-center"
                    value={formData.price}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 mr-1">تاريخ البدء</label>
                  <input 
                    type="date" 
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 outline-none focus:border-primary/50 transition-all font-bold"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 mr-1">حالة الدفع</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 outline-none focus:border-primary/50 transition-all appearance-none font-bold"
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData({...formData, paymentStatus: e.target.value})}
                  >
                    <option value="Paid">مدفوع</option>
                    <option value="Unpaid">غير مدفوع</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-primary text-slate-950 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
              >
                <Save size={20} />
                تثبيت الاشتراك
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
