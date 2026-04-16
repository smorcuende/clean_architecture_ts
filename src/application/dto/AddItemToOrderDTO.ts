/**
 * DTO: Input para el caso de uso AddItemToOrder
 */
export type AddItemToOrderInput = {
  orderId: string;
  sku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  currency: string;
};

/**
 * DTO: Output del caso de uso AddItemToOrder
 */
export type AddItemToOrderOutput = {
  orderId: string;
  sku: string;
  productName: string;
  quantity: number;
  subtotal: string;
  newOrderTotal: string | null;
};
