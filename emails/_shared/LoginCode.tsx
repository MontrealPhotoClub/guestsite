import { Heading, Hr, Link, Section, Text } from 'react-email'
import { type Locale, Shell, SITE_URL } from './Shell'

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
  locale: Locale
  /** Exported as the Liquid tag {{trigger.code}} for Customer.io. */
  code: string
}

export function LoginCode({ locale, code }: LoginCodeProps) {
  const t = copy[locale]
  return (
    <Shell
      locale={locale}
      preview={t.preview(code)}
      footer={
        <>
          <Text className="m-0 text-[13px] leading-[20px] text-muted">
            {t.footer} ·{' '}
            <Link href={SITE_URL} className="text-muted underline">
              montrealphoto.club
            </Link>
          </Text>
          <Text className="mt-1 mb-0 text-[13px] leading-[20px] text-muted">
            {t.reply}
          </Text>
        </>
      }
    >
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
    </Shell>
  )
}
