const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const authenticateToken = require('../middlewares/auth');

const prisma = new PrismaClient();
router.use(authenticateToken);

router.get('/mensal/:ano', async (req, res) => {
  const userId = req.user.id;
  const ano = parseInt(req.params.ano);

  if (isNaN(ano)) return res.status(400).json({ error: 'Ano inválido' });

  const totaisPorMes = Array(12).fill(0);

  try {
    const inicioAno = new Date(ano, 0, 1);
    const fimAno = new Date(ano, 11, 31, 23, 59, 59);

    // Despesas únicas
    const despesasUnicas = await prisma.despesaMensal.findMany({
      where: {
        userId,
        data: { gte: inicioAno, lte: fimAno }
      }
    });

    despesasUnicas.forEach(d => {
      const mes = new Date(d.data).getMonth();
      totaisPorMes[mes] += Number(d.valor || 0);
    });

    // Despesas recorrentes
    const despesasRecorrentes = await prisma.despesaRecorrente.findMany({
      where: {
        userId,
        dataInicio: { lte: fimAno },
        dataFim: { gte: inicioAno }
      }
    });

    despesasRecorrentes.forEach(d => {
      const inicio = new Date(d.dataInicio);
      const fim = new Date(d.dataFim);

      const primeiroMes = Math.max(inicio.getFullYear() === ano ? inicio.getMonth() : 0, 0);
      const ultimoMes = Math.min(fim.getFullYear() === ano ? fim.getMonth() : 11, 11);

      for (let m = primeiroMes; m <= ultimoMes; m++) {
        if (d.recorrencia === 'mensal') {
          totaisPorMes[m] += Number(d.valor || 0);
        } else if (d.recorrencia === 'anual' && m === inicio.getMonth()) {
          totaisPorMes[m] += Number(d.valor || 0);
        } else if (d.recorrencia === 'semanal') {
          totaisPorMes[m] += Number(d.valor || 0) * 4.33;
        }
      }
    });

    const resultado = totaisPorMes.map((total, i) => ({
      mes: i + 1,
      total: parseFloat(total.toFixed(2))
    }));

    res.json(resultado);
  } catch (error) {
    console.error('Erro ao gerar estatísticas mensais:', error);
    res.status(500).json({ error: 'Erro interno ao calcular estatísticas.' });
  }
});

module.exports = router;
