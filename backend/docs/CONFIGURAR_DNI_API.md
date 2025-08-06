# Configuración de APIs de DNI para Datos Reales

## ⚠️ IMPORTANTE

**Actualmente el sistema utiliza datos simulados** porque la mayoría de APIs de consulta DNI en Perú requieren autenticación y pago. Sin embargo, **APISPeru.com ofrece un plan gratuito** para pruebas.

## 🎉 NUEVA OPCIÓN: APISPeru.com (Plan Gratuito)

**¡Descubrimiento importante!** APISPeru.com ofrece:
- ✅ **2000 consultas gratuitas** el primer mes
- ✅ **Datos oficiales de RENIEC**
- ✅ **Fácil configuración**
- 📖 **Guía completa**: Ver `CONFIGURAR_APISPERU.md`

## APIs Disponibles en Perú

### APIs con Plan Gratuito

#### 🆓 APISPeru.com (RECOMENDADO PARA PRUEBAS)
- **URL**: https://apisperu.com/servicios/dniruc
- **Costo**: Gratuito primer mes (2000 consultas), luego S/30/mes
- **Características**: Nombres y apellidos oficiales de RENIEC
- **Documentación**: https://dniruc.apisperu.com/doc
- **Configuración**: Ver archivo `CONFIGURAR_APISPERU.md`

### APIs de Pago

### 1. APIs.NET.PE
- **URL**: https://apis.net.pe/
- **Costo**: Desde S/30 por mes (500 consultas)
- **Características**: Datos básicos de RENIEC
- **Documentación**: Incluye nombres, apellidos, fecha de nacimiento, género

### 2. DNIRUC.COM
- **URL**: https://dniruc.com/
- **Costo**: Desde S/65 por mes (plan Normal)
- **Características**: Datos completos incluyendo dirección
- **Ventajas**: Soporte 24/7, múltiples fuentes

### 3. APIDNI.COM
- **URL**: https://apidni.com/
- **Costo**: Desde S/30 por mes (500 consultas)
- **Características**: Datos completos con foto y restricciones
- **Planes**: Bronce, Plata, Oro con diferentes niveles de información

### 4. GlobalPer Inc.
- **URL**: https://globalper.org/reniec-dni
- **Costo**: Desde S/21 por mes (20,000 solicitudes)
- **Características**: API REST con datos básicos

## Cómo Configurar una API de Pago

### Paso 1: Contratar un Servicio
1. Elige una de las APIs mencionadas arriba
2. Regístrate en su plataforma
3. Contrata un plan según tus necesidades
4. Obtén tu token de autenticación

### Paso 2: Configurar en el Sistema

1. **Edita el archivo**: `backend/services/dniService.js`

2. **Habilita la API deseada**:
```javascript
const API_CONFIGS = {
  // Ejemplo para APIs.NET.PE
  apisnetpe: {
    url: 'https://api.apis.net.pe/v2/reniec/dni',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer TU_TOKEN_AQUI' // Reemplaza con tu token real
    },
    enabled: true, // Cambiar a true
    requiresToken: true
  },
  // ... otras APIs
};
```

3. **Configura las variables de entorno**:
```bash
# En tu archivo .env
DNI_API_TOKEN=tu_token_aqui
DNI_API_PROVIDER=apisnetpe
```

4. **Actualiza la configuración para usar variables de entorno**:
```javascript
const API_CONFIGS = {
  apisnetpe: {
    url: 'https://api.apis.net.pe/v2/reniec/dni',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${process.env.DNI_API_TOKEN}`
    },
    enabled: process.env.DNI_API_PROVIDER === 'apisnetpe',
    requiresToken: true
  },
};
```

### Paso 3: Reiniciar el Servidor
```bash
cd backend
npm run dev
```

## Consideraciones Importantes

### Costos
- **Mínimo**: S/21-30 por mes
- **Consultas**: 500-20,000 por mes según el plan
- **Costo por consulta**: S/0.001 - S/0.10 aproximadamente

### Limitaciones
- Todas las APIs tienen límites de consultas por mes
- Requieren conexión a internet estable
- Pueden tener tiempos de respuesta variables
- Algunas APIs pueden tener períodos de mantenimiento

### Recomendaciones
- **Para desarrollo**: Mantener datos simulados
- **Para producción pequeña**: APIs.NET.PE o GlobalPer
- **Para producción grande**: DNIRUC.COM (mejor soporte)
- **Para máxima información**: APIDNI.COM (incluye foto)

## Datos Simulados Actuales

Mientras no configures una API de pago, el sistema:

1. **Intenta conectar** con las APIs configuradas
2. **Recibe error 401** (no autorizado) porque no hay token
3. **Usa datos simulados** como respaldo
4. **Genera datos consistentes** basados en el DNI ingresado
5. **Muestra mensaje claro** indicando que son datos simulados

## Soporte

Si necesitas ayuda para configurar una API de pago:

1. Revisa la documentación de la API elegida
2. Contacta al soporte técnico del proveedor
3. Verifica que tu token esté activo y tenga créditos
4. Revisa los logs del servidor para errores específicos

---

**Nota**: Este sistema está preparado para trabajar con cualquiera de las APIs mencionadas. Solo necesitas contratar el servicio y configurar tu token de autenticación.