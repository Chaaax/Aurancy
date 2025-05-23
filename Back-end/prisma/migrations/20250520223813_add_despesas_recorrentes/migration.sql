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
