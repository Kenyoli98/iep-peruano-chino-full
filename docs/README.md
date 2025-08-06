# Sistema de Gestión Educativa - I.E.P Peruano Chino

## 📋 Descripción

Sistema integral de gestión educativa desarrollado para la Institución Educativa Privada Peruano Chino. Automatiza y optimiza los procesos administrativos y académicos, mejorando la experiencia de estudiantes, profesores y administradores.

## 🚀 Características Principales

- **Gestión de Usuarios**: Administradores, profesores y estudiantes
- **Gestión Académica**: Cursos, secciones, notas y asignaciones
- **Sistema de Autenticación**: JWT con roles y permisos
- **Dashboard Personalizado**: Interfaces específicas por rol
- **Gestión de Matrículas**: Sistema completo de inscripciones
- **Sistema de Pensiones**: Gestión financiera integrada
- **Reportes y Estadísticas**: Analytics en tiempo real

## 🛠️ Tecnologías

### Backend
- **Node.js** con Express
- **Prisma ORM** con SQLite
- **JWT** para autenticación
- **Bcrypt** para encriptación
- **Nodemailer** para emails

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **React Hook Form**
- **Axios** para HTTP requests

## 📁 Estructura del Proyecto

```
├── backend/                 # API y lógica del servidor
│   ├── controllers/         # Controladores de rutas
│   ├── middlewares/         # Middlewares de autenticación
│   ├── routes/             # Definición de rutas
│   ├── services/           # Servicios (email, etc.)
│   ├── prisma/             # Base de datos y migraciones
│   └── scripts/            # Scripts de utilidad organizados
│       ├── maintenance/    # Scripts de mantenimiento
│       ├── database-setup/ # Scripts de configuración DB
│       └── utilities/      # Utilidades y pruebas
├── frontend/               # Aplicación web
│   └── src/
│       ├── app/           # Páginas (App Router)
│       ├── components/    # Componentes reutilizables
│       ├── services/      # Servicios API
│       └── types/         # Tipos TypeScript
├── docs/                   # Documentación del proyecto
└── data/                   # Archivos de datos de ejemplo
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- npm o yarn

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configurar variables de entorno
npx prisma generate
npx prisma db push
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔧 Scripts Disponibles

### Backend
- `npm run dev` - Servidor de desarrollo
- `npm start` - Servidor de producción
- `npx prisma studio` - Interface visual de la DB
- `node crear_admin.js` - Crear usuario administrador

### Frontend
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run start` - Servidor de producción

## 📚 Documentación

La documentación completa se encuentra en la carpeta `docs/`:

- [Flujo del Producto](docs/FLUJO_DEL_PRODUCTO.md)
- [Auditoría de Seguridad](docs/AUDITORIA_SEGURIDAD.md)
- [Configuración de Email](docs/README_EMAIL_COMPLETO.md)
- [Validación de Email Frontend](docs/VALIDACION_EMAIL_FRONTEND.md)
- [Changelog](docs/CHANGELOG.md)

## 🔐 Seguridad

- Autenticación JWT
- Encriptación de contraseñas con bcrypt
- Middleware de autorización por roles
- Validación de datos en frontend y backend
- Protección CORS configurada

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y pertenece a la I.E.P Peruano Chino.

## 👥 Equipo de Desarrollo

- **Desarrollador Principal**: [Tu Nombre]
- **Institución**: I.E.P Peruano Chino

## 📞 Soporte

Para soporte técnico o consultas, contactar al equipo de desarrollo.