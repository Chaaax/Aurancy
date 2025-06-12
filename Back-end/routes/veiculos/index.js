const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Middleware para proteger rotas com autenticação
const requireAuth = async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Não autenticado' });
  }
  next();
};

// GET /veiculos - listar veículos do utilizador autenticado
router.get('/', requireAuth, async (req, res) => {
  try {
    const veiculos = await prisma.veiculo.findMany({
      where: { userId: req.user.id },
      orderBy: { marca: 'asc' }
    });
    res.json(veiculos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter veículos' });
  }
});

// POST /veiculos - adicionar novo veículo
router.post('/', requireAuth, async (req, res) => {
  const {
    marca,
    modelo,
    matricula,
    ano,
    tipo,
    kmAtual,
    mesEntrada,
    combustivel,
    ultimaInspecao,
    seguroAte
  } = req.body;

  try {
    const novoVeiculo = await prisma.veiculo.create({
      data: {
        userId: req.user.id,
        marca,
        modelo,
        matricula,
        ano: parseInt(ano),
        tipo,
        kmAtual: parseInt(kmAtual),
        mesEntrada: mesEntrada ? parseInt(mesEntrada) : null,
        combustivel: combustivel || null,
        ultimaInspecao: ultimaInspecao ? new Date(ultimaInspecao) : null,
        seguroAte: seguroAte ? new Date(seguroAte) : null
      }
    });
    res.status(201).json(novoVeiculo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar veículo' });
  }
});

// Verificar se matrícula já existe
router.get('/verificar-matricula', async (req, res) => {
  const { matricula } = req.query;
  try {
    const existe = await prisma.veiculo.findFirst({
      where: { matricula: matricula?.toUpperCase() }
    });

    res.json({ existe: !!existe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao verificar matrícula' });
  }
});


// PUT /veiculos/:id - atualizar dados de um veículo
router.put('/:id', requireAuth, async (req, res) => {
  const veiculoId = parseInt(req.params.id);
  const {
    marca,
    modelo,
    matricula,
    ano,
    tipo,
    kmAtual,
    mesEntrada,
    combustivel,
    ultimaInspecao,
    seguroAte
  } = req.body;

  try {
    // Verificar se veículo existe e pertence ao utilizador autenticado
    const veiculoExistente = await prisma.veiculo.findUnique({
      where: { id: veiculoId }
    });

    if (!veiculoExistente || veiculoExistente.userId !== req.user.id) {
      return res.status(403).json({ error: 'Veículo não encontrado ou sem permissão' });
    }

    const veiculoAtualizado = await prisma.veiculo.update({
      where: { id: veiculoId },
      data: {
        marca,
        modelo,
        matricula,
        ano: ano ? parseInt(ano) : null,
        tipo,
        kmAtual: kmAtual ? parseInt(kmAtual) : null,
        mesEntrada: mesEntrada ? parseInt(mesEntrada) : null,
        combustivel: combustivel || null,
        ultimaInspecao: ultimaInspecao ? new Date(ultimaInspecao) : null,
        seguroAte: seguroAte ? new Date(seguroAte) : null
      }
    });

    res.json(veiculoAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar veículo:', error);
    res.status(500).json({ error: 'Erro ao atualizar veículo' });
  }
});

module.exports = router;
