import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Mail, Lock, UserPlus, ShieldCheck, User, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { login: ctxLogin } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('coach');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const payload = {
        name,
        email,
        password,
        role
        // Removed playerDetails and coachDetails - Manager will add them later
      };

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'فشل عملية التسجيل');
      }

      const roleLabels = {
        admin: 'مدير كامل',
        coach: 'مدرب الفريق',
        player: 'لاعب محترف'
      };

      const userData = { 
        ...data.user,
        roleLabel: roleLabels[data.user.role],
        token: data.token
      };

      ctxLogin(userData); 
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4" dir="rtl">
        <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <ShieldCheck size={60} />
        </div>
        <h1 className="text-3xl font-black text-white mb-2 animate-in fade-in slide-in-from-bottom-4 duration-500">تم إنشاء الحساب بنجاح!</h1>
        <p className="text-slate-400 font-bold animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">بانتظار موافقة المدير وتحديد تخصصك...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md z-10 space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 mb-4 shadow-2xl relative group">
            <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:blur-2xl transition-all rounded-full opacity-50"></div>
            <UserPlus className="text-primary relative" size={40} />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">إنشاء حساب جديد</h1>
          <p className="text-slate-400 font-medium">سجل بياناتك الأساسية والمدير سيفعل حسابك</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-500 text-sm font-bold flex items-center gap-2">
            <ShieldCheck size={18} />
            {error}
          </div>
        )}

        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="flex gap-2 p-1 bg-slate-950/50 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setRole('coach')}
                className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${
                  role === 'coach' ? 'bg-primary text-slate-950 shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                مدرب
              </button>
              <button
                type="button"
                onClick={() => setRole('player')}
                className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${
                  role === 'player' ? 'bg-primary text-slate-950 shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                لاعب
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-2 group">
                <label className="text-sm font-bold text-slate-400 mr-2 flex items-center gap-2">
                  <User size={14} className="text-primary" /> الاسم الكامل
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="off"
                  placeholder="أدخل اسمك بالكامل"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-slate-100 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-bold"
                />
              </div>

              <div className="space-y-2 group">
                <label className="text-sm font-bold text-slate-400 mr-2 flex items-center gap-2">
                  <Mail size={14} className="text-primary" /> البريد الإلكتروني
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                  placeholder="name@example.com"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-slate-100 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-left font-bold"
                />
              </div>

              <div className="space-y-2 group">
                <label className="text-sm font-bold text-slate-400 mr-2 flex items-center gap-2">
                  <Lock size={14} className="text-primary" /> كلمة المرور
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-slate-100 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-left font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-slate-950 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 disabled:opacity-50 group"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn size={20} className="group-hover:translate-x-[-4px] transition-transform" />
                  إنشاء الحساب
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-slate-500 font-bold">
            لديك حساب بالفعل؟{' '}
            <button onClick={() => navigate('/login')} className="text-primary hover:text-primary/80 transition-colors">
              تسجيل الدخول
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
