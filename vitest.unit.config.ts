import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

// Unit and component tests (Storybook browser tests stay on vite.config.ts).
export default defineConfig({
  plugins: [react(), tsconfigPaths(), vanillaExtractPlugin()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    passWithNoTests: true,
    setupFiles: ['./src/vitest.setup.ts'],
  },
})
