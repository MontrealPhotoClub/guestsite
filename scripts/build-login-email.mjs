/**
 * Builds the Customer.io login-code email (message "login-convex") from the
 * React Email source in emails/. Paste the output into Customer.io.
 *
 *   pnpm email:build   # writes emails/out/login-code.liquid.html
 *
 * Subject line to use in Customer.io:
 *   {% if trigger.language == "en" %}Your Montréal Photo Club code: {{trigger.code}}{% else %}Votre code Montréal Photo Club : {{trigger.code}}{% endif %}
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const OUT_FILE = 'emails/out/login-code.liquid.html'

const tmp = mkdtempSync(join(tmpdir(), 'mpc-email-'))
execFileSync(
  'pnpm',
  ['exec', 'email', 'export', '--dir', 'emails', '--outDir', tmp, '--silent'],
  { stdio: 'inherit' }
)
const fr = readFileSync(join(tmp, 'login-code-fr.html'), 'utf8')
const en = readFileSync(join(tmp, 'login-code-en.html'), 'utf8')

// One message for both languages: Customer.io picks the branch with Liquid.
mkdirSync('emails/out', { recursive: true })
writeFileSync(
  OUT_FILE,
  `{% if trigger.language == "en" %}${en}{% else %}${fr}{% endif %}`
)
console.log(`Wrote ${OUT_FILE}`)
