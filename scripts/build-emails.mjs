/**
 * Builds the Customer.io emails from the React Email source in emails/.
 * Each output holds every language version behind a Liquid if. Paste it as
 * the message body, with no layout.
 *
 *   pnpm email:build   # writes emails/out/<name>.liquid.html
 *
 * Subject lines to use in Customer.io:
 * - login-code (transactional "login-convex"):
 *   {% if trigger.language == "en" %}Your Montréal Photo Club code: {{trigger.code}}{% else %}Votre code Montréal Photo Club : {{trigger.code}}{% endif %}
 * - welcome (campaign "ONB-Welcome"):
 *   {% if customer.language == "en" %}Welcome to the Montréal Photo Club!{% else %}Bienvenue au Montréal Photo Club !{% endif %}
 * - newsletter-2026-10 (broadcast to all members):
 *   {% if customer.language == "en" %}A new website, and a call for new stewards{% elsif customer.language == "fr" or customer.language == "French" %}Un nouveau site, et un appel à la relève{% else %}Un nouveau site et un appel à la relève | A new website and a call for new stewards{% endif %}
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// React escapes quotes in attributes, so the tag goes in after rendering.
const unsubscribe = (html, lang) =>
  html.replaceAll(
    '__UNSUBSCRIBE_URL__',
    lang === 'both'
      ? '{% unsubscribe_url %}'
      : `{% unsubscribe_url lang='${lang}' %}`
  )

const frOrEn =
  (variable) =>
  ({ fr, en }) =>
    `{% if ${variable} == "en" %}${en}{% else %}${fr}{% endif %}`

const EMAILS = [
  {
    name: 'login-code',
    combine: frOrEn('trigger.language'),
    tags: ['{{trigger.code}}'],
  },
  {
    name: 'welcome',
    combine: frOrEn('customer.language'),
    fill: unsubscribe,
    tags: ['{{snippets.greetings}}', '{% unsubscribe_url'],
  },
  {
    // Members with no language (or a value from older imports) get both.
    name: 'newsletter-2026-10',
    variants: ['fr', 'en', 'both'],
    combine: ({ fr, en, both }) =>
      `{% if customer.language == "en" %}${en}` +
      `{% elsif customer.language == "fr" or customer.language == "French" %}${fr}` +
      `{% else %}${both}{% endif %}`,
    fill: unsubscribe,
    tags: ['{% unsubscribe_url'],
  },
]

const tmp = mkdtempSync(join(tmpdir(), 'mpc-email-'))
execFileSync(
  'pnpm',
  ['exec', 'email', 'export', '--dir', 'emails', '--outDir', tmp, '--silent'],
  { stdio: 'inherit' }
)
mkdirSync('emails/out', { recursive: true })

for (const {
  name,
  variants = ['fr', 'en'],
  combine,
  tags,
  fill = (html) => html,
} of EMAILS) {
  const html = Object.fromEntries(
    variants.map((lang) => [
      lang,
      fill(readFileSync(join(tmp, `${name}-${lang}.html`), 'utf8'), lang),
    ])
  )
  for (const [lang, version] of Object.entries(html)) {
    for (const tag of tags) {
      if (!version.includes(tag)) {
        throw new Error(`${name}-${lang}: ${tag} is missing`)
      }
    }
  }
  const out = `emails/out/${name}.liquid.html`
  writeFileSync(out, combine(html))
  console.log(`Wrote ${out}`)
}
