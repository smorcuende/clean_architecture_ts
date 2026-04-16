import { DomainEvent } from './DomainEvent.js';
import { Money } from '../value-objects/Money.js';

/** Evento: Se ha creado un nuevo pedido */
export class OrderCreated extends DomainEvent {
  readonly eventName = 'OrderCreated';

  constructor(
    readonly aggregateId: string,
    readonly customerId: string,
    readonly createdAt: Date = new Date()
  ) {
    super();
  }
}

/** Evento: Se ha añadido un item a un pedido */
export class ItemAddedToOrder extends DomainEvent {
  readonly eventName = 'ItemAddedToOrder';

  constructor(
    readonly aggregateId: string,
    readonly sku: string,
    readonly productName: string,
    readonly quantity: number,
    readonly unitPrice: Money,
    readonly createdAt: Date = new Date()
  ) {
    super();
  }
}

/** Evento: Se ha eliminado un item de un pedido */
export class ItemRemovedFromOrder extends DomainEvent {
  readonly eventName = 'ItemRemovedFromOrder';

  constructor(
    readonly aggregateId: string,
    readonly sku: string,
    readonly createdAt: Date = new Date()
  ) {
    super();
  }
}

/** Evento: Se ha confirmado un pedido */
export class OrderConfirmed extends DomainEvent {
  readonly eventName = 'OrderConfirmed';

  constructor(
    readonly aggregateId: string,
    readonly totalAmount: Money,
    readonly createdAt: Date = new Date()
  ) {
    super();
  }
}

/** Evento: Se ha completado un pedido */
export class OrderCompleted extends DomainEvent {
  readonly eventName = 'OrderCompleted';

  constructor(
    readonly aggregateId: string,
    readonly completedAt: Date = new Date()
  ) {
    super();
  }
}

/** Evento: Se ha cancelado un pedido */
export class OrderCancelled extends DomainEvent {
  readonly eventName = 'OrderCancelled';

  constructor(
    readonly aggregateId: string,
    readonly reason: string,
    readonly cancelledAt: Date = new Date()
  ) {
    super();
  }
}
