import React from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from 'recharts';
import { FileText, Download, Printer, Filter } from 'lucide-react';

const Reports = () => {
  const { players, attendanceHistory } = useAppContext();

  const COLORS = ['#65c6dc', '#1152d4', '#8c25f4', '#f43f5e'];

  const playerStats = players.map(p => ({
    name: p.name,
    attendance: Math.floor(Math.random() * 40) + 60 // Mock percentage
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold">التقارير التفصيلية</h2>
          <p className="text-slate-400">تحليل بيانات الحضور والأداء للاعبين والأكاديمية</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-slate-800 text-slate-100 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-700 transition-colors">
            <Printer size={18} />
            طباعة
          </button>
          <button className="bg-primary text-slate-950 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors">
            <Download size={18} />
            تصدير ملف Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
          <h3 className="text-xl font-bold mb-8">نسبة الحضور حسب اللاعبين</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={playerStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} width={100} />
                <Tooltip 
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
                <Bar dataKey="attendance" fill="#65c6dc" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
          <h3 className="text-xl font-bold mb-8">توزيع الحضور التاريخي</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="present" name="حضور" stackId="a" fill="#65c6dc" radius={[0, 0, 0, 0]} />
                <Bar dataKey="absent" name="غياب" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-xl font-bold">ملخص الحضور الشهري</h3>
          <button className="flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors">
            <Filter size={18} />
            <span>تصفية متقدمة</span>
          </button>
        </div>
        <div className="p-8">
          <table className="w-full text-right">
            <thead>
              <tr className="text-slate-500 text-sm border-b border-slate-800">
                <th className="pb-4 font-normal">التاريخ</th>
                <th className="pb-4 font-normal text-center">عدد الحاضرين</th>
                <th className="pb-4 font-normal text-center">عدد الغائبين</th>
                <th className="pb-4 font-normal text-center">نسبة الحضور</th>
                <th className="pb-4 font-normal text-left">التفاصيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {attendanceHistory.map((item, i) => (
                <tr key={i} className="hover:bg-slate-800/20 transition-colors group">
                  <td className="py-4 font-medium">{item.date}</td>
                  <td className="py-4 text-center text-green-400">{item.present}</td>
                  <td className="py-4 text-center text-red-400">{item.absent}</td>
                  <td className="py-4 text-center font-bold">
                    {Math.round((item.present / (item.present + item.absent)) * 100)}%
                  </td>
                  <td className="py-4 text-left">
                    <button className="p-2 text-slate-500 hover:text-primary transition-colors">
                      <FileText size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
