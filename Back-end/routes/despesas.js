const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const authenticateToken = require('../middlewares/auth')
const gerarDespesasPendentes = require('../utils/gerarDespesasPendentes')

const prisma = new PrismaClient()

// ✅ Middleware global
router.use(authenticateToken)

// POST: Criar despesa
router.post('/', async (req, res) => {
  const { descricao, valor, categoria, data, recorrencia, notas } = req.body
  const userId = req.user.id

  if (!descricao || !valor || !data) {
    return res.status(400).json({ error: 'Campos obrigatórios em falta' })
  }

  try {
    const novaDespesa = await prisma.despesaMensal.create({
      data: {
        descricao,
        valor: parseFloat(valor),
        categoria,
        data: new Date(data),
        recorrencia,
        notas,
        userId
      }
    })
    res.status(201).json(novaDespesa)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao guardar despesa' })
  }
})

// GET: Todas as despesas
router.get('/', async (req, res) => {
  const userId = req.user.id

  try {
    await gerarDespesasPendentes(userId)

    const despesas = await prisma.despesaMensal.findMany({
      where: { userId },
      orderBy: { data: 'desc' }
    })

    res.json(despesas)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao obter despesas' })
  }
})

// GET: Despesas por mês
router.get('/mensal', async (req, res) => {
  const userId = req.user.id
  const mes = parseInt(req.query.mes)
  const ano = parseInt(req.query.ano)

  if (isNaN(mes) || isNaN(ano)) {
    return res.status(400).json({ error: 'Parâmetros inválidos' })
  }

  const inicio = new Date(ano, mes - 1, 1)
  const fim = new Date(ano, mes, 0, 23, 59, 59)
  const hoje = new Date()

  try {
    // ✅ Gera despesas pendentes antes de analisar
    await gerarDespesasPendentes(userId)

    const despesas = await prisma.despesaMensal.findMany({
      where: {
        userId,
        data: { gte: inicio, lte: fim }
      }
    })

    const categorias = {}

    despesas.forEach(d => {
      const nome = d.categoria || 'Outros'
      if (!categorias[nome]) categorias[nome] = 0
      categorias[nome] += Number(d.valor)
    })

    // 🔁 Eventos da agenda com valor
    const eventos = await prisma.eventoFinanceiro.findMany({
      where: {
        userId,
        data: { gte: inicio, lte: fim },
        valor: { not: null }
      }
    })

    eventos.forEach(ev => {
      const dataEvento = new Date(ev.data)
      const isFuturo = dataEvento > hoje

      const nome = isFuturo
        ? 'Agendado'
        : ev.categoria || 'Outros'

      if (!categorias[nome]) categorias[nome] = 0
      categorias[nome] += Number(ev.valor)
    })

    const total = Object.values(categorias).reduce((acc, val) => acc + val, 0)
    res.json({ categorias, total })
  } catch (error) {
    console.error('Erro ao obter despesas mensais:', error)
    res.status(500).json({ error: 'Erro interno ao processar despesas' })
  }
})

module.exports = router