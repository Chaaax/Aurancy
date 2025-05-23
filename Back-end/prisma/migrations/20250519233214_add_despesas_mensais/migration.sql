-- CreateTable
CREATE TABLE "DespesasMensais" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descricao" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "categoria" TEXT,
    "data" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "DespesasMensais_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
