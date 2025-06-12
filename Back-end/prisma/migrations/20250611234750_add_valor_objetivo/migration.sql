-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SavingForm" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "rendimentoMensal" REAL NOT NULL,
    "poupancaMensal" REAL NOT NULL,
    "objetivoPoupanca" TEXT NOT NULL,
    "valorObjetivo" REAL NOT NULL DEFAULT 0,
    "maioresGastos" TEXT NOT NULL,
    "categoriasReduzir" TEXT NOT NULL,
    "nivelRisco" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SavingForm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SavingForm" ("categoriasReduzir", "createdAt", "id", "maioresGastos", "nivelRisco", "objetivoPoupanca", "poupancaMensal", "rendimentoMensal", "userId") SELECT "categoriasReduzir", "createdAt", "id", "maioresGastos", "nivelRisco", "objetivoPoupanca", "poupancaMensal", "rendimentoMensal", "userId" FROM "SavingForm";
DROP TABLE "SavingForm";
ALTER TABLE "new_SavingForm" RENAME TO "SavingForm";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
