import {
  Body,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  pixelBasedPreset,
  Section,
  Tailwind,
  Text,
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
const SITE_URL = 'https://montrealphoto.club'

const copy = {
  fr: {
    preview: (code: string) =>
      `Votre code : ${code}. Il expire dans 15 minutes.`,
    kicker: 'Code de connexion',
    heading: 'Voici votre code',
    intro:
      'Entrez ce code sur le site pour rejoindre le club ou ouvrir votre profil.',
    expiry: 'Il expire dans 15 minutes.',
    notYou:
      'Vous n’avez rien demandé ? Ignorez ce courriel. Personne ne peut ouvrir votre profil sans ce code.',
    footer: 'Montréal Photo Club · Fait à Montréal',
    reply: 'Une question ? Répondez à ce courriel.',
  },
  en: {
    preview: (code: string) => `Your code: ${code}. It expires in 15 minutes.`,
    kicker: 'Login code',
    heading: 'Here is your code',
    intro: 'Enter this code on the site to join the club or open your profile.',
    expiry: 'It expires in 15 minutes.',
    notYou:
      'Did not ask for it? Ignore this email. Nobody can open your profile without this code.',
    footer: 'Montréal Photo Club · Made in Montréal',
    reply: 'A question? Reply to this email.',
  },
} as const

export type LoginCodeProps = {
  locale: 'fr' | 'en'
  /** Exported as the Liquid tag {{trigger.code}} for Customer.io. */
  code: string
}

export function LoginCode({ locale, code }: LoginCodeProps) {
  const t = copy[locale]
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
        <Preview>{t.preview(code)}</Preview>
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
              <Section className="px-9 pt-9 pb-8">
                <Text className="m-0 text-[12px] font-bold tracking-[1.2px] text-muted uppercase">
                  {t.kicker}
                </Text>
                <Heading
                  as="h1"
                  className="mt-2 mb-0 text-[30px] leading-[34px] font-extrabold tracking-[-0.8px]"
                >
                  {t.heading}
                </Heading>
                <Text className="mt-4 mb-6 text-[17px] leading-[26px] text-ink-soft">
                  {t.intro}
                </Text>
                <Section className="rounded-[16px] bg-paper px-4 py-5 text-center">
                  <Text className="m-0 font-mono text-[36px] leading-[44px] font-bold tracking-[10px]">
                    {code}
                  </Text>
                </Section>
                <Text className="mt-4 mb-0 text-center text-[15px] text-muted">
                  {t.expiry}
                </Text>
                <Hr className="my-7 border-0 border-t border-solid border-line" />
                <Text className="m-0 text-[14px] leading-[22px] text-muted">
                  {t.notYou}
                </Text>
              </Section>
            </Section>

            <Section className="px-2 pt-6 text-center">
              <Text className="m-0 text-[13px] leading-[20px] text-muted">
                {t.footer} ·{' '}
                <Link href={SITE_URL} className="text-muted underline">
                  montrealphoto.club
                </Link>
              </Text>
              <Text className="mt-1 mb-0 text-[13px] leading-[20px] text-muted">
                {t.reply}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
