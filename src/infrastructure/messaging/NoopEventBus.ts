import type { DomainEvent } from '../../domain/events/DomainEvent.js';
import type { EventBus } from '../../application/ports/EventBus.js';

export class NoopEventBus implements EventBus {
  async publish(_event: DomainEvent): Promise<void> {
    // No hace nada, simplemente ignora el evento
  }

  async publishAll(_events: DomainEvent[]): Promise<void> {
    // No hace nada, simplemente ignora los eventos
  }
} 
