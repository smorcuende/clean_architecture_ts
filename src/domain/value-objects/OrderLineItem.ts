import { ProductId } from './Identity.js';
import { Money } from './Money.js';
import { Quantity } from './Quantity.js';

/** Value Object que representa un item dentro de un pedido */
export class OrderLineItem {
  private constructor(
    readonly productId: ProductId,
    readonly productName: string,
    readonly quantity: Quantity,
    readonly unitPrice: Money
  ) {}

  static create(
    productId: ProductId,
    productName: string,
    quantity: Quantity,
    unitPrice: Money
  ): OrderLineItem {
    const trimmedName = productName.trim();
    if (!trimmedName) {
      throw new Error('Product name cannot be empty');
    }
    if (trimmedName.length > 255) {
      throw new Error('Product name exceeds maximum length (255 characters)');
    }

    return new OrderLineItem(productId, trimmedName, quantity, unitPrice);
  }

  /** Calcula el subtotal de este item */
  getSubtotal(): Money {
    return this.unitPrice.multiply(this.quantity.value);
  }

  equals(other: OrderLineItem): boolean {
    return (
      this.productId.equals(other.productId) &&
      this.quantity.equals(other.quantity) &&
      this.unitPrice.equals(other.unitPrice)
    );
  }

  toString(): string {
    return `${this.productName} x${this.quantity} @ ${this.unitPrice}`;
  }
}
