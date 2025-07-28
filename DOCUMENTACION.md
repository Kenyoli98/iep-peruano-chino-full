# Documentación del Sistema I.E.P Peruano Chino

## Descripción General

Sistema de gestión educativa para la Institución Educativa Privada Peruano Chino. Es una aplicación web completa que permite administrar estudiantes, profesores, cursos, matrículas, notas y pensiones.

## Arquitectura del Sistema

### Stack Tecnológico

**Frontend:**
- Next.js 15.3.5 (React Framework)
- TypeScript
- Tailwind CSS
- React Icons
- Axios para peticiones HTTP
- React Hot Toast para notificaciones

**Backend:**
- Node.js con Express.js
- Prisma ORM
- MySQL como base de datos
- JWT para autenticación
- bcryptjs para encriptación de contraseñas
- Multer para manejo de archivos

## Estructura del Proyecto

```
I.E.P Proyect/
├── backend/                 # API REST
│   ├── controllers/         # Lógica de negocio
│   ├── middlewares/         # Middlewares de autenticación y autorización
│   ├── routes/             # Definición de rutas
│   ├── prisma/             # Esquema de base de datos y migraciones
│   └── scripts/            # Scripts de utilidad
├── frontend/               # Aplicación web
│   └── src/
│       ├── app/            # Páginas (App Router de Next.js)
│       ├── components/     # Componentes reutilizables
│       ├── hooks/          # Hooks personalizados
│       ├── services/       # Servicios para API calls
│       └── styles/         # Estilos globales
└── CHANGELOG.md           # Historial de cambios
```

## Modelo de Datos

### Entidades Principales

#### Usuario
- **Roles:** admin, profesor, alumno
- **Campos:** nombre, apellido, email, password, rol, fechaNacimiento, sexo, nacionalidad, dni, dirección, teléfono
- **Campos adicionales para alumnos:** nombreApoderado, telefonoApoderado

#### Curso
- **Campos:** id, nombre
- **Relaciones:** Asignaciones con profesores

#### Sección
- **Campos:** nombre, grado, nivel
- **Restricción:** Combinación única de nombre, grado y nivel

#### AsignacionProfesor
- **Relaciones:** Profesor, Curso, Sección
- **Campos:** anioAcademico
- **Incluye:** Horarios asociados

#### Matricula
- **Campos:** alumnoId, grado, sección, anioAcademico, fechaRegistro
- **Auditoria:** creadoPor, modificadoPor, eliminadoPor

#### Nota
- **Campos:** alumnoId, curso, bimestre, calificacion, profesorId

#### Pension
- **Campos:** alumnoId, mes, anio, estadoPago, fechaRegistro

## API Endpoints

### Autenticación
- `POST /usuarios/login` - Inicio de sesión
- `POST /usuarios/registro` - Registro de usuarios

### Gestión de Usuarios
- `GET /usuarios` - Listar usuarios
- `POST /usuarios` - Crear usuario
- `PUT /usuarios/:id` - Actualizar usuario
- `DELETE /usuarios/:id` - Eliminar usuario

### Gestión Académica
- `GET /cursos` - Listar cursos
- `POST /cursos` - Crear curso
- `GET /secciones` - Listar secciones
- `POST /secciones` - Crear sección
- `GET /asignaciones` - Listar asignaciones
- `POST /asignaciones` - Crear asignación

### Gestión de Matrículas
- `GET /matricula` - Listar matrículas
- `POST /matricula` - Crear matrícula
- `PUT /matricula/:id` - Actualizar matrícula
- `DELETE /matricula/:id` - Eliminar matrícula

### Gestión de Notas
- `GET /notas` - Listar notas
- `POST /notas` - Registrar nota
- `PUT /notas/:id` - Actualizar nota

### Gestión de Pensiones
- `GET /pensiones` - Listar pensiones
- `POST /pensiones` - Registrar pensión
- `PUT /pensiones/:id` - Actualizar estado de pago

## Funcionalidades del Sistema

