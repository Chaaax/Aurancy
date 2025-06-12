const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Middleware de autenticação
const authenticate = require("../middlewares/auth");

// POST /api/saving – Cria ou atualiza o formulário
router.post("/", authenticate, async (req, res) => {
  try {
    const {
      rendimentoMensal,
      poupancaMensal,
      objetivoPoupanca,
      valorObjetivo,   
      maioresGastos,
      categoriasReduzir,
      nivelRisco,
    } = req.body;

    const rendimento = parseFloat(rendimentoMensal);
    const poupanca = parseFloat(poupancaMensal);
    const valor = parseFloat(valorObjetivo);

    if (isNaN(rendimento) || isNaN(poupanca) || isNaN(valor)) {
      return res.status(400).json({ message: "Valores numéricos inválidos" });
    }

    const existente = await prisma.savingForm.findFirst({
      where: { userId: req.user.id },
    });

    if (existente) {
      // Atualiza o formulário existente
      const atualizado = await prisma.savingForm.update({
        where: { id: existente.id },
        data: {
          rendimentoMensal: rendimento,
          poupancaMensal: poupanca,
          objetivoPoupanca,
          valorObjetivo: valor, // <-- AQUI
          maioresGastos: JSON.stringify(maioresGastos),
          categoriasReduzir: JSON.stringify(categoriasReduzir),
          nivelRisco,
        },
      });
      return res.json(atualizado);
    }

    // Cria novo se não existir
    const novoForm = await prisma.savingForm.create({
      data: {
        userId: req.user.id,
        rendimentoMensal: rendimento,
        poupancaMensal: poupanca,
        objetivoPoupanca,
        valorObjetivo: valor, // <-- E AQUI
        maioresGastos: JSON.stringify(maioresGastos),
        categoriasReduzir: JSON.stringify(categoriasReduzir),
        nivelRisco,
      },
    });

    res.status(201).json(novoForm);
  } catch (error) {
    console.error("Erro ao guardar formulário:", error);
    res.status(500).json({ message: "Erro ao guardar formulário" });
  }
});

// GET /api/saving/user – Obter o formulário do utilizador autenticado
router.get("/user", authenticate, async (req, res) => {
  try {
    const form = await prisma.savingForm.findFirst({
      where: { userId: req.user.id },
    });

    if (!form) return res.status(404).json({ message: "Nenhum formulário encontrado." });

    // Parse dos arrays JSON
    form.maioresGastos = JSON.parse(form.maioresGastos);
    form.categoriasReduzir = JSON.parse(form.categoriasReduzir);

    res.json(form);
  } catch (err) {
    console.error("Erro ao buscar formulário:", err);
    res.status(500).json({ message: "Erro interno ao buscar formulário." });
  }
});

module.exports = router;

