import process from 'node:process';
import { buildServer } from './src/infrastructure/http/server.js';
import { buildContainer } from './src/composition/container.js';

const PORT = Number(process.env.PORT) || 3000;
const ENV = process.env.NODE_ENV || 'development';

/**
 * Iniciar servidor HTTP con contenedor de dependencias inyectado
 */
async function main() {
  try {
    console.log(`🚀 Iniciando servidor en modo ${ENV}...`);

    // Construir contenedor de dependencias
    const container = buildContainer();
    console.log('✅ Contenedor de dependencias construido');

    // Construir servidor Fastify con el contenedor inyectado
    const app = await buildServer({ container });
    console.log('✅ Servidor Fastify configurado');

    // Iniciar servidor
    await app.listen({ port: PORT, host: '0.0.0.0' });

    console.log(`
  ╔═════════════════════════════════════════╗
  ║   🎯 Servidor escuchando                ║
  ║   📍 http://localhost:${PORT}           ║
  ║   🌍 Todas las interfaces (0.0.0.0)     ║
  ║   📌 Ambiente: ${ENV.padEnd(24)}║
  ╚═════════════════════════════════════════╝
    `);

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('\n⏸️  SIGTERM recibida - cerrando servidor...');
      await app.close();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('\n⏸️  SIGINT recibida - cerrando servidor...');
      await app.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
}

main();
