#!/usr/bin/env node

/**
 * Script de migración automática de JavaScript a TypeScript
 * 
 * Este script ayuda a migrar archivos .js a .ts de manera sistemática,
 * aplicando transformaciones básicas y generando una lista de tareas pendientes.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuración
const CONFIG = {
  // Directorios a procesar
  directories: [
    'controllers',
    'middlewares', 
    'services',
    'routes',
    'utils',
    'startup'
  ],
  // Archivos a excluir
  excludeFiles: [
    'index.js', // Ya migrado manualmente
    'prismaClient.js' // Requiere atención especial
  ],
  // Extensiones a procesar
  extensions: ['.js'],
  // Directorio base
  baseDir: path.join(__dirname, '../..'),
  // Directorio de backup
  backupDir: path.join(__dirname, '../../.migration-backup')
};

// Transformaciones básicas de código
const TRANSFORMATIONS = [
  // Cambiar require a import para módulos conocidos
  {
    pattern: /const express = require\('express'\);/g,
    replacement: "import express from 'express';"
  },
  {
    pattern: /const cors = require\('cors'\);/g,
    replacement: "import cors from 'cors';"
  },
  {
    pattern: /const bcrypt = require\('bcryptjs'\);/g,
    replacement: "import bcrypt from 'bcryptjs';"
  },
  {
    pattern: /const jwt = require\('jsonwebtoken'\);/g,
    replacement: "import jwt from 'jsonwebtoken';"
  },
  {
    pattern: /const prisma = require\('..\/(.*?)prismaClient'\);/g,
    replacement: "import prisma from '../$1prismaClient';"
  },
  // Agregar tipos básicos a funciones
  {
    pattern: /async function (\w+)\(req, res\)/g,
    replacement: 'async function $1(req: Request, res: Response)'
  },
  {
    pattern: /function (\w+)\(req, res\)/g,
    replacement: 'function $1(req: Request, res: Response)'
  },
  // Cambiar module.exports
  {
    pattern: /module\.exports = \{([^}]+)\};/g,
    replacement: 'export { $1 };'
  },
  {
    pattern: /module\.exports = (\w+);/g,
    replacement: 'export default $1;'
  }
];

// Utilidades
function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    warning: '\x1b[33m',
    error: '\x1b[31m',
    reset: '\x1b[0m'
  };
  console.log(`${colors[type]}${message}${colors.reset}`);
}

function createBackupDir() {
  if (!fs.existsSync(CONFIG.backupDir)) {
    fs.mkdirSync(CONFIG.backupDir, { recursive: true });
    log(`✅ Directorio de backup creado: ${CONFIG.backupDir}`, 'success');
  }
}

function backupFile(filePath) {
  const relativePath = path.relative(CONFIG.baseDir, filePath);
  const backupPath = path.join(CONFIG.backupDir, relativePath);
  const backupDir = path.dirname(backupPath);
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  fs.copyFileSync(filePath, backupPath);
  log(`📁 Backup creado: ${relativePath}`, 'info');
}

function findJSFiles() {
  const files = [];
  
  for (const dir of CONFIG.directories) {
    const dirPath = path.join(CONFIG.baseDir, dir);
    if (!fs.existsSync(dirPath)) {
      log(`⚠️  Directorio no encontrado: ${dir}`, 'warning');
      continue;
    }
    
    const dirFiles = fs.readdirSync(dirPath, { recursive: true });
    for (const file of dirFiles) {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isFile() && CONFIG.extensions.includes(path.extname(file))) {
        const fileName = path.basename(file);
        if (!CONFIG.excludeFiles.includes(fileName)) {
          files.push(filePath);
        }
      }
    }
  }
  
  return files;
}

function applyTransformations(content) {
  let transformedContent = content;
  let appliedTransformations = [];
  
  for (const transformation of TRANSFORMATIONS) {
    const matches = transformedContent.match(transformation.pattern);
    if (matches) {
      transformedContent = transformedContent.replace(
        transformation.pattern, 
        transformation.replacement
      );
      appliedTransformations.push({
        pattern: transformation.pattern.toString(),
        matches: matches.length
      });
    }
  }
  
  return { content: transformedContent, transformations: appliedTransformations };
}

function addTypeImports(content) {
  // Detectar si necesita imports de tipos
  const needsExpressTypes = /\b(Request|Response)\b/.test(content);
  const needsPrismaTypes = /\bprisma\b/.test(content);
  
  let imports = [];
  
  if (needsExpressTypes) {
    imports.push("import { Request, Response } from 'express';");
  }
  
  if (needsPrismaTypes) {
    imports.push("import { PrismaClient } from '@prisma/client';");
  }
  
  if (imports.length > 0) {
    // Agregar imports al inicio del archivo
    const lines = content.split('\n');
    const importIndex = lines.findIndex(line => 
      line.includes('import') || line.includes('require')
    );
    
    if (importIndex !== -1) {
      lines.splice(importIndex, 0, ...imports, '');
    } else {
      lines.unshift(...imports, '');
    }
    
    return lines.join('\n');
  }
  
  return content;
}

function migrateFile(filePath) {
  log(`🔄 Procesando: ${path.relative(CONFIG.baseDir, filePath)}`, 'info');
  
  // Crear backup
  backupFile(filePath);
  
  // Leer contenido
  const originalContent = fs.readFileSync(filePath, 'utf8');
  
  // Aplicar transformaciones
  const { content: transformedContent, transformations } = applyTransformations(originalContent);
  
  // Agregar imports de tipos
  const finalContent = addTypeImports(transformedContent);
  
  // Crear archivo TypeScript
  const tsFilePath = filePath.replace(/\.js$/, '.ts');
  fs.writeFileSync(tsFilePath, finalContent);
  
  // Eliminar archivo JavaScript original
  fs.unlinkSync(filePath);
  
  log(`✅ Migrado: ${path.basename(filePath)} → ${path.basename(tsFilePath)}`, 'success');
  
  return {
    originalPath: filePath,
    newPath: tsFilePath,
    transformations,
    hasManualWork: transformations.length === 0 || 
                   originalContent.includes('require(') ||
                   originalContent.includes('module.exports')
  };
}

function generateReport(results) {
  const reportPath = path.join(CONFIG.baseDir, 'MIGRATION_REPORT.md');
  
  let report = `# Reporte de Migración a TypeScript\n\n`;
  report += `**Fecha:** ${new Date().toISOString()}\n\n`;
  report += `**Archivos procesados:** ${results.length}\n\n`;
  
  const needsManualWork = results.filter(r => r.hasManualWork);
  const fullyMigrated = results.filter(r => !r.hasManualWork);
  
  report += `## ✅ Archivos Completamente Migrados (${fullyMigrated.length})\n\n`;
  for (const result of fullyMigrated) {
    report += `- ${path.relative(CONFIG.baseDir, result.newPath)}\n`;
  }
  
  report += `\n## ⚠️ Archivos que Requieren Trabajo Manual (${needsManualWork.length})\n\n`;
  for (const result of needsManualWork) {
    report += `- ${path.relative(CONFIG.baseDir, result.newPath)}\n`;
    if (result.transformations.length > 0) {
      report += `  - Transformaciones aplicadas: ${result.transformations.length}\n`;
    }
  }
  
  report += `\n## 📋 Próximos Pasos\n\n`;
  report += `1. Revisar archivos que requieren trabajo manual\n`;
  report += `2. Agregar tipos específicos donde sea necesario\n`;
  report += `3. Verificar imports y exports\n`;
  report += `4. Ejecutar \`npm run type-check\` para verificar errores\n`;
  report += `5. Ejecutar \`npm run lint\` para verificar estilo\n`;
  report += `6. Probar funcionalidad completa\n\n`;
  
  report += `## 🔄 Comandos de Verificación\n\n`;
  report += `\`\`\`bash\n`;
  report += `# Verificar tipos\n`;
  report += `npm run type-check\n\n`;
  report += `# Verificar linting\n`;
  report += `npm run lint\n\n`;
  report += `# Compilar\n`;
  report += `npm run build\n`;
  report += `\`\`\`\n`;
  
  fs.writeFileSync(reportPath, report);
  log(`📊 Reporte generado: ${reportPath}`, 'success');
}

// Función principal
function main() {
  log('🚀 Iniciando migración automática a TypeScript...', 'info');
  
  // Crear directorio de backup
  createBackupDir();
  
  // Encontrar archivos JS
  const jsFiles = findJSFiles();
  log(`📁 Encontrados ${jsFiles.length} archivos JavaScript para migrar`, 'info');
  
  if (jsFiles.length === 0) {
    log('✅ No hay archivos JavaScript para migrar', 'success');
    return;
  }
  
  // Migrar archivos
  const results = [];
  for (const file of jsFiles) {
    try {
      const result = migrateFile(file);
      results.push(result);
    } catch (error) {
      log(`❌ Error migrando ${file}: ${error.message}`, 'error');
    }
  }
  
  // Generar reporte
  generateReport(results);
  
  log('\n🎉 Migración completada!', 'success');
  log(`📊 ${results.length} archivos procesados`, 'info');
  log(`📁 Backups guardados en: ${CONFIG.backupDir}`, 'info');
  log('📋 Revisa MIGRATION_REPORT.md para próximos pasos', 'warning');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = { main, CONFIG, TRANSFORMATIONS };