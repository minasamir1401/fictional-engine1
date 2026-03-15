import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Calendar, Check, X, Info, Loader2, Save, UserCheck } from 'lucide-react';

const Attendance = () => {
  const { players, allMembers, user, globalAttendance, updateGlobalAttendance } = useAppContext();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [localData, setLocalData] = useState({});

  const isPlayer = user?.role === 'player';
  const isAdmin = user?.role === 'admin';
  
  // Choose which list to display
  const targetMembers = isAdmin ? allMembers : players;

  // Load data for the selected date
  const loadAttendance = () => {
    setLoading(true);
    setTimeout(() => {
      const savedForDate = globalAttendance[date] || {};
      const initial = {};
      
      targetMembers.forEach(p => {
        initial[p.id] = savedForDate[p.id] || { status: 'Pending', reason: '' };
      });
      
      setLocalData(initial);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    loadAttendance();
  }, [date, globalAttendance]); // Reload if date or global store changes

  const handleStatusUpdate = (playerId, status) => {
    // Security check: player can only update themself
    if (isPlayer && playerId.toString() !== user?.id?.toString() && playerId !== user?._id) {
       return; 
    }
    
    const newData = { ...localData[playerId], status };
    updateGlobalAttendance(date, playerId, newData);
  };

  const handleReasonUpdate = (playerId, reason) => {
    if (isPlayer && playerId.toString() !== user?.id?.toString() && playerId !== user?._id) return;

    const newData = { ...localData[playerId], reason };
    updateGlobalAttendance(date, playerId, newData);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 overflow-hidden">
      <div className="bg-slate-900/50 p-4 md:p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl md:text-3xl font-bold flex items-center gap-2">
              {isPlayer ? 'سجل حضوري' : 'تحضير اللاعبين'}
              {isPlayer && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full border border-primary/30">لاعب</span>}
            </h2>
            <p className="text-[10px] md:text-sm text-slate-400">
              {isPlayer ? 'تأكد من تسجيلك يومياً' : 'سجل الحضور لتحديث حسابات اللاعبين'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl flex items-center gap-2 shadow-inner">
              <Calendar size={18} className="text-primary" />
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent border-none outline-none text-slate-100 font-bold cursor-pointer text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 size={30} className="text-primary animate-spin" />
        </div>
      ) : (
        <div className="space-y-4 md:space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            {/* Mobile View */}
            <div className="lg:hidden divide-y divide-slate-800">
              {targetMembers
                .filter(p => !isPlayer || p.email === user.email)
                .map((player) => {
                  const status = localData[player.id]?.status || 'Pending';
                  const canEdit = !isPlayer || player.email === user.email;

                  return (
                    <div key={player.id} className="p-4 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all ${status === 'Present' ? 'bg-green-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                          {player.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                             <p className="font-bold text-slate-100 text-sm truncate">{player.name}</p>
                             {player.role === 'coach' && <span className="text-[8px] bg-orange-500/20 text-orange-400 px-1 rounded border border-orange-500/30">مدرب</span>}
                          </div>
                          <p className="text-[10px] text-slate-500 font-bold uppercase truncate">{player.email}</p>
                        </div>
                        <span className="px-2 py-1 bg-slate-950 rounded text-primary font-mono text-xs font-black border border-slate-800">
                           {player.number}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => canEdit && handleStatusUpdate(player.id, 'Present')}
                          disabled={!canEdit}
                          className={`flex-1 py-2.5 rounded-xl font-black text-[10px] transition-all flex items-center justify-center gap-1 ${status === 'Present' ? 'bg-green-500 text-slate-950 shadow-lg' : 'bg-slate-950 text-slate-500 border border-slate-800'}`}
                        >
                          {status === 'Present' && <Check size={12} />}
                          حاضر
                        </button>
                        <button 
                          onClick={() => canEdit && handleStatusUpdate(player.id, 'Absent')}
                          disabled={!canEdit}
                          className={`flex-1 py-2.5 rounded-xl font-black text-[10px] transition-all flex items-center justify-center gap-1 ${status === 'Absent' ? 'bg-red-500 text-slate-950 shadow-lg' : 'bg-slate-950 text-slate-500 border border-slate-800'}`}
                        >
                          {status === 'Absent' && <X size={12} />}
                          غائب
                        </button>
                      </div>

                      <input 
                        type="text"
                        placeholder="أضف ملاحظات..."
                        value={localData[player.id]?.reason || ''}
                        readOnly={!canEdit}
                        onChange={(e) => canEdit && handleReasonUpdate(player.id, e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-primary/50 text-slate-300"
                      />
                    </div>
                  );
                })}
            </div>

            {/* Desktop Table View */}
            <table className="hidden lg:table w-full text-right">
              <thead className="bg-slate-800/50 text-slate-400 text-sm uppercase tracking-wider">
                <tr>
                  <th className="px-8 py-5 font-black">اللاعب</th>
                  <th className="px-6 py-5 font-black text-center">الرقم</th>
                  <th className="px-6 py-5 font-black text-center w-64">الحالة الآن</th>
                  <th className="px-8 py-5 font-black">الملاحظات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {targetMembers
                  .filter(p => !isPlayer || p.email === user.email)
                  .map((player) => {
                    const status = localData[player.id]?.status || 'Pending';
                    const canEdit = !isPlayer || player.email === user.email;

                    return (
                      <tr key={player.id} className={`transition-all duration-300 ${isPlayer ? 'bg-primary/5' : 'hover:bg-slate-800/30'} group`}>
                        <td className="px-8 py-5 border-r border-transparent group-hover:border-primary/30">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all ${status === 'Present' ? 'bg-green-500 text-slate-950 scale-110 rotate-3' : 'bg-slate-800 text-slate-400'}`}>
                              {player.name.charAt(0)}
                            </div>
                            <div>
                               <div className="flex items-center gap-2">
                                 <p className="font-black text-slate-100">{player.name}</p>
                                 {player.role === 'coach' && <span className="text-[9px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded border border-orange-500/30">مدرب</span>}
                               </div>
                               <p className="text-[10px] text-slate-500 font-bold uppercase">{player.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="px-3 py-1 bg-slate-950 rounded-lg text-primary font-mono font-black border border-slate-800">
                             {player.number}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex justify-center gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner">
                            <button 
                              onClick={() => canEdit && handleStatusUpdate(player.id, 'Present')}
                              disabled={!canEdit}
                              className={`flex-1 py-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
                                status === 'Present' 
                                ? 'bg-green-500 text-slate-950 shadow-lg shadow-green-500/20' 
                                : 'text-slate-500 hover:text-slate-300'
                              } ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {status === 'Present' && <Check size={14} />}
                              حاضر
                            </button>
                            <button 
                              onClick={() => canEdit && handleStatusUpdate(player.id, 'Absent')}
                              disabled={!canEdit}
                              className={`flex-1 py-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
                                status === 'Absent' 
                                ? 'bg-red-500 text-slate-950 shadow-lg shadow-red-500/20' 
                                : 'text-slate-500 hover:text-slate-300'
                              } ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {status === 'Absent' && <X size={14} />}
                              غائب
                            </button>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="relative group/input">
                            <input 
                              type="text"
                              placeholder={status === 'Absent' ? 'اذكر سبب الغياب...' : 'أضف ملاحظاتك هنا...'}
                              value={localData[player.id]?.reason || ''}
                              readOnly={!canEdit}
                              onChange={(e) => canEdit && handleReasonUpdate(player.id, e.target.value)}
                              className={`w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-all font-bold ${
                                status === 'Absent' ? 'border-red-500/30' : ''
                              } ${!canEdit ? 'cursor-not-allowed' : 'hover:border-slate-600'}`}
                            />
                            {status === 'Absent' && <Info size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400 opacity-50" />}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl flex items-center justify-between gap-4">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                   <UserCheck size={20} />
                </div>
                <div>
                   <p className="text-sm font-black text-white">نطام التحديث الفوري</p>
                   <p className="text-[10px] text-slate-500 font-bold">كل تغيير تقوم به يظهر للطرف الآخر فوراً</p>
                </div>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-green-500 uppercase">مفعل الآن</span>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
