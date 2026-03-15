import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminRegister from './pages/AdminRegister';
import Dashboard from './pages/Dashboard';
import Players from './pages/Players';
import Attendance from './pages/Attendance';
import Subscriptions from './pages/Subscriptions';
import Schedule from './pages/Schedule';
import Reports from './pages/Reports';

function App() {
  const { isAuthenticated } = useAppContext();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mina-admin-gate" element={<AdminRegister />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/players" element={<Players />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<div className="p-8 text-center text-slate-500">صفحة الإعدادات قيد التطوير...</div>} />
      </Routes>
    </Layout>
  );
}

export default App;
