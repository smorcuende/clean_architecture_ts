/** Base class para todos los eventos de dominio */
export abstract class DomainEvent {
  abstract readonly eventName: string;
  abstract readonly aggregateId: string;
  protected readonly occurredOn: Date = new Date();

  getOccurredOn(): Date {
    return new Date(this.occurredOn);
  }

  getAggregateId(): string {
    return this.aggregateId;
  }

  getEventName(): string {
    return this.eventName;
  }
}
