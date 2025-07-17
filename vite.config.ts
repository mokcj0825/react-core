import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          // Create separate chunks for dynamic imports
          'rogue-components': [
            './src/components/Architecture/rogue/Squad.tsx',
            // Add more rogue components here as needed
          ],
        },
      },
    },
  },
  // Ensure proper module resolution for dynamic imports
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
