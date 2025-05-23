const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authroutes');
const despesasRoutes = require('./routes/despesas') //despesas
const recorrentesRoutes = require('./routes/recorrentes') //recorrentes
const dashboardRoutes = require('./routes/dashboard') //tratamento de dados- dashboard
const estatisticasRoutes = require('./routes/estatisticas'); //grafico de barras, tratamento dos dados
const eventosRouter = require('./routes/eventos') //AGENDA


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rota para autenticação
app.use('/api/auth', authRoutes);

//rota de despesas
app.use('/api/despesas', despesasRoutes)

app.use('/api/recorrentes', recorrentesRoutes) //rota das recorrentes

app.use('/api', dashboardRoutes) //tratamento de dados- dashboard

app.use('/api/estatisticas', estatisticasRoutes); //grafico de barras, tratamento dos dados

app.use('/api', eventosRouter)

module.exports = app;
