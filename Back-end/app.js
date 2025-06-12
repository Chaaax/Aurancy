const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authenticateToken = require('./middlewares/auth'); // <- IMPORTANTE

const authRoutes = require('./routes/authroutes');
const despesasRoutes = require('./routes/despesas');
const recorrentesRoutes = require('./routes/recorrentes');
const dashboardRoutes = require('./routes/dashboard');
const estatisticasRoutes = require('./routes/estatisticas');
const eventosRouter = require('./routes/eventos');
const veiculosRoutes = require('./routes/veiculos');
const manutencoesRoutes = require('./routes/veiculos/manutencoes');
const historicoRoutes = require('./routes/veiculos/historico');
const paymentsRouter = require('./routes/payments');
const savingRoute = require("./routes/saving");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes); // Rota pública

app.use(authenticateToken); // <- PROTEGE AS ROTAS A PARTIR DAQUI

app.use('/api/payments', paymentsRouter);
app.use('/api/despesas', despesasRoutes);
app.use('/api/recorrentes', recorrentesRoutes);
app.use('/api', dashboardRoutes);
app.use('/api/estatisticas', estatisticasRoutes);
app.use('/api', eventosRouter);
app.use('/api/veiculos', veiculosRoutes);
app.use('/api/manutencoes', manutencoesRoutes);
app.use('/api/historico', historicoRoutes);
app.use("/api/saving", savingRoute);

module.exports = app;

