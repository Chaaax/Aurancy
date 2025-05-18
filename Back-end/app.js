const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authroutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rota para autenticação
app.use('/api/auth', authRoutes);

module.exports = app;
