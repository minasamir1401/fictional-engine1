const Training = require('../models/Training');

// Mock Data
let mockTrainings = [
  { _id: '1', title: 'تدريب الفريق الأول - تكتيك', time: '04:00 م', location: 'ملعب رقم 1', date: '2026-03-15', type: 'تدريب تكتيكي' },
  { _id: '2', title: 'أكاديمية الناشئين - مهارات', time: '05:30 م', location: 'ملعب التدريب', date: '2026-03-15', type: 'تدريب تكتيكي' },
];

exports.getTrainings = async (req, res) => {
  if (!global.dbConnected) {
    return res.json(mockTrainings);
  }

  try {
    const trainings = await Training.findAll({ order: [['date', 'DESC']] });
    res.json(trainings.map(t => ({ ...t.toJSON(), _id: t.id }))); // Mapper to keep frontend _id
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTraining = async (req, res) => {
  if (!global.dbConnected) {
    const newTraining = { _id: Date.now().toString(), ...req.body };
    mockTrainings.unshift(newTraining);
    return res.status(201).json(newTraining);
  }

  try {
    const training = await Training.create(req.body);
    res.status(201).json({ ...training.toJSON(), _id: training.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateTraining = async (req, res) => {
  const { id } = req.params;
  if (!global.dbConnected) {
    mockTrainings = mockTrainings.map(t => t._id === id ? { ...t, ...req.body } : t);
    return res.json({ message: 'Updated' });
  }

  try {
    await Training.update(req.body, { where: { id } });
    res.json({ message: 'Updated' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTraining = async (req, res) => {
  const { id } = req.params;
  if (!global.dbConnected) {
    mockTrainings = mockTrainings.filter(t => t._id !== id);
    return res.json({ message: 'Deleted' });
  }

  try {
    await Training.destroy({ where: { id } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
