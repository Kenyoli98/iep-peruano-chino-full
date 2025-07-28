-- CreateTable
CREATE TABLE "Usuario" (
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
    "telefonoApoderado" TEXT
);

-- CreateTable
CREATE TABLE "Curso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT
);

-- CreateTable
CREATE TABLE "Seccion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "grado" INTEGER NOT NULL,
    "nivel" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AsignacionProfesor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "profesorId" INTEGER NOT NULL,
    "cursoId" INTEGER NOT NULL,
    "seccionId" INTEGER NOT NULL,
    "anioAcademico" INTEGER NOT NULL,
    CONSTRAINT "AsignacionProfesor_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AsignacionProfesor_profesorId_fkey" FOREIGN KEY ("profesorId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AsignacionProfesor_seccionId_fkey" FOREIGN KEY ("seccionId") REFERENCES "Seccion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Horario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "asignacionId" INTEGER NOT NULL,
    "dia" TEXT NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFin" TEXT NOT NULL,
    CONSTRAINT "Horario_asignacionId_fkey" FOREIGN KEY ("asignacionId") REFERENCES "AsignacionProfesor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Matricula" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "alumnoId" INTEGER NOT NULL,
    "grado" TEXT NOT NULL,
    "seccion" TEXT NOT NULL,
    "anioAcademico" INTEGER NOT NULL,
    "fechaRegistro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creadoPorId" INTEGER NOT NULL,
    "modificadoPorId" INTEGER,
    "eliminadoPorId" INTEGER,
    CONSTRAINT "Matricula_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Matricula_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Matricula_eliminadoPorId_fkey" FOREIGN KEY ("eliminadoPorId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Matricula_modificadoPorId_fkey" FOREIGN KEY ("modificadoPorId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Nota" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "alumnoId" INTEGER NOT NULL,
    "curso" TEXT NOT NULL,
    "bimestre" INTEGER NOT NULL,
    "calificacion" REAL NOT NULL,
    "profesorId" INTEGER NOT NULL,
    CONSTRAINT "Nota_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Nota_profesorId_fkey" FOREIGN KEY ("profesorId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pension" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "alumnoId" INTEGER NOT NULL,
    "mes" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "estadoPago" BOOLEAN NOT NULL DEFAULT false,
    "fechaRegistro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Pension_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Curso_nombre_key" ON "Curso"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Seccion_nombre_grado_nivel_key" ON "Seccion"("nombre", "grado", "nivel");

-- CreateIndex
CREATE INDEX "AsignacionProfesor_cursoId_fkey" ON "AsignacionProfesor"("cursoId");

-- CreateIndex
CREATE INDEX "AsignacionProfesor_profesorId_fkey" ON "AsignacionProfesor"("profesorId");

-- CreateIndex
CREATE INDEX "AsignacionProfesor_seccionId_fkey" ON "AsignacionProfesor"("seccionId");

-- CreateIndex
CREATE INDEX "Horario_asignacionId_fkey" ON "Horario"("asignacionId");

-- CreateIndex
CREATE INDEX "Matricula_alumnoId_fkey" ON "Matricula"("alumnoId");

-- CreateIndex
CREATE INDEX "Matricula_creadoPorId_fkey" ON "Matricula"("creadoPorId");

-- CreateIndex
CREATE INDEX "Matricula_eliminadoPorId_fkey" ON "Matricula"("eliminadoPorId");

-- CreateIndex
CREATE INDEX "Matricula_modificadoPorId_fkey" ON "Matricula"("modificadoPorId");

-- CreateIndex
CREATE INDEX "Nota_alumnoId_fkey" ON "Nota"("alumnoId");

-- CreateIndex
CREATE INDEX "Nota_profesorId_fkey" ON "Nota"("profesorId");

-- CreateIndex
CREATE INDEX "Pension_alumnoId_fkey" ON "Pension"("alumnoId");
