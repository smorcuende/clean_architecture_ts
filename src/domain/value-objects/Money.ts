import { Currency } from "./Currency.js";

/** Value Object para dinero con invariantes */
export class Money {
  private constructor(
    readonly amount: number,
    readonly currency: Currency
  ) {}

  static create(amount: number, currency: Currency): Money {
    if (!Number.isFinite(amount)) {
      throw new Error('Amount must be a finite number');
    }
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }

    // Redondear a 2 decimales
    const rounded = Math.round(amount * 100) / 100;
    return new Money(rounded, currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency.equals(other.currency);
  }

  add(other: Money): Money {
    if (!this.currency.equals(other.currency)) {
      throw new Error(
        `Cannot add amounts with different currencies: ${this.currency} + ${other.currency}`
      );
    }
    return Money.create(this.amount + other.amount, this.currency);
  }

  multiply(factor: number): Money {
    if (!Number.isFinite(factor) || factor < 0) {
      throw new Error('Multiplication factor must be a non-negative finite number');
    }
    return Money.create(this.amount * factor, this.currency);
  }

  isGreaterThan(other: Money): boolean {
    if (!this.currency.equals(other.currency)) {
      throw new Error('Cannot compare amounts with different currencies');
    }
    return this.amount > other.amount;
  }

  isGreaterThanOrEqual(other: Money): boolean {
    if (!this.currency.equals(other.currency)) {
      throw new Error('Cannot compare amounts with different currencies');
    }
    return this.amount >= other.amount;
  }

  isZero(): boolean {
    return this.amount === 0;
  }

  toString(): string {
    return `${this.amount.toFixed(2)} ${this.currency}`;
  }
}
