import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify'
import { OrdersController } from './controllers/OrdersController.js'
import type { Container } from '../../composition/container.js'
import { buildContainer } from '../../composition/container.js'
import { getHealthStatus } from '../../shared/health.js'

export interface ServerOptions {
  container?: Container
}

export async function buildServer(options?: ServerOptions): Promise<FastifyInstance> {
  const app = Fastify({
    logger: true,
  })

  // Construir o usar contenedor existente
  const container = options?.container || buildContainer()

  // Instanciar controladores con dependencias inyectadas
  const ordersController = new OrdersController(container)

  /**
   * Routes para gestión de pedidos
   */

  // GET /health - Health check para Kubernetes
  app.get('/health', (_request, reply) =>
    reply.send(getHealthStatus())
  )

  // POST /orders - Crear nuevo pedido
  app.post('/orders', (request, reply) =>
    ordersController.create(request, reply)
  )

  // POST /orders/:orderId/items - Añadir item a un pedido
  app.post('/orders/:orderId/items', (request, reply) =>
    ordersController.addItem(request, reply)
  )

  return app;
}
