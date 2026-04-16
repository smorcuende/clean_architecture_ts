import type { EventBus } from '../../application/ports/EventBus.js';
import type { DomainEvent } from '../../domain/events/DomainEvent.js';

/**
 * Adaptador: InMemoryEventBus
 * Implementación simple de EventBus que mantiene eventos en memoria
 * Para desarrollo y testing. En producción, usar un bus real (RabbitMQ, Kafka, etc.)
 */
export class InMemoryEventBus implements EventBus {
  private subscribers: Map<string, ((event: DomainEvent) => Promise<void>)[]> = new Map();

  async publish(event: DomainEvent): Promise<void> {
    const handlers = this.subscribers.get(event.getEventName()) || [];
    
    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (error) {
        console.error(`Error publishing event ${event.getEventName()}:`, error);
      }
    }
  }

  async publishAll(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }

  /**
   * Suscribirse a eventos de un tipo específico (para testing)
   */
  subscribe(eventType: string, handler: (event: DomainEvent) => Promise<void>): void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType)!.push(handler);
  }
}
