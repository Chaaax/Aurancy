const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { PrismaClient } = require('@prisma/client');
const authenticate = require('../middlewares/auth'); // ⬅ Middleware JWT

const prisma = new PrismaClient();

console.log('🔑 Chave Stripe carregada:', process.env.STRIPE_SECRET_KEY);

// 🔁 Criar sessão de pagamento (não requer auth)
router.post('/create-checkout-session', async (req, res) => {
  const {
    nome = "Aurancy Premium",
    valor = 4.99,
    descricao = "Acesso a funcionalidades exclusivas",
    pagamentoId = null
  } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: nome,
              description: descricao,
            },
            unit_amount: Math.round(valor * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        pagamentoId: pagamentoId || 'premium',
      },
      success_url: `http://localhost:5173/pagamento/sucesso?pid=${pagamentoId || 'premium'}`,
      cancel_url: `http://localhost:5173/pagamento/cancelado`,
    });

    console.log('✅ Sessão Stripe criada:', session.url);
    res.json({ url: session.url });
  } catch (err) {
    console.error('❌ Erro Stripe:', err);
    res.status(500).json({ error: 'Erro ao criar sessão Stripe' });
  }
});

// ✅ Confirmar pagamento depois de sucesso
router.put('/confirmar/:id', async (req, res) => {
  const pagamentoId = req.params.id;

  try {
    await prisma.pagamentoRecorrente.update({
      where: { id: pagamentoId },
      data: { ultimoPagamento: new Date() },
    });

    res.json({ message: 'Pagamento registado com sucesso!' });
  } catch (err) {
    console.error('❌ Erro ao confirmar pagamento:', err);
    res.status(500).json({ error: 'Erro ao confirmar pagamento.' });
  }
});

// ✅ Criar novo pagamento (autenticado)
router.post('/', authenticate, async (req, res) => {
  const { nome, valor, dataRenovacao, categoria } = req.body;

  try {
    const novoPagamento = await prisma.pagamentoRecorrente.create({
      data: {
        userId: req.user.id, // vem do token
        nome,
        valor,
        dataRenovacao,
        categoria,
      },
    });

    res.status(201).json(novoPagamento);
  } catch (err) {
    console.error('Erro ao criar pagamento:', err);
    res.status(500).json({ error: 'Erro ao criar pagamento.' });
  }
});

// ✅ Apagar pagamento
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.pagamentoRecorrente.delete({ where: { id } });
    res.json({ message: 'Pagamento removido com sucesso.' });
  } catch (err) {
    console.error('Erro ao remover pagamento:', err);
    res.status(500).json({ error: 'Erro ao remover pagamento.' });
  }
});

// ✅ Obter todos os pagamentos do utilizador autenticado
router.get('/user', authenticate, async (req, res) => {
  try {
    const pagamentos = await prisma.pagamentoRecorrente.findMany({
      where: { userId: req.user.id },
      orderBy: { dataRenovacao: 'asc' },
    });

    res.json(pagamentos);
  } catch (err) {
    console.error('Erro ao buscar pagamentos:', err);
    res.status(500).json({ error: 'Erro ao buscar pagamentos.' });
  }
});

module.exports = router;

