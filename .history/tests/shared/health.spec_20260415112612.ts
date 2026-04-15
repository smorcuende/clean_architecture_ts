import { getHealthStatus, HealthStatus } from '../../src/shared/health';

describe('Health Check Module', () => {
  describe('getHealthStatus', () => {
    it('should return UP status', () => {
      const health = getHealthStatus();
      expect(health.status).toBe('UP');
    });

    it('should return a HealthStatus object with required properties', () => {
      const health = getHealthStatus();
      expect(health).toHaveProperty('status');
      expect(health).toHaveProperty('timestamp');
    });

    it('should return a valid timestamp', () => {
      const health = getHealthStatus();
      expect(health.timestamp).toBeInstanceOf(Date);
      expect(health.timestamp.getTime()).toBeLessThanOrEqual(new Date().getTime());
    });

    it('should return UP status consistently', () => {
      const health1 = getHealthStatus();
      const health2 = getHealthStatus();
      expect(health1.status).toBe(health2.status);
      expect(health1.status).toBe('UP');
    });
  });
});
