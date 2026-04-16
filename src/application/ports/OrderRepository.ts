import type { Order, OrderStatus } from '../../domain/entities/Order.js';

/**
 * Port: OrderRepository
 * Interfaz para persistencia de pedidos
 */
export interface OrderRepository {
  /**
   * Obtiene un pedido por su ID
   */
  findById(id: string): Promise<Order | null>;

  /**
   * Guarda un nuevo pedido
   */
  save(order: Order): Promise<void>;

  /**
   * Actualiza un pedido existente
   */
  update(order: Order): Promise<void>;

  /**
   * Obtiene todos los pedidos de un cliente
   */
  findByCustomerId(customerId: string): Promise<Order[]>;

  /**
   * Obtiene pedidos por estado
   */
  findByStatus(status: OrderStatus): Promise<Order[]>;

  /**
   * Obtiene todos los pedidos
   */
  findAll(): Promise<Order[]>;
}
