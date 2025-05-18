const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');

// Função de registo
const register = async (req, res) => {
  const { email, password, fullName, birthDate, country, phone, currency, profile } = req.body;

  if (!email || !password || !fullName || !birthDate || !country || !phone) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      return res.status(409).json({ error: 'Email já registado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        birthDate: new Date(birthDate),
        country,
        phone,
        currency,
        profile
      }
    });

    res.status(201).json({ message: 'Registo concluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao registar:', error);
    res.status(500).json({ error: 'Erro interno ao registar.' });
  }
};

// Função de login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e password são obrigatórios.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Login bem-sucedido!',
      token
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro interno ao fazer login.' });
  }
};

//getMe
const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        birthDate: true,
        country: true,
        phone: true,
        createdAt: true,
        currency: true,
        profile: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilizador não encontrado.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao obter utilizador:', error);
    res.status(500).json({ error: 'Erro interno.' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }, // Corrigido aqui
      select: {
        id: true,
        email: true,
        fullName: true,
        birthDate: true,
        country: true,
        phone: true,
        currency: true,
        profile: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilizador não encontrado.' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar o perfil do utilizador:', error);
    res.status(500).json({ error: 'Erro ao obter o perfil.' });
  }
};

// Exportar ambas as funções
module.exports = {
  register,
  login,
  getMe,
  getUserProfile
};

