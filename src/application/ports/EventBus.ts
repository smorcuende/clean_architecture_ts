import type { DomainEvent } from '../../domain/events/DomainEvent.js';

/**
 * Port: EventBus
 * Bus de eventos para publicar eventos de dominio
 */
export interface EventBus {
  /**
   * Publica un evento de dominio
   */
  publish(event: DomainEvent): Promise<void>;

  /**
   * Publica múltiples eventos
   */
  publishAll(events: DomainEvent[]): Promise<void>;
}
