import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Environment-specific configuration
const ENV_CONFIG = {
  development: {
    defaultPort: 3000,
    defaultHost: 'localhost',
  },
  production: {
    defaultPort: 8080,
    defaultHost: '0.0.0.0',
  },
  test: {
    defaultPort: 3001,
    defaultHost: 'localhost',
  },
} as const

// Configuration constants
const CONFIG = {
  CHUNK_SIZE_WARNING_LIMIT: 1000,
  PORT: Number(process.env.PORT) || 3000,
  HOST: process.env.HOST || 'localhost',
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_TEST: process.env.NODE_ENV === 'test',
} as const

// Type-safe configuration
export default defineConfig({
  plugins: [react()],
  server: {
    port: CONFIG.PORT,
    host: CONFIG.HOST,
    strictPort: true,
    open: true,
  },
  build: {
    chunkSizeWarningLimit: CONFIG.CHUNK_SIZE_WARNING_LIMIT,
    sourcemap: !CONFIG.IS_PRODUCTION,
    minify: CONFIG.IS_PRODUCTION ? 'terser' : false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['@utils/*'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@constants': path.resolve(__dirname, './src/constants'),
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(CONFIG.NODE_ENV),
    'process.env.IS_PRODUCTION': CONFIG.IS_PRODUCTION,
    'process.env.IS_DEVELOPMENT': CONFIG.IS_DEVELOPMENT,
    'process.env.IS_TEST': CONFIG.IS_TEST,
  },
})
