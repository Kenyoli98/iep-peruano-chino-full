# Configuración de APISPeru.com para Consultas de DNI

## 🎉 ¡Excelente Descubrimiento!

**APISPeru.com** ofrece un **plan gratuito** con **2000 consultas mensuales** durante el **primer mes**, perfecto para pruebas y desarrollo.

## 📋 Características de APISPeru.com

- ✅ **Plan gratuito**: 2000 consultas el primer mes
- ✅ **Fácil integración**: API REST simple
- ✅ **Datos oficiales**: Consulta directa a RENIEC
- ✅ **Respuesta rápida**: Tiempo de respuesta optimizado
- ✅ **Documentación clara**: [https://dniruc.apisperu.com/doc](https://dniruc.apisperu.com/doc)

## 🚀 Pasos para Configurar

### 1. Registrarse en APISPeru.com

1. Visita [https://apisperu.com/servicios/dniruc](https://apisperu.com/servicios/dniruc)
2. Haz clic en **"Regístrate"**
3. Completa el formulario de registro
4. Confirma tu email
5. Obtén tu **token de acceso**

### 2. Configurar el Token en el Proyecto

#### Opción A: Variable de Entorno (Recomendado)

Crea o edita el archivo `.env` en la raíz del proyecto backend:

```bash
# APISPeru.com Token
APISPERU_TOKEN=tu_token_aqui
```

#### Opción B: Configuración Directa

Edita el archivo `backend/services/dniService.ts` y reemplaza `YOUR_TOKEN_HERE` con tu token real.

### 3. Habilitar la API

En `backend/services/dniService.ts`, cambia:

```typescript
apisperu: {
  // ...
  enabled: true, // Cambiar de false a true
  // ...
}
```

## 📊 Formato de Respuesta

Según la documentación oficial, APISPeru.com devuelve:

```json
{
  "dni": "12345678",
  "nombres": "JUAN CARLOS",
  "apellidoPaterno": "GARCIA",
  "apellidoMaterno": "LOPEZ",
  "codVerifica": "1"
}
```

**Nota**: APISPeru.com solo proporciona datos básicos (nombres y apellidos). No incluye:
- Fecha de nacimiento
- Sexo
- Dirección
- Distrito/Provincia/Departamento
- Estado civil

## 🔧 Configuración Técnica

La integración ya está configurada en el proyecto:

- **URL**: `https://dniruc.apisperu.com/api/dni/{dni}?token={token}`
- **Método**: GET
- **Autenticación**: Token como query parameter
- **Headers**: `Accept: application/json`

## 🧪 Probar la Integración

1. Configura tu token (pasos anteriores)
2. Habilita la API (`enabled: true`)
3. Reinicia el servidor backend
4. Prueba con un DNI válido desde el frontend

## 📈 Planes Disponibles

| Plan | Precio | Consultas | Características |
|------|--------|-----------|----------------|
| **Gratuito** | S/0.00 | 2000/mes (primer mes) | DNI y RUC, Sin soporte |
| **Premium** | S/30.00/mes | Ilimitadas | DNI y RUC, Soporte WhatsApp |

*Precios no incluyen IGV

## ⚠️ Consideraciones Importantes

1. **Datos Limitados**: APISPeru.com solo proporciona nombres y apellidos
2. **Plan Gratuito**: Solo el primer mes es gratuito
3. **Backup**: El sistema seguirá usando datos simulados si la API falla
4. **Seguridad**: Nunca expongas tu token en el frontend

## 🔄 Migración a Otras APIs

Si necesitas más datos (fecha de nacimiento, dirección, etc.), considera migrar a:

- **APIs.NET.PE**: Datos más completos
- **APIDNI.COM**: Incluye foto del DNI
- **DNIRUC.COM**: Mejor soporte técnico

## 📞 Soporte

- **Documentación**: [https://dniruc.apisperu.com/doc](https://dniruc.apisperu.com/doc)
- **Sitio web**: [https://apisperu.com](https://apisperu.com)
- **WhatsApp**: Solo disponible en plan Premium

---

**¡Perfecto para empezar con datos reales de RENIEC!** 🎯