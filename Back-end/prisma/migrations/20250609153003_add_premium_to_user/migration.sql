-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
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
    "profilePicture" TEXT,
    "premium" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("birthDate", "country", "createdAt", "currency", "email", "fullName", "id", "password", "phone", "profile", "profilePicture") SELECT "birthDate", "country", "createdAt", "currency", "email", "fullName", "id", "password", "phone", "profile", "profilePicture" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
