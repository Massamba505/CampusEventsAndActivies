import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // This enables global testing functions
    environment: 'jsdom', // Use jsdom to simulate a browser environment
  },
});
