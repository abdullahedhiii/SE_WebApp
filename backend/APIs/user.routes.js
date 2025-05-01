const express = require('express');
const router = express.Router();
const User = require('../database/models/User');
const Organization = require('../database/models/Organization');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Expense = require('../database/models/Expense');
const Goal = require('../database/models/Goals');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {   
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        
       
        
        const userData = {
                ...user._doc,
            // uniqueCategories: uniqueCategories,
            // allExpenses: expense,
            // totalExpense,
            // totalThisMonth,
            // totalLastMonth,
            // percentageChange: percentageChange || 0,
            // last7Months: last7Months
        }
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        console.log('userData', userData);
        res.status(200).json({ user: userData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/fetch-user-details/:userId', async (req, res) => {
    try{
        const user = await User.findById(req.params.userId);
        const expense = await Expense.find({ 
            $or: [{ organization: user.organisation }, { user: user._id }] 
        }).sort({ date: -1 });
        const uniqueExpenses = Array.from(new Map(expense.map(exp => [exp._id.toString(), exp])).values());

        const uniqueCategories = [...new Set(uniqueExpenses?.map(expense => expense.category))];
        const totalExpense = uniqueExpenses?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
        const totalThisMonth = uniqueExpenses?.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === new Date().getMonth() &&
                   expenseDate.getFullYear() === new Date().getFullYear();
        }).reduce((acc, curr) => acc + curr.amount, 0) || 0;
        //get total expense amount for last month       
        const totalLastMonth = uniqueExpenses?.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === new Date().getMonth() - 1 &&
                   expenseDate.getFullYear() === new Date().getFullYear();
        }).reduce((acc, curr) => acc + curr.amount, 0) || 0;
        

        const percentageChange = ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100;
        
        //for last 7 months expense
        //{month: 'Jan', amount: 0 },{month: 'Feb', amount: 0 },{month: 'Mar', amount: 0 },{month: 'Apr', amount: 0 },{month: 'May', amount: 0 },{month: 'Jun', amount: 0 },{month: 'Jul', amount: 0 }
        const last7Months = [];

        for (let i = 0; i < 7; i++) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
        
          const month = date.toLocaleString('default', { month: 'long' });
          const year = date.getFullYear();
          const monthIndex = date.getMonth();
        
          const totalExpense = uniqueExpenses?.filter(exp => {
            const expenseDate = new Date(exp.date);
            return (
              expenseDate.getMonth() === monthIndex &&
              expenseDate.getFullYear() === year
            );
          }).reduce((acc, curr) => acc + curr.amount, 0) || 0;
        
          last7Months.unshift({ month: month, amount: totalExpense }); // unshift to keep chronological order
        }
        
       const goals = await Goal.find({ user: user._id });
       const formattedGoals = goals.map(goal => ({
        ...goal._doc,
        progress: (goal.amount_saved / goal.amount) * 100
       }));
       const goalCategories = [...new Set(formattedGoals?.map(goal => goal.category))];
        const userData = {
            uniqueCategories: uniqueCategories,
            allExpenses: uniqueExpenses,
            totalExpense,   
            totalThisMonth,
            totalLastMonth,
            percentageChange: percentageChange || 0,
            last7Months: last7Months,
            goals: formattedGoals,
            goalCategories: goalCategories
        }
        res.status(200).json({userDetails   : userData});
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
});

router.post('/register', async (req, res) => {
    console.log('Registering user');
    const { name, email, password, organisation } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists');
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, organisation });
        user.save();
        console.log('User registered');
        res.status(201).json({user: user});
    } catch (error) {
        console.log('register error', error);
        res.status(500).json({ message: error.message });
    }
});

router.post('/logout', async (req, res) => {
     try {
        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/create-organization/:userId', async (req, res) => {
    console.log('Creating organization');
    const { name, description } = req.body;
    console.log('name', name);
    try {
        const existingOrganization = await Organization.findOne({ name, admin_id: req.params.userId });
        if (existingOrganization) {
            console.log('Organization already exists');
            return res.status(400).json({ message: 'You already have an organization with this name' });
        }
        const organization = new Organization({ name, description, admin_id: req.params.userId });
        organization.save();
        const user = await User.findByIdAndUpdate(req.params.userId, { organisation: organization._id });
        console.log('Organization created');
        res.status(201).json({message: 'Organization created', organization: organization});
    } catch (error) {
        console.log('create organization error', error);
        res.status(500).json({ message: error.message });
    }
});

router.post('/add-user-to-organization/:organizationId', async (req, res) => {
    const { email } = req.body;
    try {
        const organization = await Organization.findById(req.params.organizationId);
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        organization.users.push(user._id);
        organization.save();
        res.status(200).json(organization);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}); 

router.post('/add-details/:userId', async (req, res) => {
    const { budget, income } = req.body;
     try {
        const user = await User.findByIdAndUpdate(req.params.userId, { budget, income });
        res.status(200).json({user});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/add-expense/:userId', async (req, res) => {
    const { amount, description, date, category } = req.body;
    console.log('add expense', req.body);
    try {
       // const user = await User.findById(req.params.userId);
        const expense = new Expense({ amount, description, date, category, user: req.params.userId });
        expense.save();
        console.log('expense added', expense);
        res.status(200).json({expense});
    } catch (error) {
        console.log('add expense error', error);
        res.status(500).json({ message: error.message });
    }
});     

router.post('/add-goal/:userId', async (req, res) => {

    console.log('add goal', req.body);
    const { title, description, category, amount,current, color, startDate, endDate } = req.body;
    try {
        const goal = new Goal({ title, description, category, amount, 
            amount_saved: current, color, startDate, endDate, user: req.params.userId });
        goal.save();
        console.log('goal added', goal);
        res.status(200).json({goal});
}
catch(error){
    console.log('add goal error', error);
    res.status(500).json({ message: error.message });
}
});
module.exports = router;