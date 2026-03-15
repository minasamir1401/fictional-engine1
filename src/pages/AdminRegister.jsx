import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Lock, User, Loader2, CheckCircle2, Key } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    secretCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Security check
    if (formData.secretCode !== 'MINA2026') {
      setError('كود الرمز السري للمدير غير صحيح! لا يمكن إنشاء حساب مدير بدون الكود.');
      return;
    }

    setLoading(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role: 'admin'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          login(data.user);
          navigate('/');
        }, 2000);
      } else {
        setError(data.message || 'فشل في إنشاء حساب المدير');
      }
    } catch (err) {
      setError('تعذر الاتصال بالسيرفر. تأكد من تشغيل السيرفر.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-bold">
      {/* Background Glows */}
      <div className="absolute top-0 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-0 -right-20 w-80 h-80 bg-red-500/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 transition-all duration-500">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <Shield className="text-red-500" size={32} />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">بوابة المدير السرية</h2>
          <p className="text-slate-400">سجل هنا فقط إذا كنت تمتلك صلاحية الإدارة الشاملة</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 animate-in shake duration-300">
            <Shield size={20} />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="اسم المدير"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pr-12 pl-4 text-white outline-none focus:border-primary/50 transition-all shadow-inner"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="relative group">
            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="email" 
              placeholder="البريد المخصص للإدارة"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pr-12 pl-4 text-white outline-none focus:border-primary/50 transition-all shadow-inner"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="relative group">
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="password" 
              placeholder="كلمة المرور"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pr-12 pl-4 text-white outline-none focus:border-primary/50 transition-all shadow-inner"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className="relative group">
            <Key className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400 group-focus-within:text-red-500 transition-colors" size={20} />
            <input 
              type="password" 
              placeholder="الرمز السري للإدارة (Secret Key)"
              required
              className="w-full bg-slate-950 border border-red-900/40 rounded-xl py-4 pr-12 pl-4 text-white outline-none focus:border-red-500 transition-all shadow-inner placeholder:text-red-900/50"
              value={formData.secretCode}
              onChange={(e) => setFormData({...formData, secretCode: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-slate-950 py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 mt-6"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'تفعيل حساب المدير'}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-sm">
          بالتسجيل هنا، ستحصل على صلاحيات كاملة فوق المدربين واللاعبين.
        </p>
      </div>

      {/* Success Success Animation */}
      {success && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-500">
          <div className="text-center">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(34,197,94,0.3)] animate-bounce font-black">
              <CheckCircle2 size={48} className="text-slate-950" />
            </div>
            <h3 className="text-3xl font-black text-white mb-2">مرحباً بسيادة المدير!</h3>
            <p className="text-slate-400">تم تفعيل الصلاحيات.. يتم الآن فتح لوحة التحكم</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRegister;
