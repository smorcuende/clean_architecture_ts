import type { Money } from '../../domain/value-objects/Money.js';

/**
 * Port: PricingService
 * Servicio para calcular precios y descuentos
 */
export interface PricingService {
  /**
   * Obtiene el precio de un producto por SKU
   */
  getPriceBySkU(sku: string): Promise<Money | null>;

  /**
   * Calcula descuento para una cantidad específica
   */
  calculateDiscount(sku: string, quantity: number): Promise<Money>;

  /**
   * Aplica impuestos a un monto
   */
  applyTaxes(amount: Money): Promise<Money>;
}
