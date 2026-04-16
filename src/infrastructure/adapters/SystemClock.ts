import type { Clock } from '../../application/ports/Clock.js';

/**
 * Adaptador: SystemClock
 * Implementación de reloj usando la hora del sistema
 */
export class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }
}
