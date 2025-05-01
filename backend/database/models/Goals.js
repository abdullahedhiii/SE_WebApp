const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  title: String,
  description: {type: String, required: false},
  category: String,
  amount: Number,
  amount_saved: Number,
  startDate: Date,
  endDate:{type: Date, required: false},
  status: String,
  color: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Goal', goalSchema);

