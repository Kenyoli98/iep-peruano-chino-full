# Guía de Contribución

## Configuración del Entorno de Desarrollo

### Prerrequisitos
- Node.js >= 18.0.0
- npm >= 8.0.0
- Git

### Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd "I.E.P Proyect copia"
```

2. Instala todas las dependencias:
```bash
npm run install:all
```

3. Configura las variables de entorno:
```bash
# Backend
cp backend/.env.example backend/.env
# Edita backend/.env con tus configuraciones

# Frontend (si es necesario)
cp frontend/.env.example frontend/.env.local
```

4. Configura la base de datos:
```bash
npm run db:generate
npm run db:push
```

5. Inicia los servidores de desarrollo:
```bash
npm run dev
```

## Estructura del Proyecto

```
├── backend/                 # API Backend (Node.js + Express)
│   ├── controllers/         # Controladores de rutas
│   ├── middleware/          # Middleware personalizado
│   ├── prisma/             # Esquema y migraciones de base de datos
│   ├── routes/             # Definición de rutas
│   ├── scripts/            # Scripts de utilidad
│   └── services/           # Lógica de negocio
├── frontend/               # Frontend (Next.js 14)
│   ├── src/
│   │   ├── app/            # App Router de Next.js
│   │   ├── components/     # Componentes reutilizables
│   │   └── services/       # Servicios de API
├── docs/                   # Documentación del proyecto
├── data/                   # Archivos de datos de ejemplo
└── .vscode/               # Configuración de VSCode
```

## Estándares de Código

### Formateo y Linting

El proyecto utiliza ESLint y Prettier para mantener la consistencia del código:

```bash
# Verificar formato
npm run format:check

# Formatear código
npm run format

# Verificar linting
npm run lint

# Corregir problemas de linting
npm run lint:fix
```

### Convenciones de Nomenclatura

- **Archivos**: kebab-case (`user-profile.tsx`)
- **Componentes**: PascalCase (`UserProfile`)
- **Variables/Funciones**: camelCase (`getUserData`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Carpetas**: kebab-case (`user-management`)

### Estructura de Componentes React

```typescript
// components/ui/Button.tsx
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  return (
    <button
      className={`btn ${variant === 'primary' ? 'btn-primary' : 'btn-secondary'}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### Estructura de APIs Backend

```javascript
// controllers/userController.js
const userService = require('../services/userService');

const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getUsers };
```

## Flujo de Trabajo Git

### Ramas

- `main`: Rama principal (producción)
- `develop`: Rama de desarrollo
- `feature/nombre-feature`: Nuevas características
- `fix/nombre-fix`: Corrección de errores
- `hotfix/nombre-hotfix`: Correcciones urgentes

### Commits

Utiliza mensajes de commit descriptivos siguiendo el formato:

```
tipo(alcance): descripción breve

Descripción más detallada si es necesaria

Fixes #123
```

Tipos de commit:
- `feat`: Nueva característica
- `fix`: Corrección de error
- `docs`: Documentación
- `style`: Cambios de formato
- `refactor`: Refactorización
- `test`: Pruebas
- `chore`: Tareas de mantenimiento

Ejemplos:
```
feat(auth): agregar autenticación con JWT
fix(ui): corregir alineación en el dashboard
docs(api): actualizar documentación de endpoints
```

## Testing

### Frontend
```bash
cd frontend
npm run test
npm run test:watch
npm run test:coverage
```

### Backend
```bash
cd backend
npm run test
npm run test:integration
```

## Base de Datos

### Migraciones

```bash
# Crear nueva migración
npm run db:migrate

# Aplicar cambios al esquema
npm run db:push

# Resetear base de datos
npm run db:reset

# Abrir Prisma Studio
npm run db:studio
```

### Seeders

```bash
# Ejecutar seeders
npm run db:seed
```

## Despliegue

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

## Resolución de Problemas

### Limpiar Proyecto
```bash
npm run clean
npm run install:all
```

### Regenerar Cliente Prisma
```bash
npm run db:generate
```

### Verificar Configuración
```bash
# Verificar versiones
node --version
npm --version

# Verificar dependencias
npm ls
```

## Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Guía de TailwindCSS](https://tailwindcss.com/docs)
- [Express.js](https://expressjs.com/)

## Contacto

Para preguntas o soporte, contacta al equipo de desarrollo.