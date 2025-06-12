const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Middleware de autenticação (supondo que já tens req.user.id a funcionar)
const requireAuth = async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Não autenticado' });
  }
  next();
};

// GET /api/manutencoes/:veiculoId - listar manutenções futuras de um veículo
router.get('/:veiculoId', requireAuth, async (req, res) => {
  const veiculoId = parseInt(req.params.veiculoId);

  try {
    const manutencoes = await prisma.manutencao.findMany({
      where: { veiculoId },
      orderBy: { dataProxima: 'asc' }
    });
    res.json(manutencoes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter manutenções' });
  }
});

// POST /api/manutencoes - criar nova manutenção
router.post('/', requireAuth, async (req, res) => {
  const {
    veiculoId,
    tipo,
    descricao,
    dataProxima,
    kmProximo,
    frequenciaKm,
    frequenciaMeses,
    notificar
  } = req.body;

  try {
    const nova = await prisma.manutencao.create({
      data: {
        veiculoId,
        tipo,
        descricao,
        dataProxima: new Date(dataProxima),
        kmProximo: kmProximo ? parseInt(kmProximo) : null,
        frequenciaKm: frequenciaKm ? parseInt(frequenciaKm) : null,
        frequenciaMeses: frequenciaMeses ? parseInt(frequenciaMeses) : null,
        notificar: notificar !== undefined ? Boolean(notificar) : true
      }
    });
    res.status(201).json(nova);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar manutenção' });
  }
});

module.exports = router;
