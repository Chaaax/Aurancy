const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Função para gerar despesas reais com base nas recorrentes
async function gerarDespesasPendentes(userId) {
  const hoje = new Date()
  const dataHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())

  const recorrentes = await prisma.despesaRecorrente.findMany({
    where: {
      userId,
      dataInicio: { lte: dataHoje },
      dataFim: { gte: dataHoje }
    }
  })

  for (const despesa of recorrentes) {
    const ultima = await prisma.despesaMensal.findFirst({
      where: {
        userId,
        descricao: despesa.titulo,
        categoria: despesa.categoria,
        valor: despesa.valor
      },
      orderBy: { data: 'desc' }
    })

    let deveCriar = false
    let proximaData = dataHoje

    if (!ultima) {
      deveCriar = true
    } else {
      const ultimaData = new Date(ultima.data)
      switch (despesa.recorrencia) {
        case 'mensal':
          deveCriar = ultimaData.getMonth() !== dataHoje.getMonth() || ultimaData.getFullYear() !== dataHoje.getFullYear()
          break
        case 'anual':
          deveCriar = ultimaData.getFullYear() !== dataHoje.getFullYear()
          break
        case 'semanal': {
          const diff = (dataHoje - ultimaData) / (1000 * 60 * 60 * 24)
          deveCriar = diff >= 7
          break
        }
        default:
          break
      }
    }

    if (deveCriar) {
      await prisma.despesaMensal.create({
        data: {
          descricao: despesa.titulo,
          valor: despesa.valor,
          categoria: despesa.categoria,
          data: dataHoje,
          recorrencia: despesa.recorrencia,
          notas: despesa.notas,
          userId: userId
        }
      })
    }
  }
}

module.exports = gerarDespesasPendentes