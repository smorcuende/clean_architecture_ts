import { InMemoryOrderRepository } from '../infrastructure/persistence/InMemoryOrderRepository.js';
import { CreateOrder } from '../application/use-cases/CreateOrder.js';
import { AddItemToOrder } from '../application/use-cases/AddItemToOrder.js';
import { SystemClock } from '../infrastructure/adapters/SystemClock.js';
import { InMemoryEventBus } from '../infrastructure/adapters/InMemoryEventBus.js';
import { StaticPricingService } from '../infrastructure/http/StaticPricingService.js';
import type { OrderRepository } from '../application/ports/OrderRepository.js';
import type { Clock } from '../application/ports/Clock.js';
import type { EventBus } from '../application/ports/EventBus.js';
import type { PricingService } from '../application/ports/PricingService.js';

/**
 * Contenedor de dependencias tipado
 * Agrupa todos los puertos y casos de uso de la aplicación
 */
export interface Container {
  // Repositories
  orderRepository: OrderRepository;

  // Ports
  clock: Clock;
  eventBus: EventBus;
  pricingService: PricingService;

  // Use Cases
  createOrder: CreateOrder;
  addItemToOrder: AddItemToOrder;
}

/**
 * Factory para construir el contenedor de dependencias
 * Instancia todos los adaptadores e inyecta las dependencias
 * 
 * @returns Container tipado con todas las dependencias
 */
export function buildContainer(): Container {
  // ============ REPOSITORIES ============
  const orderRepository = new InMemoryOrderRepository();

  // ============ PORTS (Adapters) ============
  const clock = new SystemClock();
  const eventBus = new InMemoryEventBus();
  const pricingService = new StaticPricingService();

  // ============ USE CASES ============
  const createOrder = new CreateOrder(orderRepository);
  const addItemToOrder = new AddItemToOrder(orderRepository, eventBus);

  // ============ RETORNAR CONTENEDOR ============
  return {
    // Repositories
    orderRepository,

    // Ports
    clock,
    eventBus,
    pricingService,

    // Use Cases
    createOrder,
    addItemToOrder,
  };
}

/**
 * Instancia global del contenedor
 * Se puede crear una nueva instancia por cada inicio de servidor o sesión de test
 */
export const container = buildContainer();
