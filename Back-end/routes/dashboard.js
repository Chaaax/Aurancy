// routes/dashboard.js
const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const authenticateToken = require('../middlewares/auth')

const prisma = new PrismaClient()
router.use(authenticateToken)

router.get('/despesas/mensal', async (req, res) => {
  const userId = req.user.id

  // Pega mês e ano da query ou usa o mês atual
  const mes = parseInt(req.query.mes) || new Date().getMonth() + 1 // Janeiro = 1
  const ano = parseInt(req.query.ano) || new Date().getFullYear()

  const inicioMes = new Date(ano, mes - 1, 1)
  const fimMes = new Date(ano, mes, 0, 23, 59, 59)

  try {
    // 1. Buscar despesas únicas do mês
    const despesasUnicas = await prisma.despesaMensal.findMany({
      where: {
        userId,
        data: {
          gte: inicioMes,
          lte: fimMes
        }
      }
    })

    // 2. Buscar despesas recorrentes ativas nesse mês
    const despesasRecorrentes = await prisma.despesaRecorrente.findMany({
      where: {
        userId,
        dataInicio: { lte: fimMes },
        dataFim: { gte: inicioMes }
      }
    })

    // 3. Agrupar por categoria
    const categorias = {}

    despesasUnicas.forEach(d => {
      const cat = d.categoria || 'Outros'
      categorias[cat] = (categorias[cat] || 0) + Number(d.valor)
    })

    despesasRecorrentes.forEach(d => {
      const cat = d.categoria || 'Outros'
      categorias[cat] = (categorias[cat] || 0) + Number(d.valor)
    })

    const totalMensal = Object.values(categorias).reduce((acc, val) => acc + val, 0)

    res.json({ totalMensal, categorias, mes, ano })
  } catch (err) {
    console.error('Erro ao calcular despesas mensais:', err)
    res.status(500).json({ error: 'Erro ao calcular despesas mensais' })
  }
})

module.exports = router
