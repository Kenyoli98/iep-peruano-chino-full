// Utilidades para generar y validar códigos de estudiante tipo RUC
// Formato: PPDDDDDDDDSS (Prefijo + DNI + Sufijo de seguridad)

/**
 * Genera un código de estudiante basado en el DNI
 * Formato: 20 + DNI (8 dígitos) + dígito verificador (1 dígito)
 * Ejemplo: DNI 12345678 -> Código 2012345678X
 * @param {string} dni - DNI del estudiante (8 dígitos)
 * @returns {string} Código de estudiante de 11 caracteres
 */
function generarCodigoEstudiante(dni) {
  // Validar que el DNI tenga 8 dígitos
  if (!dni || dni.length !== 8 || !/^\d{8}$/.test(dni)) {
    throw new Error('DNI debe tener exactamente 8 dígitos');
  }

  // Prefijo fijo para estudiantes
  const prefijo = '20';
  
  // Combinar prefijo + DNI
  const base = prefijo + dni;
  
  // Calcular dígito verificador usando módulo 11
  const digitoVerificador = calcularDigitoVerificador(base);
  
  return base + digitoVerificador;
}

/**
 * Calcula el dígito verificador usando el algoritmo módulo 11
 * @param {string} numero - Número base de 10 dígitos
 * @returns {string} Dígito verificador (0-9 o X)
 */
function calcularDigitoVerificador(numero) {
  // Factores de multiplicación para módulo 11
  const factores = [3, 2, 7, 6, 5, 4, 3, 2, 7, 6];
  
  let suma = 0;
  for (let i = 0; i < numero.length; i++) {
    suma += parseInt(numero[i]) * factores[i];
  }
  
  const residuo = suma % 11;
  const digito = 11 - residuo;
  
  // Si el dígito es 10, se representa como X
  // Si el dígito es 11, se representa como 0
  if (digito === 10) return 'X';
  if (digito === 11) return '0';
  
  return digito.toString();
}

/**
 * Valida si un código de estudiante es válido
 * @param {string} codigo - Código de estudiante a validar
 * @returns {boolean} true si es válido, false si no
 */
function validarCodigoEstudiante(codigo) {
  try {
    // Verificar formato básico
    if (!codigo || codigo.length !== 11) {
      return false;
    }
    
    // Verificar que empiece con '20'
    if (!codigo.startsWith('20')) {
      return false;
    }
    
    // Extraer partes
    const base = codigo.substring(0, 10);
    const digitoVerificador = codigo.substring(10);
    
    // Verificar que los primeros 10 caracteres sean dígitos
    if (!/^\d{10}$/.test(base)) {
      return false;
    }
    
    // Calcular dígito verificador esperado
    const digitoEsperado = calcularDigitoVerificador(base);
    
    return digitoVerificador === digitoEsperado;
  } catch (error) {
    return false;
  }
}

/**
 * Extrae el DNI de un código de estudiante válido
 * @param {string} codigo - Código de estudiante
 * @returns {string|null} DNI extraído o null si el código no es válido
 */
function extraerDNIDelCodigo(codigo) {
  if (!validarCodigoEstudiante(codigo)) {
    return null;
  }
  
  // Extraer DNI (caracteres 2-9, índices 2-9)
  return codigo.substring(2, 10);
}

/**
 * Genera un código de estudiante único verificando que no exista en la base de datos
 * @param {string} dni - DNI del estudiante
 * @param {Object} prisma - Cliente de Prisma
 * @returns {Promise<string>} Código único generado
 */
async function generarCodigoUnico(dni, prisma) {
  let codigo = generarCodigoEstudiante(dni);
  
  // Verificar si ya existe en la base de datos
  const existente = await prisma.usuario.findUnique({
    where: { codigoEstudiante: codigo }
  });
  
  if (existente) {
    throw new Error(`Ya existe un estudiante con DNI ${dni}`);
  }
  
  return codigo;
}

module.exports = {
  generarCodigoEstudiante,
  validarCodigoEstudiante,
  extraerDNIDelCodigo,
  generarCodigoUnico,
  calcularDigitoVerificador
};