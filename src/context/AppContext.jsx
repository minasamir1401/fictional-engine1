import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [players, setPlayers] = useState([]);
  const [allMembers, setAllMembers] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchMembers = async () => {
    try {
      // Fetch Players
      const pRes = await fetch(`${API_URL}/api/players`);
      if (pRes.ok) setPlayers(await pRes.json());

      // Fetch All Members (for Admin)
      const mRes = await fetch(`${API_URL}/api/players/all`);
      if (mRes.ok) setAllMembers(await mRes.json());
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [user]);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  const [trainings, setTrainings] = useState([]);

  const fetchTrainings = async () => {
    try {
      const response = await fetch(`${API_URL}/api/trainings`);
      if (response.ok) {
        const data = await response.json();
        setTrainings(data);
      }
    } catch (error) {
      console.error('Error fetching trainings:', error);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  const [attendanceHistory, setAttendanceHistory] = useState([
    { date: '2026-03-14', present: 12, absent: 2 },
    { date: '2026-03-13', present: 10, absent: 4 },
    { date: '2026-03-12', present: 14, absent: 0 },
  ]);

  const [globalAttendance, setGlobalAttendance] = useState(() => {
    const saved = localStorage.getItem('globalAttendance');
    return saved ? JSON.parse(saved) : {};
  });

  const updateGlobalAttendance = (date, playerId, data) => {
    setGlobalAttendance(prev => {
      const newState = {
        ...prev,
        [date]: {
          ...(prev[date] || {}),
          [playerId]: data
        }
      };
      localStorage.setItem('globalAttendance', JSON.stringify(newState));
      return newState;
    });
  };

  return (
    <AppContext.Provider value={{ 
      isAuthenticated, setIsAuthenticated,
      user, setUser, 
      login, logout,
      players, setPlayers, allMembers, fetchMembers,
      trainings, setTrainings, fetchTrainings,
      attendanceHistory, setAttendanceHistory,
      globalAttendance, updateGlobalAttendance
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
