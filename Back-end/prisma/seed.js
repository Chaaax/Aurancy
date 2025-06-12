const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {

  
const user = await prisma.user.upsert({
  where: { email: 'admin@teste.com' },
  update: {}, // não altera nada se já existir
  create: {
    email: 'admin@teste.com',
    password: '123456',
    fullName: 'Admin Teste',
    birthDate: new Date('1990-01-01'),
    country: 'Portugal',
    phone: '912345678',
    currency: 'EUR'
  }
});


  // 2. Adicionar um veículo a esse utilizador
    const veiculo = await prisma.veiculo.create({
      data: {
        userId: user.id,
        marca: 'Toyota',
        modelo: 'Corolla',
        matricula: 'AB-12-CD',
        ano: 2016,
        tipo: 'Ligeiro',
        kmAtual: 132000,
        mesEntrada: 5, // Maio (por exemplo)
        combustivel: 'Gasolina',
        ultimaInspecao: new Date('2023-06-10'),
        seguroAte: new Date('2025-01-01')
      }
    });

  // 3. Criar manutenções futuras para esse veículo
  await prisma.manutencao.createMany({
    data: [
      {
        veiculoId: veiculo.id,
        tipo: 'Inspeção',
        descricao: 'IPO obrigatória',
        dataProxima: new Date('2025-07-01'),
        notificar: true
      },
      {
        veiculoId: veiculo.id,
        tipo: 'Troca de Óleo',
        descricao: 'Óleo 10W40',
        dataProxima: new Date('2025-06-15'),
        kmProximo: 140000,
        frequenciaKm: 8000,
        frequenciaMeses: 6,
        notificar: true
      }
    ]
  });

  // 4. Criar histórico de manutenção passada
  await prisma.historicoManutencao.create({
    data: {
      veiculoId: veiculo.id,
      tipo: 'Troca de Pneus',
      dataRealizada: new Date('2024-11-15'),
      kmRealizado: 127000,
      custo: 250.00,
      observacoes: 'Pneus dianteiros e alinhamento'
    }
  });

  console.log('✅ Seed concluído!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
