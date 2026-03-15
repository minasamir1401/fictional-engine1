import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Search, Edit2, Trash2, X, Save } from 'lucide-react';

const Players = () => {
  const { players, user, setPlayers } = useAppContext();
  const [activeTab, setActiveTab] = useState('players'); // 'players' or 'coaches'
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  const isAdmin = user?.role === 'admin';

  // State for coaches (simulated)
  const [allCoaches, setAllCoaches] = useState([
    { id: 101, name: 'كابتن محمود الجوهري', role: 'coach', coachDetails: { sport: 'كرة قدم', specialization: 'تكتيك وفنيات', experienceYears: 15 } },
    { id: 102, name: 'كابتن حسن شحاتة', role: 'coach', coachDetails: { sport: 'كرة قدم', specialization: 'ناشئين', experienceYears: 20 } },
  ]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    role: 'player',
    playerDetails: { number: '', position: 'وسط', age: '', sport: 'كرة قدم' },
    coachDetails: { specialization: 'تكتيك وفنيات', experienceYears: '', sport: 'كرة قدم' }
  });

  const filteredData = activeTab === 'players' 
    ? players.filter(p => p.name.includes(searchTerm) || p.number?.includes(searchTerm))
    : allCoaches.filter(c => c.name.includes(searchTerm));

  const handleOpenModal = (item = null) => {
    if (!isAdmin) return;
    if (item) {
      setEditingUser(item);
      setFormData({
        name: item.name,
        role: item.role || 'player',
        playerDetails: item.playerDetails || { number: item.number || '', position: item.position || '🎯 وسط', age: item.age || '', sport: item.sport || '⚽ كرة قدم' },
        coachDetails: item.coachDetails || { specialization: '🧠 تكتيك وفنيات', experienceYears: '', sport: '⚽ كرة قدم' }
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        role: activeTab === 'players' ? 'player' : 'coach',
        playerDetails: { number: '', position: '🎯 وسط', age: '', sport: '⚽ كرة قدم' },
        coachDetails: { specialization: '🧠 تكتيك وفنيات', experienceYears: '', sport: '⚽ كرة قدم' }
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (formData.role === 'player') {
      const playerData = {
        name: formData.name,
        ...formData.playerDetails,
        role: 'player'
      };
      if (editingUser) {
        setPlayers(players.map(p => p.id === editingUser.id ? { ...p, ...playerData } : p));
      } else {
        setPlayers([...players, { id: Date.now(), ...playerData, status: 'Present' }]);
      }
    } else {
      const coachData = {
        name: formData.name,
        coachDetails: formData.coachDetails,
        role: 'coach'
      };
      if (editingUser) {
        setAllCoaches(allCoaches.map(c => c.id === editingUser.id ? { ...c, ...coachData } : c));
      } else {
        setAllCoaches([...allCoaches, { id: Date.now(), ...coachData }]);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl md:text-3xl font-bold">{isAdmin ? 'إدارة الكوادر' : 'قائمة الفريق'}</h2>
          <p className="text-xs md:text-sm text-slate-400">بيانات اللاعبين والمدربين</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => handleOpenModal()}
            className="w-full sm:w-auto bg-primary text-slate-950 px-4 py-2.5 md:px-6 md:py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all text-sm"
          >
            <Plus size={18} />
            إضافة {activeTab === 'players' ? 'لاعب' : 'مدرب'}
          </button>
        )}
      </div>

      <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-full sm:w-fit">
        <button 
          onClick={() => setActiveTab('players')}
          className={`flex-1 sm:flex-none px-4 sm:px-8 py-2 rounded-xl font-black text-xs md:text-sm transition-all ${activeTab === 'players' ? 'bg-primary text-slate-950' : 'text-slate-400'}`}
        >
          اللاعبين
        </button>
        <button 
          onClick={() => setActiveTab('coaches')}
          className={`flex-1 sm:flex-none px-4 sm:px-8 py-2 rounded-xl font-black text-xs md:text-sm transition-all ${activeTab === 'coaches' ? 'bg-primary text-slate-950' : 'text-slate-400'}`}
        >
          المدربين
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 md:p-6 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center bg-slate-900/50 gap-4">
          <div className="flex items-center gap-4 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700 w-full md:w-80">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="بحث بالاسم..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-100 placeholder:text-slate-500 w-full text-xs md:text-sm font-bold"
            />
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-slate-800">
          {filteredData.map((item) => (
            <div key={item.id} className="p-4 space-y-3 group active:bg-slate-800/50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-primary">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-100 text-sm">{item.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {activeTab === 'players' ? (item.position || 'غير محدد') : item.coachDetails?.sport}
                    </p>
                  </div>
                </div>
                {isAdmin && (
                  <button onClick={() => handleOpenModal(item)} className="p-2 bg-slate-800 text-primary rounded-lg">
                    <Edit2 size={14} />
                  </button>
                )}
              </div>
              <div className="flex justify-between items-center pt-1">
                <div className="flex gap-4">
                   <div className="text-center">
                      <p className="text-[9px] text-slate-500 font-bold uppercase">{activeTab === 'players' ? 'الرقم' : 'الخبرة'}</p>
                      <p className="text-xs font-black text-primary">
                        {activeTab === 'players' ? (item.number || '00') : `${item.coachDetails?.experienceYears || '0'}س`}
                      </p>
                   </div>
                   <div className="text-center">
                      <p className="text-[9px] text-slate-500 font-bold uppercase">{activeTab === 'players' ? 'العمر' : 'التخصص'}</p>
                      <p className="text-xs font-bold text-slate-300">
                        {activeTab === 'players' ? `${item.age || '-'} سنة` : item.coachDetails?.specialization}
                      </p>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <table className="hidden lg:table w-full text-right">
          <thead className="bg-slate-800/30 text-slate-400 text-sm uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold">الاسم</th>
              <th className="px-6 py-4 font-semibold text-center">{activeTab === 'players' ? 'الرقم' : 'التخصص'}</th>
              <th className="px-6 py-4 font-semibold">{activeTab === 'players' ? 'المركز' : 'الرياضة'}</th>
              <th className="px-6 py-4 font-semibold text-center">{activeTab === 'players' ? 'العمر' : 'الخبرة'}</th>
              {isAdmin && <th className="px-6 py-4 font-semibold text-left">إجراءات</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-primary">
                      {item.name.charAt(0)}
                    </div>
                    <span className="font-bold">{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center font-bold text-slate-300">
                  {activeTab === 'players' ? (item.number || '00') : item.coachDetails?.specialization}
                </td>
                <td className="px-6 py-4 text-slate-400 font-medium">
                  {activeTab === 'players' ? (item.position || 'غير محدد') : item.coachDetails?.sport}
                </td>
                <td className="px-6 py-4 text-center font-medium">
                  {activeTab === 'players' ? `${item.age || '-'} سنة` : `${item.coachDetails?.experienceYears || '0'} سنوات`}
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 text-left">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal(item)} className="p-2 bg-slate-800 hover:bg-primary hover:text-slate-950 rounded-lg text-primary transition-all">
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h3 className="text-xl font-bold text-primary">إدارة {formData.role === 'player' ? 'لاعب' : 'مدرب'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400">الاسم الكامل</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 outline-none focus:border-primary/50 transition-all font-bold"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              {formData.role === 'player' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-400">نوع الرياضة</label>
                      <select 
                        value={formData.playerDetails.sport}
                        onChange={(e) => setFormData({...formData, playerDetails: {...formData.playerDetails, sport: e.target.value}})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 outline-none"
                      >
                        <option value="⚽ كرة قدم">⚽ كرة قدم</option>
                        <option value="🏀 كرة سلة">🏀 كرة سلة</option>
                        <option value="🤾 كرة يد">🤾 كرة يد</option>
                        <option value="🎾 تنس">🎾 تنس</option>
                        <option value="💪 لياقة">💪 لياقة</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-400">رقم القميص</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-center text-primary font-black"
                        value={formData.playerDetails.number}
                        onChange={(e) => setFormData({...formData, playerDetails: {...formData.playerDetails, number: e.target.value}})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-400">المركز</label>
                      <select 
                        value={formData.playerDetails.position}
                        onChange={(e) => setFormData({...formData, playerDetails: {...formData.playerDetails, position: e.target.value}})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 outline-none"
                      >
                        <option value="🧤 حارس مرمى">🧤 حارس مرمى</option>
                        <option value="🛡️ دفاع">🛡️ دفاع</option>
                        <option value="🎯 وسط">🎯 وسط</option>
                        <option value="🔥 هجوم">🔥 هجوم</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-400">العمر</label>
                      <input 
                        type="number" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-center"
                        value={formData.playerDetails.age}
                        onChange={(e) => setFormData({...formData, playerDetails: {...formData.playerDetails, age: e.target.value}})}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400">الرياضة التي يدربها</label>
                    <select 
                      value={formData.coachDetails.sport}
                      onChange={(e) => setFormData({...formData, coachDetails: {...formData.coachDetails, sport: e.target.value}})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 outline-none"
                    >
                      <option value="⚽ كرة قدم">⚽ كرة قدم</option>
                      <option value="🏀 كرة سلة">🏀 كرة سلة</option>
                      <option value="🤾 كرة يد">🤾 كرة يد</option>
                      <option value="💪 كمال أجسام">💪 كمال أجسام</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-400">تخصص التدريب</label>
                      <select 
                        value={formData.coachDetails.specialization}
                        onChange={(e) => setFormData({...formData, coachDetails: {...formData.coachDetails, specialization: e.target.value}})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 outline-none"
                      >
                        <option value="🧠 تكتيك وفنيات">🧠 تكتيك وفنيات</option>
                        <option value="🏃 لياقة بدنية">🏃 لياقة بدنية</option>
                        <option value="📈 تطوير مهارات">📈 تطوير مهارات</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-400">سنوات الخبرة</label>
                      <input 
                        type="number" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-center"
                        value={formData.coachDetails.experienceYears}
                        onChange={(e) => setFormData({...formData, coachDetails: {...formData.coachDetails, experienceYears: e.target.value}})}
                      />
                    </div>
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                className="w-full bg-primary text-slate-950 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Save size={20} />
                تأكيد وحفظ البيانات
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Players;
