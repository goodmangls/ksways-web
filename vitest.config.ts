import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/test-setup.ts'],
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/test-setup.ts', 'src/test-mocks/**'],
    },
  },
  resolve: {
    alias: {
      'next/image': new URL('./src/test-mocks/next-image.tsx', import.meta.url).pathname,
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
});
