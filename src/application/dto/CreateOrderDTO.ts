/**
 * DTO: Input para el caso de uso CreateOrder
 */
export type CreateOrderInput = {
  orderId: string;
  customerId: string;
  currency: string;
};

/**
 * DTO: Output del caso de uso CreateOrder
 */
export type CreateOrderOutput = {
  orderId: string;
  customerId: string;
  currency: string;
  status: string;
};
