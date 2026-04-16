/**
 * Port: Clock
 * Abstracción para obtener la hora actual
 * Facilita testing con fechas fijas
 */
export interface Clock {
  /**
   * Obtiene la fecha/hora actual
   */
  now(): Date;
}
