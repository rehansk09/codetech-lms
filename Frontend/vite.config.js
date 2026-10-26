import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      includeAssets: ["codetech-icon.svg"],
      manifest: {
        name: "Codetech Learning Platform",
        short_name: "Codetech",
        description: "Learn, teach, and grow with Codetech.",
        theme_color: "#071022",
        background_color: "#030817",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/codetech-icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        navigateFallback: "index.html",
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/res\.cloudinary\.com\/.*$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "codetech-course-media",
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 14 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: [
      'react-icons',
      '@radix-ui/react-separator',
      '@radix-ui/react-slot',
      'class-variance-authority',
    ],
  },
})
