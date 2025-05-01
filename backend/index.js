const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./APIs/user.routes');
require('dotenv').config();
const   connectDB = require('./database/db');



app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', userRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(process.env.PORT, () => {

    console.log(`Server is running on port ${process.env.PORT}`);
    connectDB();
});
    
module.exports = app;