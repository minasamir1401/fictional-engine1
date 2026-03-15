import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Filter, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  X,
  Save,
  Trash2
} from 'lucide-react';

const Schedule = () => {
  const { trainings, user, fetchTrainings } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState(null);
  const [filter, setFilter] = useState('الكل');

  const canManage = user?.role === 'coach' || user?.role === 'admin';
  
  const [formData, setFormData] = useState({
    title: '',
    time: '04:00 م',
    location: 'ملعب رقم 1',
    date: new Date().toISOString().split('T')[0],
    type: 'تدريب تكتيكي'
  });

  const filteredTrainings = trainings.filter(t => {
    if (filter === 'الكل') return true;
    return t.type === filter;
  });

  const stats = {
    scheduled: trainings.length,
    friendly: trainings.filter(t => t.type === 'مباراة ودية').length
  };

  const handleOpenModal = (training = null) => {
    if (!canManage) return; // Player cannot open modal
    if (training) {
      setEditingTraining(training);
      setFormData({
        title: training.title,
        time: training.time,
        location: training.location,
        date: training.date,
        type: training.type || 'تدريب'
      });
    } else {
      setEditingTraining(null);
      setFormData({
        title: '',
        time: '04:00 م',
        location: 'ملعب رقم 1',
        date: new Date().toISOString().split('T')[0],
        type: 'تدريب'
      });
    }
    setIsModalOpen(true);
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = editingTraining 
        ? `${API_URL}/api/trainings/${editingTraining._id}` 
        : `${API_URL}/api/trainings`;
      
      const method = editingTraining ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchTrainings(); // Refresh from server
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error saving training:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الموعد؟')) {
      try {
        const response = await fetch(`${API_URL}/api/trainings/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchTrainings();
        }
      } catch (error) {
        console.error('Error deleting training:', error);
      }
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl md:text-3xl font-bold">الجدول الزمني</h2>
          <p className="text-xs md:text-sm text-slate-400">مواعيد التدريبات والفعاليات</p>
        </div>
        {canManage && (
          <button 
            onClick={() => handleOpenModal()}
            className="w-full sm:w-auto bg-primary text-slate-950 px-4 py-2.5 md:px-6 md:py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all text-sm"
          >
            <Plus size={18} />
            إضافة موعد
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
        <div className="lg:col-span-1 space-y-4 md:space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-4 md:p-6 rounded-3xl">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-sm md:text-base">
              <Filter size={18} className="text-primary" />
              تصفية
            </h3>
            <div className="flex flex-wrap lg:flex-col gap-2">
              {[
                { id: 'الكل', label: 'الكل' },
                { id: 'مباراة ودية', label: 'مباريات' },
                { id: 'تدريب تكتيكي', label: 'تدريبات' },
                { id: 'اختبارات لياقة', label: 'لياقة' }
              ].map(btn => (
                <button 
                  key={btn.id}
                  onClick={() => setFilter(btn.id)}
                  className={`px-4 py-2 rounded-xl transition-all font-bold text-[10px] md:text-sm ${
                    filter === btn.id ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-slate-800/50 text-slate-400'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/10 p-4 md:p-6 rounded-3xl">
            <h3 className="font-bold text-slate-100 mb-2 text-xs md:text-sm">إحصائيات</h3>
            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-[10px] md:text-xs">
                <span className="text-slate-400">تدريبات</span>
                <span className="font-bold">{stats.scheduled}</span>
              </div>
              <div className="flex justify-between text-[10px] md:text-xs">
                <span className="text-slate-400">مباريات</span>
                <span className="font-bold">{stats.friendly}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4 md:space-y-6">
          {filteredTrainings.map((item) => (
            <div key={item._id} className="bg-slate-900 border border-slate-800 p-4 md:p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 group active:bg-slate-800/50 transition-all">
              <div className="flex items-center gap-4 md:gap-6 min-w-0">
                <div className="p-2 md:p-3 bg-slate-800 rounded-xl text-center min-w-[50px] md:min-w-[60px]">
                  <p className="text-primary text-lg md:text-xl font-black">{item.date?.includes('-') ? item.date.split('-')[2] : '??'}</p>
                  <p className="text-slate-500 text-[8px] md:text-xs uppercase font-bold">مارس</p>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm md:text-lg font-bold text-slate-100 truncate">{item.title}</h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-sm text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5"><Clock size={12} className="text-primary" /> {item.time}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={12} className="text-primary" /> {item.location}</span>
                  </div>
                </div>
              </div>
              {canManage && (
                <div className="flex items-center gap-2 md:gap-4 self-end sm:self-auto">
                  <button 
                    onClick={() => handleOpenModal(item)}
                    className="p-2 md:px-4 md:py-2 rounded-lg md:rounded-xl bg-slate-800 text-primary border border-slate-700 hover:bg-primary hover:text-slate-950 transition-all text-xs font-bold"
                  >
                    تعديل
                  </button>
                  <button 
                    onClick={() => handleDelete(item._id)}
                    className="p-2 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}

          {trainings.length === 0 && (
            <div className="py-20 text-center bg-slate-900/50 border border-slate-800 border-dashed rounded-3xl">
              <Calendar size={60} className="mx-auto text-slate-800 mb-4" />
              <p className="text-slate-500 font-bold">لا يوجد مواعيد مجدولة حالياً</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 font-bold">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h3 className="text-xl font-bold text-primary">{editingTraining ? 'تعديل موعد' : 'إضافة موعد جديد'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 mr-1">عنوان الفعالية</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: تدريب الفريق الأول"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 outline-none focus:border-primary/50 transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 mr-1">التاريخ</label>
                  <input 
                    type="date" 
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 outline-none focus:border-primary/50 transition-all"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 mr-1">الوقت</label>
                  <input 
                    type="text" 
                    required
                    placeholder="04:00 م"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 outline-none focus:border-primary/50 transition-all text-center"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 mr-1">المكان</label>
                  <input 
                    type="text" 
                    required
                    placeholder="ملعب رقم 1"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 outline-none focus:border-primary/50 transition-all"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 mr-1">نوع الفعالية</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 outline-none focus:border-primary/50 transition-all appearance-none"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="تدريب تكتيكي">تدريب تكتيكي</option>
                    <option value="مباراة ودية">مباراة ودية</option>
                    <option value="اختبارات لياقة">اختبارات لياقة</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-primary text-slate-950 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
              >
                <Save size={20} />
                حفظ الجدول
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
