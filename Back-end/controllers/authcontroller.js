const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../prismaClient')
const multer = require('multer')
const streamifier = require('streamifier')
const { cloudinary } = require('../config/cloudinaryConfig')

const upload = multer({ storage: multer.memoryStorage() })

// Função de registo
const register = async (req, res) => {
  const { email, password, fullName, birthDate, country, phone, currency, profile } = req.body

  if (!email || !password || !fullName || !birthDate || !country || !phone) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' })
  }

  try {
    const userExists = await prisma.user.findUnique({ where: { email } })

    if (userExists) {
      return res.status(409).json({ error: 'Email já registado.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        birthDate: new Date(birthDate),
        country,
        phone,
        currency,
        profile,
      },
    })

    res.status(201).json({ message: 'Registo concluído com sucesso!' })
  } catch (error) {
    console.error('Erro ao registar:', error)
    res.status(500).json({ error: 'Erro interno ao registar.' })
  }
}

// Função de login
const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e password são obrigatórios.' })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas.' })
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    )

    res.status(200).json({
      message: 'Login bem-sucedido!',
      token,
    })
  } catch (error) {
    console.error('Erro ao fazer login:', error)
    res.status(500).json({ error: 'Erro interno ao fazer login.' })
  }
}

// GET /api/auth/me
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
        profile: true,
        profilePicture: true,
      },
    })

    if (!user) {
      return res.status(404).json({ error: 'Utilizador não encontrado.' })
    }

    // Agora o profilePicture já é um URL direto (público)
    if (user.profilePicture) {
      user.profilePictureUrl = user.profilePicture
    }

    res.status(200).json(user)
  } catch (error) {
    console.error('Erro ao obter utilizador:', error)
    res.status(500).json({ error: 'Erro interno.' })
  }
}

// GET /api/auth/user-profile
const getUserProfile = async (req, res) => {
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
        currency: true,
        profile: true,
      },
    })

    if (!user) {
      return res.status(404).json({ error: 'Utilizador não encontrado.' })
    }

    res.json(user)
  } catch (error) {
    console.error('Erro ao buscar o perfil do utilizador:', error)
    res.status(500).json({ error: 'Erro ao obter o perfil.' })
  }
}

// POST /api/auth/upload-profile-picture
const uploadProfilePicture = [
  upload.single('image'),
  async (req, res) => {
    try {
      const userId = req.user.id

      if (!req.file) {
        return res.status(400).json({ error: 'Nenhuma imagem foi enviada.' })
      }

      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'aurancy-profile-pictures',
              public_id: `user-${userId}-${Date.now()}`,
              resource_type: 'image',
              format: 'png',
            },
            (error, result) => {
              if (result) {
                resolve(result)
              } else {
                reject(error)
              }
            }
          )

          streamifier.createReadStream(req.file.buffer).pipe(stream)
        })
      }

      const result = await streamUpload()

      await prisma.user.update({
        where: { id: userId },
        data: {
          profilePicture: result.secure_url, // guardamos o link direto
        },
      })

      res.status(200).json({ imageUrl: result.secure_url })
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error)
      res.status(500).json({ error: 'Erro ao guardar imagem.' })
    }
  }
]

module.exports = {
  register,
  login,
  getMe,
  getUserProfile,
  uploadProfilePicture,
}
