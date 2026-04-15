import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export default defineConfig({
  test: {
    include: ['**/*.spec.ts', '**/*.test.ts'],
    environment: 'node',
    globals: true,
  },
  resolve: {
    alias: {
      '@domain': path.resolve(__dirname, '../../src/domain'),
      '@application': path.resolve(__dirname, '../../src/application'),
      '@infrastructure': path.resolve(__dirname, '../../src/infrastructure'),
      '@composition': path.resolve(__dirname, '../../src/composition'),
      '@shared': path.resolve(__dirname, '../../src/shared'),
    },
  },
});
