import { SKU } from './SKU.js';
import { Money } from './Money.js';
import { Quantity } from './Quantity.js';

/** Value Object que representa un item en un pedido */
export class OrderItem {
  private constructor(
    readonly sku: SKU,
    readonly productName: string,
    readonly quantity: Quantity,
    readonly unitPrice: Money
  ) {}

  static create(
    sku: SKU,
    productName: string,
    quantity: Quantity,
    unitPrice: Money
  ): OrderItem {
    const trimmedName = productName.trim();
    
    if (!trimmedName) {
      throw new Error('Product name cannot be empty');
    }
    
    if (trimmedName.length > 255) {
      throw new Error('Product name exceeds maximum length (255 characters)');
    }

    return new OrderItem(sku, trimmedName, quantity, unitPrice);
  }

  /** Calcula el subtotal de este item */
  getSubtotal(): Money {
    return this.unitPrice.multiply(this.quantity.value);
  }

  equals(other: OrderItem): boolean {
    return (
      this.sku.equals(other.sku) &&
      this.quantity.equals(other.quantity) &&
      this.unitPrice.equals(other.unitPrice)
    );
  }

  toString(): string {
    return `${this.productName} x${this.quantity} @ ${this.unitPrice}`;
  }
}
