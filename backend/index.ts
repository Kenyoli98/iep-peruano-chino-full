import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import JavaScript modules with require for now (will be migrated later)
import { initializeEmailService, showEmailConfigInfo } from './startup/emailStartup';

// Load environment variables
dotenv.config();

const app = express();

// ✅ Global Middlewares (ALWAYS GO FIRST)
app.use(cors());
app.use(express.json());

// ✅ Routes (maintaining your current order)
app.use('/usuarios', require('./routes/usuarios'));
app.use('/matricula', require('./routes/matricula'));
app.use('/notas', require('./routes/nota'));
app.use('/pensiones', require('./routes/pension'));
app.use('/cursos', require('./routes/curso')); // Here you already include protected bulk loading
app.use('/asignaciones', require('./routes/asignacion'));
app.use('/secciones', require('./routes/seccion'));
app.use('/estadisticas', require('./routes/estadisticas'));
app.use('/pre-registro', require('./routes/preRegistro')); // Sistema de pre-registro
app.use('/api/dni', require('./routes/dni').default); // Servicio de consulta DNI

// ✅ Base Route (optional)
app.get('/', (req: Request, res: Response) => {
  res.send('API del IEP Peruano Chino lista');
});

// ✅ Port
const PORT: number = parseInt(process.env.PORT || '3001', 10);

// Handling uncaught errors
process.on('uncaughtException', (error: Error) => {
  console.error('Error no capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  console.error('Promesa rechazada no manejada:', reason);
  process.exit(1);
});

app
  .listen(PORT, async (): Promise<void> => {
    console.log(`🚀 Servidor API corriendo en puerto ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);

    // Initialize email service
    try {
      await initializeEmailService();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(
        '❌ Error crítico inicializando servicio de email:',
        errorMessage
      );
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
    }

    // Show email configuration information
    showEmailConfigInfo();

    console.log('✅ Servidor completamente inicializado');
  })
  .on('error', (error: Error) => {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  });

export default app;