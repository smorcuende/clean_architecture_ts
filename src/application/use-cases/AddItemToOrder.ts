import type { Result } from '../../shared/Result.js';
import { ok, fail } from '../../shared/Result.js';
import { Errors } from '../errors.js';
import type  { AppError } from '../errors.js';
import type { AddItemToOrderInput, AddItemToOrderOutput } from '../dto/AddItemToOrderDTO.js';
import type { OrderRepository } from '../ports/OrderRepository.js';
import type { EventBus } from '../ports/EventBus.js';
import { SKU } from '../../domain/value-objects/SKU.js';
import { OrderItem } from '../../domain/value-objects/OrderItem.js';
import { Money } from '../../domain/value-objects/Money.js';
import { Quantity } from '../../domain/value-objects/Quantity.js';
import { Currency } from '../../domain/value-objects/Currency.js';

/**
 * Caso de uso: Añadir item a un pedido
 * 
 * Precondiciones:
 * - El pedido debe existir
 * - El pedido debe estar en estado PENDING
 * - El SKU debe ser válido
 * - La cantidad debe ser > 0
 * - Las monedas deben coincidir
 */
export class AddItemToOrder {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly eventBus: EventBus
  ) {}

  async execute(input: AddItemToOrderInput): Promise<Result<AddItemToOrderOutput, AppError>> {
    // Validar entrada
    const validationError = this.validateInput(input);
    if (validationError) {
      return fail(validationError);
    }

    try {
      // Obtener el pedido
      const order = await this.orderRepository.findById(input.orderId);
      if (!order) {
        return fail(
          Errors.notFound('Order', input.orderId)
        );
      }

      // Verificar que el pedido esté en PENDING
      if (order.getStatus() !== 'PENDING') {
        return fail(
          Errors.conflict(
            `Cannot add items to a non-pending order. Current status: ${order.getStatus()}`,
            { orderId: input.orderId, currentStatus: order.getStatus() }
          )
        );
      }

      // Validar monedas coincidan
      if (order.currency !== input.currency) {
        return fail(
          Errors.conflict(
            `Currency mismatch. Order uses ${order.currency}, tried to add item in ${input.currency}`,
            { orderCurrency: order.currency, itemCurrency: input.currency }
          )
        );
      }

      // Crear el value object del item
      let sku: SKU;
      let quantity: Quantity;
      let unitPrice: Money;

      try {
        sku = SKU.create(input.sku);
        quantity = Quantity.create(input.quantity);
        unitPrice = Money.create(input.unitPrice, Currency.create(input.currency));
      } catch (error) {
        return fail(
          Errors.validation(
            'item',
            error instanceof Error ? error.message : 'Invalid item data'
          )
        );
      }

      // Crear el OrderItem
      try {
        const item = OrderItem.create(sku, input.productName, quantity, unitPrice);

        // Añadir item al pedido
        order.addItem(item);

        // Actualizar en persistencia
        try {
          await this.orderRepository.update(order);
        } catch (error) {
          return fail(
            Errors.infra(
              'OrderRepository',
              'update',
              error instanceof Error ? error.message : 'Unknown error'
            )
          );
        }

        // Publicar eventos
        try {
          await this.eventBus.publishAll(order.getDomainEvents());
        } catch (error) {
          return fail(
            Errors.infra(
              'EventBus',
              'publishAll',
              error instanceof Error ? error.message : 'Unknown error'
            )
          );
        }

        // Limpiar eventos después de publicarlos
        order.clearDomainEvents();

        // Retornar resultado
        return ok({
          orderId: order.id,
          sku: item.sku.value,
          productName: item.productName,
          quantity: item.quantity.value,
          subtotal: item.getSubtotal().toString(),
          newOrderTotal: order.getTotal()?.toString() ?? null,
        });
      } catch (error) {
        return fail(
          Errors.validation(
            'item',
            error instanceof Error ? error.message : 'Failed to create order item'
          )
        );
      }
    } catch (error) {
      return fail(
        Errors.infra(
          'AddItemToOrder',
          'execute',
          error instanceof Error ? error.message : 'Unknown error'
        )
      );
    }
  }

  private validateInput(input: AddItemToOrderInput): AppError | null {
    if (!input.orderId?.trim()) {
      return Errors.validation('orderId', 'Order ID cannot be empty');
    }

    if (!input.sku?.trim()) {
      return Errors.validation('sku', 'SKU cannot be empty');
    }

    if (!input.productName?.trim()) {
      return Errors.validation('productName', 'Product name cannot be empty');
    }

    if (!Number.isInteger(input.quantity) || input.quantity <= 0) {
      return Errors.validation('quantity', 'Quantity must be a positive integer');
    }

    if (!Number.isFinite(input.unitPrice) || input.unitPrice < 0) {
      return Errors.validation('unitPrice', 'Unit price must be a non-negative number');
    }

    if (!input.currency?.trim()) {
      return Errors.validation('currency', 'Currency cannot be empty');
    }

    return null;
  }
}
