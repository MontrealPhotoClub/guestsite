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
      /** Short label on the club line, e.g. "Atelier" or "Défi". */
      kind: z.string().optional(),
      /** Where it happened, or who it was with. */
      place: z.string().optional(),
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
      /** Stewards page: the large intro sentence and the two side lists. */
      lead: z.string().optional(),
      seeking: z.array(z.string()).optional(),
      offering: z.array(z.string()).optional(),
    }),
})

export const collections = { events, pages }
