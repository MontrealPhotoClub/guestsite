/**
 * Imports a Customer.io people CSV export into the Convex `members` table.
 *
 *   pnpm import:cio path/to/people.csv          # dev deployment
 *   pnpm import:cio path/to/people.csv --prod   # production deployment
 *
 * Expected columns (others are ignored): id, cio_id, email, firstName,
 * lastName, website, instagram, language, unsubscribed, created_at.
 * Safe to run again: rows are matched by email.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const BATCH_SIZE = 100

type Row = {
  email: string
  cioId?: string
  firstName?: string
  lastName?: string
  website?: string
  instagram?: string
  language?: string
  unsubscribed?: boolean
  createdAt?: number
}

/** RFC 4180 parser: quoted fields, escaped quotes, newlines in quotes. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"'
        i++
      } else if (char === '"') {
        quoted = false
      } else {
        field += char
      }
    } else if (char === '"') {
      quoted = true
    } else if (char === ',') {
      row.push(field)
      field = ''
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else {
      field += char
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  return rows.filter((r) => r.some((value) => value.trim() !== ''))
}

/** Customer.io exports Unix seconds; accept ISO dates too. */
function parseDate(value: string): number | undefined {
  if (!value) return undefined
  const number = Number(value)
  if (Number.isFinite(number)) return number < 1e12 ? number * 1000 : number
  const parsed = Date.parse(value)
  return Number.isNaN(parsed) ? undefined : parsed
}

function toRow(record: Record<string, string>): Row {
  const optional = (value: string | undefined) => value?.trim() || undefined
  return {
    email: record.email ?? '',
    cioId: optional(record.cio_id),
    firstName: optional(record.firstName),
    lastName: optional(record.lastName),
    website: optional(record.website),
    instagram: optional(record.instagram),
    language: optional(record.language),
    unsubscribed: record.unsubscribed?.trim().toLowerCase() === 'true',
    createdAt: parseDate(record.created_at?.trim() ?? ''),
  }
}

function main() {
  const [file, ...flags] = process.argv.slice(2)
  if (!file) {
    console.error('Usage: pnpm import:cio <people.csv> [--prod]')
    process.exit(1)
  }

  const [header, ...lines] = parseCsv(readFileSync(file, 'utf8'))
  if (!header?.includes('email')) {
    console.error('The CSV needs an "email" column.')
    process.exit(1)
  }
  const rows = lines.map((line) =>
    toRow(Object.fromEntries(header.map((name, i) => [name, line[i] ?? ''])))
  )

  const totals = { inserted: 0, updated: 0, skipped: 0 }
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE)
    const output = execFileSync(
      'npx',
      [
        'convex',
        'run',
        ...flags,
        'members:importBatch',
        JSON.stringify({ rows: batch }),
      ],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }
    )
    const result = JSON.parse(output) as typeof totals
    totals.inserted += result.inserted
    totals.updated += result.updated
    totals.skipped += result.skipped
    console.log(
      `Imported ${Math.min(i + BATCH_SIZE, rows.length)}/${rows.length}`
    )
  }
  console.log(
    `Done: ${totals.inserted} inserted, ${totals.updated} updated, ${totals.skipped} skipped.`
  )
}

main()
