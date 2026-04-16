import type { CreateOrderInput } from '../../../application/dto/CreateOrderDTO.js';
import type { AddItemToOrderInput } from '../../../application/dto/AddItemToOrderDTO.js';

/**
 * Mapea el body de HTTP a CreateOrderInput DTO
 */
export function mapCreateOrderRequest(body: any): CreateOrderInput {
  return {
    orderId: body.orderId,
    customerId: body.customerId,
    currency: body.currency || 'EUR',
  };
}

/**
 * Mapea el body de HTTP a AddItemToOrderInput DTO
 */
export function mapAddItemToOrderRequest(body: any, orderId: string): AddItemToOrderInput {
  return {
    orderId,
    sku: body.sku,
    productName: body.productName,
    quantity: body.quantity,
    unitPrice: body.unitPrice,
    currency: body.currency || 'EUR',
  };
}