### Panel Administrativo
1. **Dashboard Principal** - Resumen del sistema
2. **Gestión de Usuarios** - CRUD completo de usuarios
3. **Registro de Usuarios** - Formulario especializado para crear usuarios
4. **Gestión de Cursos** - Administración de materias
5. **Gestión de Secciones** - Organización por grados y niveles
6. **Asignaciones** - Asignación de profesores a cursos y secciones
7. **Matrículas** - Proceso de matriculación de estudiantes
8. **Gestión de Notas** - Registro y consulta de calificaciones
9. **Gestión de Pensiones** - Control de pagos mensuales

### Sistema de Autenticación
- Login con email y contraseña
- Tokens JWT con expiración configurable
- Opción "Recordar sesión" (7 días vs 2 horas)
- Middleware de verificación de tokens
- Control de acceso basado en roles

### Características de Seguridad
- Contraseñas encriptadas con bcrypt
- Validación de datos en frontend y backend
- Protección de rutas por roles
- Sanitización de inputs
- Manejo seguro de errores

## Configuración y Despliegue

### Requisitos Previos
- Node.js (versión 18 o superior)
- MySQL
- npm o yarn

### Instalación Backend
```bash
cd backend
npm install
# Configurar variables de entorno
npx prisma migrate dev
npm run dev
```

### Instalación Frontend
```bash
cd frontend
npm install
npm run dev
```

### Variables de Entorno
**Backend (.env):**
```
DATABASE_URL="mysql://usuario:password@localhost:3306/iep_db"
JWT_SECRET="tu_clave_secreta_jwt"
PORT=3001
```

### Puertos por Defecto
- Backend: http://localhost:3001
- Frontend: http://localhost:3000

## Estructura de Componentes Frontend

### Layouts
- `RootLayout` - Layout principal de la aplicación
- `AdminLayout` - Layout específico para el panel administrativo

### Componentes Principales
- `AdminSidebar` - Barra lateral de navegación
- `AdminHeader` - Cabecera del panel administrativo
- `LoadingOverlay` - Overlay de carga
- `Modal` - Modal reutilizable para mensajes

### Hooks Personalizados
- `useAuth` - Manejo de autenticación y autorización
- `useLogin` - Lógica específica del formulario de login

### Servicios
- `api.js` - Configuración base de Axios
- `auth.js` - Servicios de autenticación
- `registroUsuarioService.ts` - Servicio para registro de usuarios
- `cursosService.ts` - Servicios para gestión de cursos
- `seccionesService.ts` - Servicios para gestión de secciones
- `asignacionesService.ts` - Servicios para asignaciones
- `profesoresService.ts` - Servicios para gestión de profesores

## Flujo de Trabajo

### Proceso de Matrícula
1. Registro del alumno en el sistema
2. Creación de la matrícula con grado y sección
3. Asignación automática a cursos según el grado
4. Generación de pensiones mensuales

### Proceso de Asignación de Profesores
1. Creación de cursos y secciones
2. Asignación de profesores a combinaciones curso-sección
3. Definición de horarios para cada asignación

### Proceso de Evaluación
1. Registro de notas por bimestre
2. Asociación con profesor que califica
3. Consulta y reportes de rendimiento

## Consideraciones de Desarrollo

### Buenas Prácticas Implementadas
- Separación clara entre frontend y backend
- Validación de datos en ambos extremos
- Manejo consistente de errores
- Código modular y reutilizable
- Documentación de cambios en CHANGELOG

### Áreas de Mejora Sugeridas
1. **Testing:** Implementar pruebas unitarias y de integración
2. **Logging:** Sistema de logs más robusto
3. **Caching:** Implementar cache para consultas frecuentes
4. **Backup:** Sistema automatizado de respaldos
5. **Monitoring:** Herramientas de monitoreo en producción
6. **Documentation:** API documentation con Swagger
7. **Performance:** Optimización de consultas y paginación

## Contacto y Soporte

Para consultas sobre el sistema, revisar el CHANGELOG.md para ver el historial de cambios y mejoras implementadas.

---

*Documentación generada para el Sistema I.E.P Peruano Chino*
*Última actualización: Diciembre 2024*