import type { ReactNode } from 'react'
import {
  Body,
  Container,
  Font,
  Head,
  Html,
  Img,
  Preview,
  pixelBasedPreset,
  Section,
  Tailwind,
} from 'react-email'

// Path B, "Ligne de métro": the same palette as src/styles/global.css.
const config = {
  presets: [pixelBasedPreset],
  theme: {
    extend: {
      colors: {
        paper: '#f4f4f1',
        ink: '#151515',
        'ink-soft': '#45453f',
        muted: '#5c5c57',
        line: '#e4e4df',
        accent: '#e8701a',
      },
    },
  },
}

// Live on the old site now; vercel.json rewrites it after the launch.
const MARK_URL = 'https://montrealphoto.club/static/favicon.png'
export const SITE_URL = 'https://montrealphoto.club'

export type Locale = 'fr' | 'en'

/** Club header, white card with the orange rail, and a footer slot. */
export function Shell({
  locale,
  preview,
  children,
  footer,
}: {
  locale: Locale
  preview: string
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <Html lang={locale === 'fr' ? 'fr-CA' : 'en-CA'}>
      <Tailwind config={config}>
        <Head>
          <Font
            fontFamily="Schibsted Grotesk"
            fallbackFontFamily={['Helvetica', 'Arial', 'sans-serif']}
            webFont={{
              url: 'https://fonts.gstatic.com/s/schibstedgrotesk/v7/Jqz55SSPQuCQF3t8uOwiUL-taUTtap9GayojdSFO.woff2',
              format: 'woff2',
            }}
            fontWeight="400 800"
            fontStyle="normal"
          />
        </Head>
        <Preview>{preview}</Preview>
        <Body className="m-0 bg-paper px-3 py-8 font-sans text-ink">
          <Container className="mx-auto w-full max-w-[560px]">
            <Section className="pb-5">
              <Img
                src={MARK_URL}
                width="36"
                height="36"
                alt=""
                className="inline-block align-middle"
              />
              <span className="ml-[10px] align-middle text-[17px] font-extrabold tracking-[-0.3px]">
                Montréal Photo Club
              </span>
            </Section>

            <Section className="overflow-hidden rounded-[24px] bg-white">
              <Section className="h-[6px] bg-accent" />
              <Section className="px-9 pt-9 pb-8">{children}</Section>
            </Section>

            <Section className="px-2 pt-6 text-center">{footer}</Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
