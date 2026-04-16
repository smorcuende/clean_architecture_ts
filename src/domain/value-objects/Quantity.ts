/** Value Object para cantidad con invariantes */
export class Quantity {
  private constructor(readonly value: number) {}

  static create(value: number): Quantity {
    if (!Number.isInteger(value)) {
      throw new Error('Quantity must be an integer');
    }
    if (value <= 0) {
      throw new Error('Quantity must be greater than zero');
    }
    if (value > 999_999) {
      throw new Error('Quantity exceeds maximum allowed (999999)');
    }
    return new Quantity(value);
  }

  equals(other: Quantity): boolean {
    return this.value === other.value;
  }

  add(other: Quantity): Quantity {
    return Quantity.create(this.value + other.value);
  }

  subtract(other: Quantity): Quantity {
    return Quantity.create(this.value - other.value);
  }

  isGreaterThan(other: Quantity): boolean {
    return this.value > other.value;
  }

  toString(): string {
    return String(this.value);
  }
}
