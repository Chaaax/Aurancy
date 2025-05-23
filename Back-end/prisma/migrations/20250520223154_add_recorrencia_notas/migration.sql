-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DespesasMensais" (
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
INSERT INTO "new_DespesasMensais" ("categoria", "data", "descricao", "id", "userId", "valor") SELECT "categoria", "data", "descricao", "id", "userId", "valor" FROM "DespesasMensais";
DROP TABLE "DespesasMensais";
ALTER TABLE "new_DespesasMensais" RENAME TO "DespesasMensais";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
