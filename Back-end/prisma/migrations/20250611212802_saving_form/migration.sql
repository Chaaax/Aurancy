-- CreateTable
CREATE TABLE "SavingForm" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "rendimentoMensal" REAL NOT NULL,
    "poupancaMensal" REAL NOT NULL,
    "objetivoPoupanca" TEXT NOT NULL,
    "maioresGastos" TEXT NOT NULL,
    "categoriasReduzir" TEXT NOT NULL,
    "nivelRisco" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SavingForm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
