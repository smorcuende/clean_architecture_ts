export abstract class DomainEvent {
  abstract get eventName(): string;
  protected readonly occurredOn: Date = new Date();

  getOccurredOn(): Date {
    return this.occurredOn;
  }
}
