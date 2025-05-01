const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    category:{type: String, required: true},
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: false },//for organization expenses
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },//for individual expenses
    created_at: { type: Date, default: Date.now },
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;


