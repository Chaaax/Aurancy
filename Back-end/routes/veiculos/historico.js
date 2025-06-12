const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Middleware de autenticação
const requireAuth = async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Não autenticado' });
  }
  next();
};

// GET /api/historico/:veiculoId - listar histórico de manutenções
router.get('/:veiculoId', requireAuth, async (req, res) => {
  const veiculoId = parseInt(req.params.veiculoId);

  try {
    const historico = await prisma.historicoManutencao.findMany({
      where: { veiculoId },
      orderBy: { dataRealizada: 'desc' }
    });
    res.json(historico);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter histórico' });
  }
});

// POST /api/historico - adicionar manutenção ao histórico
router.post('/', requireAuth, async (req, res) => {
  const {
    veiculoId,
    tipo,
    dataRealizada,
    kmRealizado,
    custo,
    observacoes
  } = req.body;

  try {
    const nova = await prisma.historicoManutencao.create({
      data: {
        veiculoId,
        tipo,
        dataRealizada: new Date(dataRealizada),
        kmRealizado: parseInt(kmRealizado),
        custo: parseFloat(custo),
        observacoes
      }
    });
    res.status(201).json(nova);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar ao histórico' });
  }
});

module.exports = router;
