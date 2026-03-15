const User = require('../models/User');
const authController = require('./authController');

exports.getPlayers = async (req, res) => {
  if (!global.dbConnected) {
    const mockUsers = authController._getMockUsers();
    const players = mockUsers.filter(u => u.role === 'player').map(p => ({
      id: p.id,
      name: p.name,
      email: p.email,
      role: p.role,
      number: p.playerDetails?.number || '00',
      position: p.playerDetails?.position || 'غير محدد',
      age: p.playerDetails?.age || '-',
    }));
    return res.json(players);
  }

  try {
    const players = await User.findAll({ where: { role: 'player' } });
    const formattedPlayers = players.map(p => ({
      id: p.id,
      name: p.name,
      email: p.email,
      role: p.role,
      number: p.playerDetails?.number || '00',
      position: p.playerDetails?.position || 'غير محدد',
      age: p.playerDetails?.age || '-',
    }));
    res.json(formattedPlayers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllMembers = async (req, res) => {
  if (!global.dbConnected) {
    const mockUsers = authController._getMockUsers();
    return res.json(mockUsers.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      number: u.playerDetails?.number || '--',
      position: u.playerDetails?.position || u.coachDetails?.specialization || 'عضو',
      age: u.playerDetails?.age || u.coachDetails?.experienceYears || '-',
    })));
  }

  try {
    const users = await User.findAll();
    const formatted = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      number: u.playerDetails?.number || '--',
      position: u.playerDetails?.position || u.coachDetails?.specialization || 'عضو',
      age: u.playerDetails?.age || u.coachDetails?.experienceYears || '-',
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
