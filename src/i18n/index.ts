import en from './en'
import fr from './fr'

export const locales = ['fr', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'fr'

export type Dict = typeof fr
const dicts: Record<Locale, Dict> = { fr, en }

export const htmlLang: Record<Locale, string> = { fr: 'fr-CA', en: 'en-CA' }

/** Localized route names. Event pages live under `events/<slug>`. */
export const routes = {
  home: { fr: '/', en: '/en' },
  about: { fr: '/a-propos', en: '/en/about' },
  events: { fr: '/evenements', en: '/en/events' },
  contact: { fr: '/contact', en: '/en/contact' },
  stewards: { fr: '/releve', en: '/en/stewards' },
  profile: { fr: '/profil', en: '/en/profile' },
} as const satisfies Record<string, Record<Locale, string>>

export type RouteKey = keyof typeof routes

export function t(locale: Locale): Dict {
  return dicts[locale]
}

export function url(key: RouteKey, locale: Locale): string {
  return routes[key][locale]
}

export function eventUrl(slug: string, locale: Locale): string {
  return `${routes.events[locale]}/${slug}`
}

/** Content collection ids look like `fr/<slug>`. */
export function entrySlug(id: string): string {
  return id.slice(id.indexOf('/') + 1)
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'fr' ? 'en' : 'fr'
}

function normalize(pathname: string): string {
  const path = pathname.replace(/\.html$/, '').replace(/\/+$/, '')
  return path === '' ? '/' : path
}

export function getLocale(pathname: string): Locale {
  const path = normalize(pathname)
  return path === '/en' || path.startsWith('/en/') ? 'en' : 'fr'
}

/** The same page in the given locale, or that locale's home page. */
export function localeUrl(pathname: string, target: Locale): string {
  const path = normalize(pathname)
  const current = getLocale(path)

  for (const key of Object.keys(routes) as RouteKey[]) {
    if (routes[key][current] === path) return routes[key][target]
  }

  const eventsPrefix = `${routes.events[current]}/`
  if (path.startsWith(eventsPrefix)) {
    return eventUrl(path.slice(eventsPrefix.length), target)
  }

  return routes.home[target]
}

/** The same page in the other locale. Used by the language switcher. */
export function altLocaleUrl(pathname: string): string {
  return localeUrl(pathname, otherLocale(getLocale(pathname)))
}

export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(dicts[locale].meta.dateLocale, {
    dateStyle: 'long',
    timeZone: 'America/Montreal',
  }).format(date)
}
