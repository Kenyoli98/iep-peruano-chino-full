/*
  Warnings:

  - You are about to drop the column `fechaCompletado` on the `Usuario` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
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
    "resetTokenExpiry" DATETIME,
    "codigoEstudiante" TEXT,
    "estadoRegistro" TEXT NOT NULL DEFAULT 'activo',
    "fechaPreRegistro" DATETIME,
    "fechaActivacion" DATETIME,
    "fechaVencimiento" DATETIME,
    "intentosLogin" INTEGER NOT NULL DEFAULT 0,
    "ultimoLogin" DATETIME,
    "creadoPorAdmin" INTEGER
);
INSERT INTO "new_Usuario" ("apellido", "codigoEstudiante", "creadoPorAdmin", "direccion", "dni", "email", "estadoRegistro", "fechaActivacion", "fechaNacimiento", "fechaPreRegistro", "fechaVencimiento", "id", "intentosLogin", "nacionalidad", "nombre", "nombreApoderado", "password", "resetToken", "resetTokenExpiry", "rol", "sexo", "telefono", "telefonoApoderado", "ultimoLogin") SELECT "apellido", "codigoEstudiante", "creadoPorAdmin", "direccion", "dni", "email", "estadoRegistro", "fechaActivacion", "fechaNacimiento", "fechaPreRegistro", "fechaVencimiento", "id", "intentosLogin", "nacionalidad", "nombre", "nombreApoderado", "password", "resetToken", "resetTokenExpiry", "rol", "sexo", "telefono", "telefonoApoderado", "ultimoLogin" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
CREATE UNIQUE INDEX "Usuario_dni_key" ON "Usuario"("dni");
CREATE UNIQUE INDEX "Usuario_codigoEstudiante_key" ON "Usuario"("codigoEstudiante");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
