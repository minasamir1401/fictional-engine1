const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Mock Data Storage for when DB is disconnected
let mockUsers = [
  { id: 'mock1', name: 'Admin User', email: 'admin@test.com', password: '123', role: 'admin' },
  { id: 'mock2', name: 'Coach User', email: 'coach@test.com', password: '123', role: 'coach' }
];

exports.register = async (req, res) => {
  const { name, email, password, role, playerDetails, coachDetails } = req.body;

  if (!global.dbConnected) {
    const existing = mockUsers.find(u => u.email === email);
    if (existing) return res.status(400).json({ message: 'المستخدم موجود مسبقاً' });
    const newUser = { id: Date.now().toString(), name, email, role, playerDetails, coachDetails };
    mockUsers.push(newUser);
    const token = 'mock_token_' + newUser.id;
    return res.status(201).json({ token, user: newUser });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role, playerDetails, coachDetails });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!global.dbConnected) {
    const user = mockUsers.find(u => u.email === email);
    if (!user) return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
    const token = 'mock_token_' + user.id;
    return res.json({ token, user });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports._getMockUsers = () => mockUsers;
