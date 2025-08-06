/*
  Warnings:

  - You are about to drop the column `smsResetToken` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `smsResetTokenExpiry` on the `Usuario` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "fechaNacimiento" TEXT,
    "sexo" TEXT,
    "nacionalidad" TEXT,
    "dni" TEXT,
    "direccion" TEXT,
    "telefono" TEXT,
    "nombreApoderado" TEXT,
    "telefonoApoderado" TEXT,
    "resetToken" TEXT,
    "resetTokenExpiry" DATETIME
);
INSERT INTO "new_Usuario" ("apellido", "direccion", "dni", "email", "fechaNacimiento", "id", "nacionalidad", "nombre", "nombreApoderado", "password", "resetToken", "resetTokenExpiry", "rol", "sexo", "telefono", "telefonoApoderado") SELECT "apellido", "direccion", "dni", "email", "fechaNacimiento", "id", "nacionalidad", "nombre", "nombreApoderado", "password", "resetToken", "resetTokenExpiry", "rol", "sexo", "telefono", "telefonoApoderado" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
