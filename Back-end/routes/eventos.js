const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const authenticateToken = require('../middlewares/auth');

const prisma = new PrismaClient();
router.use(authenticateToken);

//GET
router.get('/eventos', authenticateToken, async (req, res) => {
  const userId = req.user.id
  const mes = parseInt(req.query.mes)
  const ano = parseInt(req.query.ano)

  if (isNaN(mes) || isNaN(ano)) {
    return res.status(400).json({ error: 'Parâmetros inválidos' })
  }

  const inicio = new Date(ano, mes - 1, 1)
  const fim = new Date(ano, mes, 0, 23, 59, 59)

  try {
    const eventos = await prisma.EventoFinanceiro.findMany({
      where: {
        userId,
        data: {
          gte: inicio,
          lte: fim
        }
      },
      orderBy: { data: 'asc' }
    })

    res.json(eventos)
  } catch (error) {
    console.error('Erro ao obter eventos:', error)
    res.status(500).json({ error: 'Erro interno ao listar eventos' })
  }
})

//POST
router.post('/eventos', async (req, res) => {
  const userId = req.user.id
  const {
    titulo,
    descricao,
    data,
    valor,
    categoria,
    recorrencia
  } = req.body

  if (!titulo || !data) {
    return res.status(400).json({ error: 'Título e data são obrigatórios.' })
  }

  try {
    const evento = await prisma.EventoFinanceiro.create({
      data: {
        userId,
        titulo,
        descricao,
        data: new Date(data),
        valor: valor !== undefined ? parseFloat(valor) : null,
        categoria,
        recorrencia
      }
    })

    res.status(201).json(evento)
  } catch (error) {
    console.error('Erro ao criar evento:', error)
    res.status(500).json({ error: 'Erro interno ao criar evento.' })
  }
})

module.exports = router;