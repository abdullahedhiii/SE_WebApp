const mongoose = require('mongoose');
const User = require('./User');

const organizationSchema = new mongoose.Schema({
    name: String,
    description: {type: String, default: '', required: false},
    created_at: Date,
    updated_at: Date,
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
});

module.exports = mongoose.model('Organization', organizationSchema);
