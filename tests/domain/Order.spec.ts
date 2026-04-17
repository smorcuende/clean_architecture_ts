import { describe, it, expect } from 'vitest';
import { Order, OrderStatus } from '@domain/entities/Order';
import { OrderItem } from '@domain/value-objects/OrderItem';
import { SKU } from '@domain/value-objects/SKU';
import { Quantity } from '@domain/value-objects/Quantity';
import { Money } from '@domain/value-objects/Money';
import { Currency } from '@domain/value-objects/Currency';

// Helpers de construcción locales (sin IO)
function makeItem(sku: string, qty: number, unitPrice: number): OrderItem {
  return OrderItem.create(
    SKU.create(sku),
    'Producto de prueba',
    Quantity.create(qty),
    Money.create(unitPrice, Currency.EUR),
  );
}

describe('Order', () => {
  describe('create', () => {
    it('crea un pedido con estado PENDING', () => {
      const order = Order.create('order-1', 'customer-1');
      expect(order.getStatus()).toBe(OrderStatus.PENDING);
    });

    it('registra un evento OrderCreated al crearse', () => {
      const order = Order.create('order-1', 'customer-1');
      const events = order.getDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0].constructor.name).toBe('OrderCreated');
    });

    it('lanza error si el id está vacío', () => {
      expect(() => Order.create('', 'customer-1')).toThrow('Order ID cannot be empty');
    });

    it('lanza error si el customerId está vacío', () => {
      expect(() => Order.create('order-1', '')).toThrow('Customer ID cannot be empty');
    });

    it('usa EUR como moneda por defecto', () => {
      const order = Order.create('order-1', 'customer-1');
      expect(order.currency).toBe('EUR');
    });
  });

  describe('addItem', () => {
    it('añade un item al pedido', () => {
      const order = Order.create('order-1', 'customer-1');
      order.addItem(makeItem('SKU-001', 2, 10));
      expect(order.getItems()).toHaveLength(1);
    });

    it('acumula cantidad cuando se añade el mismo SKU dos veces', () => {
      const order = Order.create('order-1', 'customer-1');
      order.addItem(makeItem('SKU-001', 2, 10));
      order.addItem(makeItem('SKU-001', 3, 10));
      const items = order.getItems();
      expect(items).toHaveLength(1);
      expect(items[0].quantity.value).toBe(5);
    });

    it('registra un evento ItemAddedToOrder al añadir un item', () => {
      const order = Order.create('order-1', 'customer-1');
      order.clearDomainEvents(); // limpiar OrderCreated
      order.addItem(makeItem('SKU-001', 1, 10));
      const events = order.getDomainEvents();
      expect(events[0].constructor.name).toBe('ItemAddedToOrder');
    });
  });

  describe('calculateTotal', () => {
    it('calcula el total correctamente con varios items', () => {
      const order = Order.create('order-1', 'customer-1');
      order.addItem(makeItem('SKU-001', 2, 10));   // 20
      order.addItem(makeItem('SKU-002', 1, 5.5));  // 5.5
      const total = order.calculateTotal();
      expect(total.amount).toBe(25.5);
    });

    it('lanza error si no hay items', () => {
      const order = Order.create('order-1', 'customer-1');
      expect(() => order.calculateTotal()).toThrow(
        'Cannot calculate total of an order without items'
      );
    });
  });

  describe('pullDomainEvents', () => {
    it('vacía los eventos tras consumirlos', () => {
      const order = Order.create('order-1', 'customer-1');
      order.clearDomainEvents();
      expect(order.getDomainEvents()).toHaveLength(0);
    });
  });
});
