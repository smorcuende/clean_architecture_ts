/** Value Object para monedas soportadas */
export class Currency {
  private constructor(readonly code: string) {}

  static readonly EUR = new Currency('EUR');
  static readonly USD = new Currency('USD');

  static create(code: string): Currency {
    const supported = { EUR: Currency.EUR, USD: Currency.USD };
    const currency = supported[code as keyof typeof supported];
    
    if (!currency) {
      throw new Error(`Currency ${code} not supported. Supported: EUR, USD`);
    }
    
    return currency;
  }

  equals(other: Currency): boolean {
    return this.code === other.code;
  }

  toString(): string {
    return this.code;
  }
}
