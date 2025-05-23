const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const authenticateToken = require('../middlewares/auth')

const prisma = new PrismaClient()

// Aplica o middleware a todas as rotas
router.use(authenticateToken)

// POST /api/recorrentes → cria nova despesa recorrente
router.post('/', async (req, res) => {
  const { titulo, valor, categoria, dataInicio, dataFim, recorrencia, notas } = req.body
  const userId = req.user.id

  if (!titulo || !valor || !dataInicio || !dataFim || !recorrencia) {
    return res.status(400).json({ error: 'Campos obrigatórios em falta' })
  }

  try {
    const novaRecorrente = await prisma.despesaRecorrente.create({
      data: {
        titulo,
        valor: parseFloat(valor),
        categoria,
        dataInicio: new Date(dataInicio),
        dataFim: new Date(dataFim),
        recorrencia,
        notas,
        userId
      }
    })

    res.status(201).json(novaRecorrente)
  } catch (error) {
    console.error('Erro ao criar despesa recorrente:', error)
    res.status(500).json({ error: 'Erro interno ao guardar despesa recorrente.' })
  }
})

//debugdarota
router.get('/', async (req, res) => {
  const userId = req.user.id

  try {
    const recorrentes = await prisma.despesaRecorrente.findMany({
      where: { userId },
      orderBy: { dataInicio: 'asc' }
    })

    res.status(200).json(recorrentes)
  } catch (error) {
    console.error('Erro ao obter despesas recorrentes:', error)
    res.status(500).json({ error: 'Erro interno ao buscar despesas recorrentes.' })
  }
})


module.exports = router