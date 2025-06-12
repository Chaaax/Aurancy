-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "country" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "currency" TEXT,
    "profile" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profilePicture" TEXT
);

-- CreateTable
CREATE TABLE "DespesasMensais" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descricao" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "categoria" TEXT,
    "data" DATETIME NOT NULL,
    "recorrencia" TEXT NOT NULL DEFAULT 'única',
    "notas" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "DespesasMensais_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DespesasRecorrentes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "categoria" TEXT,
    "dataInicio" DATETIME NOT NULL,
    "dataFim" DATETIME NOT NULL,
    "recorrencia" TEXT NOT NULL,
    "notas" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "DespesasRecorrentes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EventoFinanceiro" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "data" DATETIME NOT NULL,
    "valor" REAL,
    "categoria" TEXT,
    "recorrencia" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EventoFinanceiro_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Veiculo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "mesEntrada" INTEGER,
    "tipo" TEXT NOT NULL,
    "kmAtual" INTEGER NOT NULL,
    "combustivel" TEXT,
    "ultimaInspecao" DATETIME,
    "seguroAte" DATETIME,
    CONSTRAINT "Veiculo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Manutencao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "veiculoId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT,
    "dataProxima" DATETIME NOT NULL,
    "kmProximo" INTEGER,
    "frequenciaMeses" INTEGER,
    "frequenciaKm" INTEGER,
    "notificar" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Manutencao_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HistoricoManutencao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "veiculoId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "dataRealizada" DATETIME NOT NULL,
    "kmRealizado" INTEGER NOT NULL,
    "custo" REAL NOT NULL,
    "observacoes" TEXT,
    CONSTRAINT "HistoricoManutencao_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Alerta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "manutencaoId" INTEGER NOT NULL,
    "dataAlerta" DATETIME NOT NULL,
    "tipoAlerta" TEXT NOT NULL,
    "notificado" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Alerta_manutencaoId_fkey" FOREIGN KEY ("manutencaoId") REFERENCES "Manutencao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Veiculo_matricula_key" ON "Veiculo"("matricula");
