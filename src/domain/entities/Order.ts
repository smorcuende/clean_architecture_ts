import { Price } from "../value-objects/Price";
import { DomainEvent } from "../events/DomainEvent";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: Price;
}

export class Order {
  private items: OrderItem[] = [];
  private domainEvents: DomainEvent[] = [];
  private total: Price | null = null;

  private constructor(
    private readonly id: string,
    private createdAt: Date = new Date(),
    private status: "pending" | "confirmed" | "completed" | "cancelled" = "pending"
  ) {}

  static create(id: string): Order {
    return new Order(id);
  }

  static restore(
    id: string,
    items: OrderItem[],
    total: Price | null,
    status: "pending" | "confirmed" | "completed" | "cancelled",
    createdAt: Date
  ): Order {
    const order = new Order(id, createdAt, status);
    order.items = items;
    order.total = total;
    return order;
  }

  getId(): string {
    return this.id;
  }

  getItems(): OrderItem[] {
    return [...this.items];
  }

  getTotal(): Price | null {
    return this.total;
  }

  getStatus(): string {
    return this.status;
  }

  getCreatedAt(): Date {
    return new Date(this.createdAt);
  }

  addItem(item: OrderItem): void {
    if (item.quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }
    
    // Check if item already exists
    const existingItem = this.items.find(i => i.productId === item.productId);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.items.push({ ...item });
    }
    
    this.total = null; // Reset total when items change
  }

  removeItem(productId: string): void {
    this.items = this.items.filter(item => item.productId !== productId);
    this.total = null; // Reset total when items change
  }

  calculateTotal(currency: "EUR" | "USD" = "EUR"): Price {
    if (this.items.length === 0) {
      return Price.create(0, currency);
    }

    const total = this.items.reduce((sum, item) => {
      const itemTotal = item.unitPrice.amount * item.quantity;
      return sum + itemTotal;
    }, 0);

    this.total = Price.create(total, currency);
    return this.total;
  }

  confirm(): void {
    if (this.status !== "pending") {
      throw new Error("Only pending orders can be confirmed");
    }
    if (this.items.length === 0) {
      throw new Error("Cannot confirm an order without items");
    }
    
    this.status = "confirmed";
    this.addDomainEvent({
      type: "OrderConfirmed",
      aggregateId: this.id,
      occurredOn: new Date(),
      data: { orderId: this.id, total: this.total }
    } as DomainEvent);
  }

  complete(): void {
    if (this.status !== "confirmed") {
      throw new Error("Only confirmed orders can be completed");
    }
    
    this.status = "completed";
    this.addDomainEvent({
      type: "OrderCompleted",
      aggregateId: this.id,
      occurredOn: new Date(),
      data: { orderId: this.id }
    } as DomainEvent);
  }

  cancel(): void {
    if (["completed", "cancelled"].includes(this.status)) {
      throw new Error(`Cannot cancel a ${this.status} order`);
    }
    
    this.status = "cancelled";
    this.addDomainEvent({
      type: "OrderCancelled",
      aggregateId: this.id,
      occurredOn: new Date(),
      data: { orderId: this.id }
    } as DomainEvent);
  }

  addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  getDomainEvents(): DomainEvent[] {
    return [...this.domainEvents];
  }

  clearDomainEvents(): void {
    this.domainEvents = [];
  }
}
