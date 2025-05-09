const { spawn } = require('child_process');
const path = require('path');
const express = require('express');
const router = express.Router();
const Expense = require('../database/models/Expense');
const User = require('../database/models/User');
const Organisation = require('../database/models/Organization');
const Goal = require('../database/models/Goals');

router.get('/clustering/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const user = await User.findById(user_id);
    let id_to_check;
    if(user.user_type === 'individual' && user.organisation){
        const organisation = await Organisation.findById(user.organisation);
        id_to_check = organisation.admin_id ;
    }
    else{
        id_to_check = user_id;
    }
    const expenses = await Expense.find({ user: id_to_check });
  
    if (expenses.length === 0) {
      return res.status(200).json({ message: 'No expenses found for clustering.' });
    }
  
    const inputData = expenses.map((expense) => ({
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
    }));
  
    // console.log('Data passed to Python:', inputData);
  
    if (inputData.length === 0) {
      return res.status(200).json({ message: 'No valid data found to perform clustering.' });
    }
  console.log(inputData);
    const pyProcess = spawn('python', [path.join(__dirname, '../MachineLearningAlgos/Clustering.py')]);
  
    pyProcess.stdin.write(JSON.stringify(inputData)); // Send data
    pyProcess.stdin.end(); // End stdin
  
    let result = '';
  
    pyProcess.stdout.on('data', (data) => {
      result += data.toString();
    });
  
    pyProcess.stderr.on('data', (data) => {
      console.error('Python error:', data.toString());
    });
  
    pyProcess.on('close', (code) => {
      try {
        const parsed = JSON.parse(result);
        console.log(parsed);
        if (parsed.error) {
            console.log(parsed.error);
          return res.status(500).json({ error: parsed.error });
        }
        res.json({ labels: parsed });
      } catch (err) {
        console.error('Error parsing Python output:', err);
        res.status(500).json({ error: 'Error parsing Python output' });
      }
    });
  });
  
  router.get('/forecasting/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const user = await User.findById(user_id);
    let id_to_check;

    if (user.user_type === 'individual' && user.organisation) {
        const organisation = await Organisation.findById(user.organisation);
        id_to_check = organisation.admin_id;
    } else {
        id_to_check = user_id;
    }

    const expenses = await Expense.find({ user: id_to_check });
    if (expenses.length === 0) {
        return res.status(200).json({ message: 'No expenses found for forecasting.' });
    }

    const inputData = expenses.map((expense) => ({
        amount: expense.amount,
        date: expense.date,
    }));
    console.log(inputData);
    const pyProcess = spawn('python', [path.join(__dirname, '../MachineLearningAlgos/Forecasting.py')]);

    pyProcess.stdin.write(JSON.stringify(inputData));
    pyProcess.stdin.end();

    let result = '';
    pyProcess.stdout.on('data', (data) => {
        result += data.toString();
    });

    pyProcess.stderr.on('data', (data) => {
        console.error('Python error:', data.toString());
    });

    pyProcess.on('close', (code) => {
        try {
            const parsed = JSON.parse(result);
            console.log(parsed);
            res.status(200).json(parsed);
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: 'Failed to parse forecast result.', raw: result });
        }
    });
});

router.get('/fetch-AI-alerts/:user_id', async (req, res) => {
    let user_id = req.params.user_id;
    try { 
      let user;
      user = await User.findById(user_id);
        if(user.user_type === 'individual' && user.organisation){
            const organisation = await Organisation.findById(user.organisation);
            user_id = organisation.admin_id;
            user = await User.findById(user_id);
        }
        const goals = await Goal.find({ user: user_id, endDate: { $lt: new Date() } });
        console.log(goals);
        const inputData = goals.map((goal) => ({
            title: goal.title,
            description: goal.description,
            amount: goal.amount,
            amount_saved: goal.amount_saved,
            end_date: goal.endDate,
        }));
        
        const pyProcess = spawn('python', [path.join(__dirname, '../MachineLearningAlgos/Alerts.py')]); 
        pyProcess.stdin.write(JSON.stringify(inputData));
        pyProcess.stdin.end();

        let result = '';
        pyProcess.stdout.on('data', (data) => {
            result += data.toString();
        });
        pyProcess.stderr.on('data', (data) => {
            console.error('Python error:', data.toString());
        });
        pyProcess.on('close', (code) => {
            console.log(`Python process exited with code ${code}`);
            res.status(200).json({ result });
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch AI alerts.' });
    }
});

module.exports = router;
