const mongoose = require('mongoose');
const Organization = require('./Organization');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    user_type: String,
    budget: Number,
    income: Number,
    avatarColor: {type: String, default: '#000000'},
    organisation_role: {type: String, required: false,default: 'admin'},
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      default: null,
      required: false
    }
  });
  
  module.exports = mongoose.model('User', userSchema);
  