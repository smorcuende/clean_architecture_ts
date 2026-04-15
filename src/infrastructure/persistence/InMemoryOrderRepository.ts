import {OrderRepository} from "../../application/ports/OrderRepository";
import {Order} from "../../domain/entities/Order";

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
} 
