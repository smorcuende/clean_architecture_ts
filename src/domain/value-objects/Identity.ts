/** Value Object para identificadores único en el patrón DDD */
export class OrderId {
  private constructor(readonly value: string) {}

  static create(value: string): OrderId {
    const trimmed = value.trim();
    if (!trimmed) {
      throw new Error('OrderId cannot be empty');
    }
    if (trimmed.length > 36) {
      throw new Error('OrderId cannot exceed 36 characters');
    }
    return new OrderId(trimmed);
  }

  equals(other: OrderId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

/** Value Object para ID de producto */
export class ProductId {
  private constructor(readonly value: string) {}

  static create(value: string): ProductId {
    const trimmed = value.trim();
    if (!trimmed) {
      throw new Error('ProductId cannot be empty');
    }
    if (trimmed.length > 36) {
      throw new Error('ProductId cannot exceed 36 characters');
    }
    return new ProductId(trimmed);
  }

  equals(other: ProductId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

/** Value Object para ID de cliente */
export class CustomerId {
  private constructor(readonly value: string) {}

  static create(value: string): CustomerId {
    const trimmed = value.trim();
    if (!trimmed) {
      throw new Error('CustomerId cannot be empty');
    }
    if (trimmed.length > 36) {
      throw new Error('CustomerId cannot exceed 36 characters');
    }
    return new CustomerId(trimmed);
  }

  equals(other: CustomerId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
