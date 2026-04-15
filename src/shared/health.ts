/**
 * Health check module
 * Provides basic health status information
 */

export interface HealthStatus {
  status: 'UP' | 'DOWN';
  timestamp: Date;
}

/**
 * Gets the current health status of the application
 * @returns HealthStatus object with current status and timestamp
 */
export function getHealthStatus(): HealthStatus {
  return {
    status: 'UP',
    timestamp: new Date(),
  };
}
