const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  plan: { 
    type: String, 
    enum: ['Monthly', '3 Months', '6 Months', 'Yearly'], 
    required: true 
  },
  price: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  paymentStatus: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
  status: { type: String, enum: ['Active', 'Expired'], default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
