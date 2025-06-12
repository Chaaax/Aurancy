-- CreateTable
CREATE TABLE "PagamentoRecorrente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "dataRenovacao" INTEGER NOT NULL,
    "categoria" TEXT,
    "ultimoPagamento" DATETIME,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PagamentoRecorrente_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
