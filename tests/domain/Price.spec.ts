import { describe, it, expect } from 'vitest';
import { Price } from '@domain/value-objects/Price';

describe('Price', () => {
  describe('create', () => {
    it('crea un Price con importe y moneda válidos', () => {
      const price = Price.create(10.5, 'EUR');
      expect(price.amount).toBe(10.5);
      expect(price.currency).toBe('EUR');
    });

    it('acepta importe cero', () => {
      const price = Price.create(0, 'USD');
      expect(price.amount).toBe(0);
    });

    it('redondea a 2 decimales', () => {
      const price = Price.create(1.999, 'EUR');
      expect(price.amount).toBe(2);
    });

    it('lanza error si el importe es negativo', () => {
      expect(() => Price.create(-1, 'EUR')).toThrow('Amount must be a positive number');
    });

    it('lanza error si el importe es NaN', () => {
      expect(() => Price.create(NaN, 'EUR')).toThrow('Amount must be a positive number');
    });

    it('lanza error si el importe es Infinity', () => {
      expect(() => Price.create(Infinity, 'EUR')).toThrow('Amount must be a positive number');
    });

    it('acepta USD como moneda', () => {
      const price = Price.create(5, 'USD');
      expect(price.currency).toBe('USD');
    });
  });
});
