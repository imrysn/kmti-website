import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const R2_ORIGIN = 'https://pub-41f5a96a10a946a5ae6457884d5653fd.r2.dev';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',

      // Only pre-cache our small local app shell (index.html + bundles).
      // R2 assets are cached at runtime via the runtimeCaching rules below.
      workbox: {
        // ----------------------------------------------------------------
        // Runtime caching rules — applied to network requests at runtime
        // ----------------------------------------------------------------
        runtimeCaching: [
          {
            // Cache-First for R2 images (png, jpg, jpeg, gif, svg, webp)
            // On repeated visits → served instantly from Cache API, no network.
            urlPattern: new RegExp(`^${R2_ORIGIN}/.+\\.(png|jpe?g|gif|svg|webp)$`),
            handler: 'CacheFirst',
            options: {
              cacheName: 'r2-images-v1',
              expiration: {
                maxEntries: 200,        // max 200 images cached
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              // R2 now has CORS configured — 200 = CORS response, 0 = opaque fallback
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Cache-First for R2 3D models (.glb / .gltf)
            // These are the largest assets — caching eliminates the 50+ MB
            // re-download on every subsequent visit to the Projects page.
            urlPattern: new RegExp(`^${R2_ORIGIN}/.+\\.(glb|gltf)$`),
            handler: 'CacheFirst',
            options: {
              cacheName: 'r2-models-v1',
              expiration: {
                maxEntries: 30,         // max 30 models cached
                maxAgeSeconds: 60 * 60 * 24 * 60, // 60 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // StaleWhileRevalidate for Google Fonts stylesheets
            // Serves cached font CSS instantly, updates in background.
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets-v1',
            },
          },
          {
            // Cache-First for Google Font files (the actual woff2 files)
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts-v1',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [200],
              },
            },
          },
        ],

        // Glob patterns for pre-caching (just the app shell)
        globPatterns: ['**/*.{js,css,html,ico,png}'],
      },

      // Minimal PWA manifest — required by vite-plugin-pwa
      manifest: {
        name: 'KMTI Website',
        short_name: 'KMTI',
        description: 'Kusakabe & Maeno Technologies Inc.',
        theme_color: '#0d1b3e',
        background_color: '#0d1b3e',
        display: 'browser',
        icons: [
          {
            src: '/kmti_logo.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/kmti_logo.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  assetsInclude: ['**/*.glb', '**/*.gltf'],
})
