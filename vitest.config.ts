import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/test-setup.ts'],
    coverage: {
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/test-setup.ts', 'src/test-mocks/**', 'src/test-utils/**'],
      // 회귀 floor — 2026-08-18 baseline(80.43/76.63/86.48/80.13)에서 −1pp.
      // 목표치가 아니라 조용한 후퇴를 막는 바닥. 커버리지를 올리면 함께 올릴 것.
      thresholds: {
        statements: 79,
        branches: 75,
        functions: 85,
        lines: 79,
      },
    },
  },
  resolve: {
    alias: {
      'next/image': new URL('./src/test-mocks/next-image.tsx', import.meta.url).pathname,
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
});
