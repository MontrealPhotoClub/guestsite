/**
 * Builds the Customer.io emails from the React Email source in emails/.
 * Each output holds both languages behind a Liquid if. Paste it as the
 * message body, with no layout.
 *
 *   pnpm email:build   # writes emails/out/<name>.liquid.html
 *
 * Subject lines to use in Customer.io:
 * - login-code (transactional "login-convex"):
 *   {% if trigger.language == "en" %}Your Montréal Photo Club code: {{trigger.code}}{% else %}Votre code Montréal Photo Club : {{trigger.code}}{% endif %}
 * - welcome (campaign "ONB-Welcome"):
 *   {% if customer.language == "en" %}Welcome to the Montréal Photo Club!{% else %}Bienvenue au Montréal Photo Club !{% endif %}
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const EMAILS = [
  {
    name: 'login-code',
    language: 'trigger.language',
    tags: ['{{trigger.code}}'],
  },
  {
    name: 'welcome',
    language: 'customer.language',
    tags: ['{{snippets.greetings}}', '{% unsubscribe_url'],
    // React escapes quotes in attributes, so the tag goes in after rendering.
    fill: (html, lang) =>
      html.replaceAll(
        '__UNSUBSCRIBE_URL__',
        `{% unsubscribe_url lang='${lang}' %}`
      ),
  },
]

const tmp = mkdtempSync(join(tmpdir(), 'mpc-email-'))
execFileSync(
  'pnpm',
  ['exec', 'email', 'export', '--dir', 'emails', '--outDir', tmp, '--silent'],
  { stdio: 'inherit' }
)
mkdirSync('emails/out', { recursive: true })

for (const { name, language, tags, fill = (html) => html } of EMAILS) {
  const [fr, en] = ['fr', 'en'].map((lang) =>
    fill(readFileSync(join(tmp, `${name}-${lang}.html`), 'utf8'), lang)
  )
  const body = `{% if ${language} == "en" %}${en}{% else %}${fr}{% endif %}`
  for (const tag of tags) {
    if (!fr.includes(tag) || !en.includes(tag)) {
      throw new Error(`${name}: ${tag} is missing`)
    }
  }
  const out = `emails/out/${name}.liquid.html`
  writeFileSync(out, body)
  console.log(`Wrote ${out}`)
}
