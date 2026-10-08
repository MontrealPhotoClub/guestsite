# Montréal Photo Club

The website of the [Montréal Photo Club](https://montrealphoto.club). After
carrd, Gatsby + Novela and Next.js, this fourth version merges the guest site
and the member profile app into one repo.

- **Site:** [Astro](https://astro.build), fully static, French at `/` and
  English at `/en`.
- **Members:** [Convex](https://convex.dev) stores members. Members log in
  with a 6-digit code sent by email (Convex Auth).
- **Email:** [Customer.io](https://customer.io) sends the login codes and the
  event announcements. Convex pushes every member change to Customer.io, and a
  Customer.io webhook sends unsubscribes back to Convex.
- **Hosting:** Vercel.

## Layout

```
src/
  content/events/{fr,en}/   past events (same slug in both languages)
  content/pages/{fr,en}/    about, contact, stewards (releve.md / stewards.md)
  assets/                   images, optimized at build time
  i18n/                     UI strings and the localized route map
  components/views/         one view per page type, shared by both locales
  components/profile/       the only client-side island (React)
  pages/                    thin route files, French at the root, English in en/
convex/                     schema, auth, members, Customer.io sync, webhook
scripts/import-cio.ts       one-time import of the Customer.io people export
vercel.json                 redirects from the old URLs and profile subdomain
```

## Design

"Ligne de métro": light paper, ink type and one metro-orange accent. Past
events are stations on a line, and the dashed first station points to the
stewards call.

- Colors, radii and component classes (`.btn`, `.rail`, `.station`, `.prose`,
  the profile island) live in `src/styles/global.css`.
- Fonts: Schibsted Grotesk (UI and headings) and Newsreader (the stewards
  letter), downloaded at build time by Astro's fonts API (`astro.config.mjs`).
- The stewards banner shows on every page except the stewards page. Remove
  `<StewardsBanner>` from `src/layouts/BaseLayout.astro` once new stewards are
  found.
- The stewards letter and its two lists are in
  `src/content/pages/{fr/releve,en/stewards}.md`.

## Develop

```sh
pnpm install
pnpm dev:convex   # first run creates a dev deployment and writes .env.local
pnpm dev          # http://localhost:4321
```

Add `PUBLIC_CONVEX_URL` to `.env.local` with the value of `CONVEX_URL`.

Set the dev deployment variables once:

```sh
npx @convex-dev/auth --web-server-url http://localhost:4321  # SITE_URL, JWT_PRIVATE_KEY, JWKS
npx convex env set LOG_LOGIN_CODES true  # print codes in the Convex logs, no email
```

`npx @convex-dev/auth` can offer to write `convex/auth.ts`,
`convex/auth.config.ts` and `convex/http.ts`. They exist already: keep them.

To try Convex without an account: `CONVEX_AGENT_MODE=anonymous npx convex dev`.

Checks: `pnpm check` (Astro and Convex types), `pnpm lint` (Biome) and
`pnpm build`. `pnpm format` applies Biome's formatting and safe fixes.

Biome formats `.astro` files with its experimental HTML support
(`html.experimentalFullSupportEnabled` in `biome.json`). Biome does not sort
Tailwind classes here: its `useSortedClasses` rule is still in the nursery and
does not know Tailwind 4 themes.

## Customer.io setup

1. **Emails.** The source is React Email in `emails/` (`pnpm email:dev`
   previews it). `pnpm email:build` writes `emails/out/<name>.liquid.html`,
   both languages in one file. Paste it as the message body, with no layout:
   `login-code` into the transactional message `login-convex`, `welcome` into
   the ONB-Welcome campaign email, `newsletter-2026-10` into a broadcast.
   Email images go in `public/email/` so their URLs stay stable. The subject
   lines are in `scripts/build-emails.mjs`. The login API call sends the code
   to unsubscribed members too and does not keep it in delivery history.
2. **API keys.** Set `CIO_SITE_ID`, `CIO_TRACK_API_KEY` and `CIO_APP_API_KEY`
   on the Convex deployment.
3. **New members** are submitted to the existing `next-signup-fr` and
   `next-signup-en` forms, so the campaigns attached to them keep working.
4. **Profile changes** update the person with the same attributes as the old
   profile app: `firstName`, `lastName`, `website`, `instagram`, `language`,
   `unsubscribed`.
5. **Reporting webhook.** Data & Integrations → Reporting webhooks → add
   `https://<deployment>.convex.site/cio/webhook`. Enable the customer
   subscribed, customer unsubscribed and email unsubscribed events. Put the
   signing key in `CIO_WEBHOOK_SIGNING_KEY`.

## Import the existing members

Export people from Customer.io as CSV with these columns: `id`, `cio_id`,
`email`, `firstName`, `lastName`, `website`, `instagram`, `language`,
`unsubscribed`, `created_at`. Then:

```sh
pnpm import:cio people.csv          # dev deployment
pnpm import:cio people.csv --prod   # production deployment
```

The import matches rows by email, so you can run it again. It does not call
Customer.io. Imported members get their account when they first log in with
the same email.

## Deploy

On Vercel, `vercel.json` sets the framework and the build command
(`scripts/vercel-build.sh`), and `package.json` `engines` pins Node 24.x, like the Vercel project.

- Production builds deploy the Convex functions first, then build the site
  with the production Convex URL. Preview builds only build the site, so the
  profile page is unavailable on previews.
- Environment variables (Production): `CONVEX_DEPLOY_KEY` (production deploy
  key from the Convex dashboard) and `PUBLIC_UMAMI_WEBSITE_ID`.
- Add `profile.montrealphoto.club` as a domain of this project. `vercel.json`
  redirects it to `/profil`.

On the Convex production deployment, set `SITE_URL=https://montrealphoto.club`,
the auth keys (`npx @convex-dev/auth --prod`) and the Customer.io variables.
See `.env.example` for the full list.
