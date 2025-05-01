const mongoose = require('mongoose');
const Organization = require('./Organization');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    budget: Number,
    income: Number,
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      default: null,
      required: false
    }
  });
  
  module.exports = mongoose.model('User', userSchema);
  