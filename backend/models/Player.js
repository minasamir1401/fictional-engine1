const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true },
  position: { type: String, required: true },
  age: { type: Number, required: true },
  attendance: [{
    date: Date,
    status: { type: String, enum: ['Present', 'Absent'] },
    reason: String
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Player', playerSchema);
