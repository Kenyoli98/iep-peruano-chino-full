# CHANGELOG

Este archivo documenta los cambios y refactorizaciones importantes realizados en el proyecto, indicando la ruta de cada archivo modificado o creado.

---

## [Unreleased] - Refactorización de Login (Backend y Frontend)

### Backend
- **backend/controllers/usuariosController.js**
  - Refactorización de la función `loginUsuario`:
    - Validación de formato y longitud de email/contraseña.
    - Respuestas estructuradas con códigos de error claros.
    - Soporte para el parámetro `rememberMe` (token de sesión prolongada).
    - Uso de variable de entorno para la clave JWT.

---

### Frontend
- **frontend/src/components/ui/modal.tsx**
  - Creación de un componente `Modal` reutilizable para mostrar mensajes de error o información.

- **frontend/src/hooks/useLogin.ts**
  - Creación del hook personalizado `useLogin` para manejar estado, validaciones, envío y errores del login, incluyendo el check de recordar sesión.

- **frontend/src/services/auth.js**
  - Modificación de la función `login` para aceptar el parámetro `rememberMe` y propagar correctamente los errores del backend al frontend.

- **frontend/src/app/login/page.tsx**
  - Refactorización del formulario de login para:
    - Usar el hook `useLogin`.
    - Mostrar errores en el modal profesional.
    - Agregar el checkbox de "Recordar sesión".
    - Mejorar la responsividad del layout y los estilos usando Tailwind.

---

## Notas
- Este archivo debe mantenerse actualizado con cada cambio importante en el proyecto.
- Puedes agregar secciones para nuevas funcionalidades, correcciones de bugs, mejoras de seguridad, etc.
- Si tienes dudas sobre cómo documentar un cambio, puedes seguir el formato de este archivo o consultarme. 