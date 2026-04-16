import type { PricingService } from '../../application/ports/PricingService.js';
import { Money } from '../../domain/value-objects/Money.js';
import { Currency } from '../../domain/value-objects/Currency.js';

/**
 * Adaptador: StaticPricingService
 * Simula un servicio externo de precios con catálogo estático
 * En producción, este conectaría a un servicio real de pricing
 */
export class StaticPricingService implements PricingService {
  /**
   * Catálogo estático de precios por SKU
   */
  private readonly priceCatalog: Map<string, number> = new Map([
    ['LAPTOP-001', 999.99],
    ['MOUSE-001', 25.50],
    ['KEYBOARD-001', 79.99],
    ['MONITOR-001', 349.99],
    ['USB-CABLE-001', 9.99],
  ]);

  /**
   * Tabla de descuentos por cantidad
   * Si compras 10+ unidades: 5%
   * Si compras 50+ unidades: 10%
   * Si compras 100+ unidades: 15%
   */
  private readonly discountTiers = [
    { minQuantity: 100, discount: 0.15 },
    { minQuantity: 50, discount: 0.1 },
    { minQuantity: 10, discount: 0.05 },
    { minQuantity: 0, discount: 0 },
  ];

  /**
   * Tasa de impuesto (IVA del 21%)
   */
  private readonly taxRate = 0.21;

  /**
   * Obtiene el precio de un producto por SKU
   */
  async getPriceBySkU(sku: string): Promise<Money | null> {
    const price = this.priceCatalog.get(sku.toUpperCase());

    if (!price) {
      return null;
    }

    return Money.create(price, Currency.EUR);
  }

  /**
   * Calcula descuento para una cantidad específica
   * Retorna el monto del descuento
   */
  async calculateDiscount(sku: string, quantity: number): Promise<Money> {
    const basePrice = this.priceCatalog.get(sku.toUpperCase());

    if (!basePrice) {
      return Money.create(0, Currency.EUR);
    }

    // Encontrar el tier de descuento aplicable
    const discountTier = this.discountTiers.find(
      (tier) => quantity >= tier.minQuantity
    )!;

    // Calcular monto total sin descuento
    const subtotal = basePrice * quantity;

    // Calcular monto del descuento
    const discountAmount = subtotal * discountTier.discount;

    return Money.create(discountAmount, Currency.EUR);
  }

  /**
   * Aplica impuestos a un monto
   * Retorna el impuesto a pagar
   */
  async applyTaxes(amount: Money): Promise<Money> {
    if (!amount.currency.equals(Currency.EUR)) {
      throw new Error('This pricing service only supports EUR currency');
    }

    const taxAmount = amount.amount * this.taxRate;
    return Money.create(taxAmount, Currency.EUR);
  }
}
