import type { OrderRepository } from "../../application/ports/OrderRepository.js";
import type { Order, OrderStatus } from "../../domain/entities/Order.js";

export class InMemoryOrderRepository implements OrderRepository {
  private store: Map<string, Order> = new Map();

  async findAll(): Promise<Order[]> {
    return Array.from(this.store.values());
  }

  async findById(id: string): Promise<Order | null> {
    return this.store.get(id) || null;
  }

  async save(order: Order): Promise<void> {
    this.store.set(order.id, order);
  }

  async update(order: Order): Promise<void> {
    if (!this.store.has(order.id)) {
      throw new Error(`Order with id ${order.id} not found`);
    }
    this.store.set(order.id, order);
  }

  async findByCustomerId(customerId: string): Promise<Order[]> {
    return Array.from(this.store.values()).filter(
      (order) => order.customerId === customerId,
    );
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    return Array.from(this.store.values()).filter(
      (order) => order.getStatus() === status,
    );
  }
}
