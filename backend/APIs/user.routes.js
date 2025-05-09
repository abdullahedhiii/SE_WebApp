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
        let admin_info,users_organization;
        if (user.user_type === 'individual' && user.organisation){
            users_organization = await Organization.findById(user.organisation);
            admin_info = await User.findById(users_organization.admin_id);
        }
        
        if(user.user_type === 'individual' && user.organisation){
            userData = {
                ...user._doc,
                budget: admin_info.budget,
                income: admin_info.income,
            
            
            
            
            
            
            
        
        }
    }
        else{
            userData = {
                ...user._doc,
            
            }
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
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        let user_info = [],users_organization;

        if (user.user_type === 'organization' || user.organisation) {
            console.log('checking org')
            users_organization = await Organization.findById(user.organisation);
            
            if (!users_organization) {
              console.log('organization not found');
              return res.status(404).json({ message: 'Organization not found' });
            }
          
          
            if (users_organization.users.length > 0) {
              user_info = await Promise.all(
                users_organization.users.map(async (userId) => {
                  const user_org = await User.findById(userId.toString());
                  return {
                    name: user_org.name,
                    email: user_org.email,
                    avatarColor: user_org.avatarColor,
                    organisation_role: user_org.organisation_role
                  };
                })
              );
            } else {
              user_info = null;
            }
          }
        
        let id_to_check = user.organisation !== null ? users_organization.admin_id : user._id;
        const admin_info = id_to_check? await User.findById(id_to_check) : null;
        if(admin_info){
            console.log(admin_info)
            user_info.push({
                name: admin_info.name,
                email: admin_info.email,
                avatarColor: admin_info.avatarColor,
                organisation_role: 'Organization Owner'
            });
        }
        
        
        let expense;
        if(users_organization){
            console.log('users_organization');
            const all_users = users_organization.users;
            console.log('all_users', all_users);
            expense = await Expense.find({ user: { $in: all_users.map(user => user.toString()) } }).populate('user', 'name').sort({ date: -1 });
            console.log('expense', expense);
            const admin_expenses = await Expense.find({ user: admin_info._id }).populate('user', 'name').sort({ date: -1 });
            console.log('admin_expenses', admin_expenses);
            expense = [...expense, ...admin_expenses];
        }
        else{
            expense = await Expense.find({ user: id_to_check }).sort({ date: -1 });
        }
        const uniqueExpenses = Array.from(new Map(expense?.map(exp => [exp._id.toString(), exp])).values());

        const uniqueCategories = [...new Set(uniqueExpenses?.map(expense => expense.category))];
        const totalExpense = uniqueExpenses?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
        const totalThisMonth = uniqueExpenses?.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === new Date().getMonth() &&
                   expenseDate.getFullYear() === new Date().getFullYear();
        }).reduce((acc, curr) => acc + curr.amount, 0) || 0;
        
        const totalLastMonth = uniqueExpenses?.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === new Date().getMonth() - 1 &&
                   expenseDate.getFullYear() === new Date().getFullYear();
        }).reduce((acc, curr) => acc + curr.amount, 0) || 0;
        console.log('here')

        const percentageChange = ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100;
        
        
        
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
        
          last7Months.unshift({ month: month, amount: totalExpense }); 
        }
        
       const goals = await Goal.find({ user: id_to_check });
       const formattedGoals = goals?.map(goal => ({
        ...goal._doc,
        progress: (goal.amount_saved / goal.amount) * 100
       }));
       const totalSaved = formattedGoals?.reduce((acc, curr) => acc + curr.amount_saved, 0) || 0;
       const totalTarget = formattedGoals?.reduce((acc, curr) => acc + curr.amount, 0) || 0;
       const overallProgress = (totalSaved / totalTarget) * 100 || 0;
       const goalCategories = [...new Set(formattedGoals?.map(goal => goal.category))];
        const userData = {
            org_members: user_info,
            uniqueCategories: uniqueCategories,
            allExpenses: uniqueExpenses,
            totalExpense,   
            totalThisMonth,
            totalLastMonth,
            percentageChange: percentageChange || 0,
            last7Months: last7Months,
            goals: formattedGoals,
            goalCategories: goalCategories,
            goalData: {
                totalSaved,
                totalTarget,
                overallProgress
            }
        }
        console.log('Returning user details ',userData)
        res.status(200).json({userDetails   : userData});
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
});

router.post('/register', async (req, res) => {
    console.log('Registering user');
    const { name, email, password, organisation,role } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists');
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, organisation,user_type:role,avatarColor:'#000000' });
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
    const { email, organisation_role, avatarColor } = req.body;
    console.log('add user to organization', req.body);
  
    try {
      const organization = await Organization.findById(req.params.organizationId);
      if (!organization) {
        return res.status(404).json({ message: 'Organization not found.' });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        console.log('user not found');
        return res.status(400).json({ message: 'This user does not exist on our platform. Please ask them to sign up first, as an individual user.' });
      }
  
      if (user.organisation && user.organisation === req.params.organizationId) {
         res.status(200).json({message: 'User already in this organization'});
    }

      if (user.organisation) {
        console.log('user already has an organization');
        return res.status(400).json({ message: 'This user already has an organization. Please ask them to sign up with a different email for this organization.' });
      }
  
      console.log('user found');
  
      
      user.organisation = req.params.organizationId;
      user.organisation_role = organisation_role;
      user.avatarColor = avatarColor;
      await user.save(); 
  
      console.log('user updated');
  
      
      organization.users.push(user._id);
      await organization.save();
  
      console.log('organization saved');
      res.status(200).json({ message: 'User added to organization', organization });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  });
  

router.post('/add-details/:userId', async (req, res) => {
    const { budget, income } = req.body;
     try {
        await User.findByIdAndUpdate(req.params.userId, { budget, income });
        const user = await User.findById(req.params.userId);
        res.status(200).json({user: user});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/add-expense/:userId', async (req, res) => {
    const { amount, description, date, category } = req.body;
    console.log('add expense', req.body);
    try {
       
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
    const { name, description, category, target , current, color, startDate, endDate } = req.body;
    try {
        const goal = new Goal({ title:name, description, category, amount: target, 
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