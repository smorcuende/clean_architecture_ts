import { OrderItem } from '../value-objects/OrderItem.js';
import { Money } from '../value-objects/Money.js';
import { DomainEvent } from '../events/DomainEvent.js';
import { OrderCreated, ItemAddedToOrder } from '../events/OrderEvents.js';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/**
 * Aggregate Root: Order
 * Encapsula la lógica de negocio del pedido con invariantes de dominio
 */
export class Order {
  private readonly items: Map<string, OrderItem> = new Map();
  private readonly domainEvents: DomainEvent[] = [];
  private status: OrderStatus;
  private total: Money | null = null;

  private constructor(
    readonly id: string,
    readonly customerId: string,
    readonly currency: string,
    readonly createdAt: Date
  ) {
    this.status = OrderStatus.PENDING;
  }

  /**
   * Factory: Crear un nuevo pedido
   */
  static create(id: string, customerId: string, currency: string = 'EUR'): Order {
    if (!id?.trim()) throw new Error('Order ID cannot be empty');
    if (!customerId?.trim()) throw new Error('Customer ID cannot be empty');

    const order = new Order(id, customerId, currency, new Date());
    
    order.recordEvent(
      new OrderCreated(id, customerId, order.createdAt)
    );

    return order;
  }

  /**
   * Factory: Restaurar pedido desde persistencia
   */
  static restore(
    id: string,
    customerId: string,
    currency: string,
    status: OrderStatus,
    items: OrderItem[],
    total: Money | null,
    createdAt: Date
  ): Order {
    const order = new Order(id, customerId, currency, createdAt);
    order.status = status;
    
    items.forEach(item => {
      order.items.set(item.sku.value, item);
    });
    
    order.total = total;
    return order;
  }

  /**
   * Añade un item al pedido
   * Invariante: El pedido debe estar en estado PENDING
   */
  addItem(item: OrderItem): void {
    this.assertPending('Cannot add items to a non-pending order');

    if (this.items.has(item.sku.value)) {
      const existing = this.items.get(item.sku.value)!;
      const newQuantity = existing.quantity.add(item.quantity);
      const updatedItem = OrderItem.create(
        existing.sku,
        existing.productName,
        newQuantity,
        existing.unitPrice
      );
      this.items.set(item.sku.value, updatedItem);
    } else {
      this.items.set(item.sku.value, item);
    }

    this.total = null;

    this.recordEvent(
      new ItemAddedToOrder(
        this.id,
        item.sku.value,
        item.productName,
        item.quantity.value,
        item.unitPrice
      )
    );
  }

  /**
   * Elimina un item del pedido
   */
  removeItem(sku: string): void {
    this.assertPending('Cannot remove items from a non-pending order');
    this.items.delete(sku);
    this.total = null;
  }

  /**
   * Calcula el total del pedido
   * Invariante: Debe haber al menos 1 item
   */
  calculateTotal(): Money {
    if (this.items.size === 0) {
      throw new Error('Cannot calculate total of an order without items');
    }

    const totals = Array.from(this.items.values()).map(item => item.getSubtotal());
    this.total = totals.reduce((sum, current) => sum.add(current));

    return this.total;
  }

  getTotal(): Money | null {
    return this.total;
  }

  getTotalOrThrow(): Money {
    return this.total || this.calculateTotal();
  }

  /**
   * Confirma el pedido
   * Invariantes:
   * - Debe estar en PENDING
   * - Debe tener al menos 1 item
   * - Total debe ser > 0
   */
  confirm(): void {
    this.assertPending('Cannot confirm a non-pending order');

    if (this.items.size === 0) {
      throw new Error('Cannot confirm an order without items');
    }

    const total = this.getTotalOrThrow();
    if (total.isZero()) {
      throw new Error('Cannot confirm an order with zero total');
    }

    this.status = OrderStatus.CONFIRMED;
  }

  complete(): void {
    if (this.status !== OrderStatus.CONFIRMED) {
      throw new Error('Only confirmed orders can be completed');
    }
    this.status = OrderStatus.COMPLETED;
  }

  cancel(_reason: string = ''): void {
    if (this.status === OrderStatus.COMPLETED || this.status === OrderStatus.CANCELLED) {
      throw new Error(`Cannot cancel a ${this.status} order`);
    }
    this.status = OrderStatus.CANCELLED; 
  }

  // ============ Getters ============

  getStatus(): OrderStatus {
    return this.status;
  }

  getItems(): OrderItem[] {
    return Array.from(this.items.values());
  }

  getItemCount(): number {
    return this.items.size;
  }

  getDomainEvents(): DomainEvent[] {
    return [...this.domainEvents];
  }

  clearDomainEvents(): void {
    this.domainEvents.length = 0;
  }

  // ============ Private ============

  private recordEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  private assertPending(message: string): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new Error(message);
    }
  }
}

