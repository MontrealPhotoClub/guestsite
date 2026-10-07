// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://montrealphoto.club',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  // Responsive srcset for every image, markdown images included.
  image: { layout: 'constrained' },
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'fr',
        locales: { fr: 'fr-CA', en: 'en-CA' },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})
