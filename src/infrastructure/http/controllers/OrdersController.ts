import type { FastifyRequest, FastifyReply } from 'fastify';
import type { Container } from '../../../composition/container.js';
import { mapCreateOrderRequest, mapAddItemToOrderRequest } from '../mappers/DtoMapper.js';
import { mapErrorToHttp } from '../mappers/ErrorMapper.js';

export class OrdersController {
  constructor(private readonly container: Container) {}

  /**
   * Crear un nuevo pedido
   * POST /orders
   * Body: { orderId: string, customerId: string, currency?: string }
   */
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const dto = mapCreateOrderRequest(request.body);

      const result = await this.container.createOrder.execute(dto);

      if (!result.isSuccess) {
        const httpError = mapErrorToHttp(result.error);
        return reply.status(httpError.statusCode).send(httpError);
      }

      reply.code(201).send({
        success: true,
        data: result.data,
      });
    } catch (error) {
      reply.status(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Añadir un item a un pedido existente
   * POST /orders/:orderId/items
   * Body: { sku: string, productName: string, quantity: number, unitPrice: number, currency?: string }
   */
  async addItem(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { orderId } = request.params as { orderId: string };
      const dto = mapAddItemToOrderRequest(request.body, orderId);

      const result = await this.container.addItemToOrder.execute(dto);

      if (!result.isSuccess) {
        const httpError = mapErrorToHttp(result.error);
        return reply.status(httpError.statusCode).send(httpError);
      }

      reply.code(200).send({
        success: true,
        data: result.data,
      });
    } catch (error) {
      reply.status(500).send({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
