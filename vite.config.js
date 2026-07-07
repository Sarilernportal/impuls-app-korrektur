/*
Project:
Impuls Child care

Developed by:
Moebus Digital Solutions GbR
Chris Moebus
26.10.2022

Scope:
Vite configuration file
*/

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// Export the vite configuration
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      srcDir: 'src',
      injectRegister: 'auto',
      // filename: 'service-worker.js',
      // strategies: 'injectManifest',
      registerType: 'autoUpdate',
      manifest: {
        name: 'Impuls Erziehungshilfen',
        short_name: 'Impuls',
        icons: [
          {
            src: './favicon/pwa-192x192.png',
            type: 'image/png',
            sizes: '192x192',
            purpose: 'any'
          },
          {
            src: './favicon/pwa-512x512.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'any'
          },
          {
            src: './favicon/pwa-maskable-192x192.png',
            type: 'image/png',
            sizes: '192x192',
            purpose: 'maskable'
          },
          {
            src: './favicon/pwa-maskable-512x512.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'maskable'
          }
        ],
        start_url: '/',
        scope: '.',
        display: 'standalone',
        theme_color: '#24344e',
        background_color: '#24344e',
        orientation: 'any',
        description: 'Impuls Erziehungshilfen App'
      }
    })
  ],
  resolve: {
    // Make custom aliases to e.g. support @ symbols for root alias
    alias: {
      '@': path.resolve(__dirname, './src'),
      './runtimeConfig': './runtimeConfig.browser'
    }
  },
  define: {
    'process.env': {}
  }
})
