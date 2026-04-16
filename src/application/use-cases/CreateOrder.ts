import { ok, fail } from '../../shared/Result.js';
import type { Result } from '../../shared/Result.js';
import { Errors } from '../errors.js';
import type { AppError } from '../errors.js';

import type { CreateOrderInput, CreateOrderOutput } from '../dto/CreateOrderDTO.js';
import type { OrderRepository } from '../ports/OrderRepository.js';
import { Order } from '../../domain/entities/Order.js';

/**
 * Caso de uso: Crear un nuevo pedido
 * 
 * Precondiciones:
 * - El pedido no debe existir
 * - El ID del pedido y cliente deben ser válidos
 * - La moneda debe ser válida
 */
export class CreateOrder {
  constructor(
    private readonly orderRepository: OrderRepository
  ) {}

  async execute(input: CreateOrderInput): Promise<Result<CreateOrderOutput, AppError>> {
    // Validar entrada
    const validationError = this.validateInput(input);
    if (validationError) {
      return fail(validationError);
    }

    try {
      // Verificar que el pedido no existe
      const existing = await this.orderRepository.findById(input.orderId);
      if (existing) {
        return fail(
          Errors.conflict(
            `Order ${input.orderId} already exists`,
            { orderId: input.orderId }
          )
        );
      }

      // Crear el pedido (agregado)
      const order = Order.create(input.orderId, input.customerId, input.currency);

      // Persistir
      try {
        await this.orderRepository.save(order);
      } catch (error) {
        return fail(
          Errors.infra(
            'OrderRepository',
            'save',
            error instanceof Error ? error.message : 'Unknown error'
          )
        );
      }

      // Retornar resultado
      return ok({
        orderId: order.id,
        customerId: order.customerId,
        currency: order.currency,
        status: order.getStatus(),
      });
    } catch (error) {
      return fail(
        Errors.infra(
          'CreateOrder',
          'execute',
          error instanceof Error ? error.message : 'Unknown error'
        )
      );
    }
  }

  private validateInput(input: CreateOrderInput): AppError | null {
    if (!input.orderId?.trim()) {
      return Errors.validation('orderId', 'Order ID cannot be empty');
    }

    if (input.orderId.length > 36) {
      return Errors.validation('orderId', 'Order ID cannot exceed 36 characters');
    }

    if (!input.customerId?.trim()) {
      return Errors.validation('customerId', 'Customer ID cannot be empty');
    }

    if (input.customerId.length > 36) {
      return Errors.validation('customerId', 'Customer ID cannot exceed 36 characters');
    }

    if (!input.currency?.trim()) {
      return Errors.validation('currency', 'Currency cannot be empty');
    }

    const validCurrencies = ['EUR', 'USD'];
    if (!validCurrencies.includes(input.currency.toUpperCase())) {
      return Errors.validation('currency', `Currency must be one of: ${validCurrencies.join(', ')}`);
    }

    return null;
  }
}
