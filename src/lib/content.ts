import { type CollectionEntry, getCollection, getEntry } from 'astro:content'
import type { Locale } from '../i18n'

/** Events for one locale, newest first. */
export async function getEvents(
  locale: Locale
): Promise<CollectionEntry<'events'>[]> {
  const events = await getCollection('events', ({ id }) =>
    id.startsWith(`${locale}/`)
  )
  return events.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

export async function getPage(
  locale: Locale,
  name: string
): Promise<CollectionEntry<'pages'>> {
  const page = await getEntry('pages', `${locale}/${name}`)
  if (!page) throw new Error(`Missing page: ${locale}/${name}`)
  return page
}
