import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

// Entry ids are `<locale>/<slug>`. Events share the same slug in both locales.
const events = defineCollection({
  loader: glob({ pattern: '{fr,en}/*.md', base: './src/content/events' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      excerpt: z.string(),
      date: z.coerce.date(),
      cover: image(),
      author: z.string().default('Jp Valery'),
    }),
})

// About, contact and stewards pages.
const pages = defineCollection({
  loader: glob({ pattern: '{fr,en}/*.md', base: './src/content/pages' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      excerpt: z.string(),
      date: z.coerce.date().optional(),
      cover: image().optional(),
      author: z.string().optional(),
    }),
})

export const collections = { events, pages }
