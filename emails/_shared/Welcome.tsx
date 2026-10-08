import { Button, Heading, Hr, Link, Text } from 'react-email'
import { type Locale, Shell, SITE_URL } from './Shell'

const copy = {
  fr: {
    preview:
      'Votre profil vous attend. À bientôt lors d’une prochaine sortie !',
    heading: 'Bienvenue au club !',
    intro:
      'Nous sommes heureux de vous compter parmi nos membres, et nous avons hâte de vous croiser lors d’une prochaine sortie.',
    profile:
      'Prenez une minute pour compléter votre profil. Votre nom, votre site et votre Instagram nous aident à mettre un visage sur votre courriel.',
    cta: 'Compléter mon profil',
    profileUrl: `${SITE_URL}/profil`,
    stewards: 'Le club cherche aussi sa relève. Envie d’organiser une sortie ?',
    stewardsLink: 'Lire l’appel',
    stewardsUrl: `${SITE_URL}/releve`,
    reply: 'Une question ? Répondez à ce courriel.',
    footer: 'Montréal Photo Club · Fait à Montréal',
    unsubscribe: 'Se désinscrire de tous les courriels',
  },
  en: {
    preview: 'Your profile is waiting. See you at an upcoming outing!',
    heading: 'Welcome to the club!',
    intro:
      'We’re happy to count you among our members, and we can’t wait to meet you at an upcoming outing.',
    profile:
      'Take a minute to complete your profile. Your name, website and Instagram help us put a face to your email.',
    cta: 'Complete my profile',
    profileUrl: `${SITE_URL}/en/profile`,
    stewards:
      'The club is also looking for new stewards. Feel like organizing an outing?',
    stewardsLink: 'Read the call',
    stewardsUrl: `${SITE_URL}/en/stewards`,
    reply: 'A question? Reply to this email.',
    footer: 'Montréal Photo Club · Made in Montréal',
    unsubscribe: 'Unsubscribe from all emails',
  },
} as const

export type WelcomeProps = {
  locale: Locale
  /** Exported as the Customer.io snippet {{snippets.greetings}}. */
  greeting: string
  /** Exported as a placeholder; the build script puts the Liquid tag in. */
  unsubscribeUrl: string
}

export function Welcome({ locale, greeting, unsubscribeUrl }: WelcomeProps) {
  const t = copy[locale]
  return (
    <Shell
      locale={locale}
      preview={t.preview}
      footer={
        <>
          <Text className="m-0 text-[13px] leading-[20px] text-muted">
            {t.footer} ·{' '}
            <Link href={SITE_URL} className="text-muted underline">
              montrealphoto.club
            </Link>
          </Text>
          <Text className="mt-1 mb-0 text-[13px] leading-[20px] text-muted">
            <Link href={unsubscribeUrl} className="text-muted underline">
              {t.unsubscribe}
            </Link>
          </Text>
        </>
      }
    >
      <Text className="m-0 text-[17px] leading-[26px] text-ink-soft">
        {greeting}
      </Text>
      <Heading
        as="h1"
        className="mt-2 mb-0 text-[30px] leading-[34px] font-extrabold tracking-[-0.8px]"
      >
        {t.heading}
      </Heading>
      <Text className="mt-4 mb-0 text-[17px] leading-[26px] text-ink-soft">
        {t.intro}
      </Text>
      <Text className="mt-4 mb-6 text-[17px] leading-[26px] text-ink-soft">
        {t.profile}
      </Text>
      <Button
        href={t.profileUrl}
        className="rounded-full bg-ink px-7 py-4 text-[16px] font-bold text-white"
      >
        {t.cta}
      </Button>
      <Hr className="my-7 border-0 border-t border-solid border-line" />
      <Text className="m-0 text-[15px] leading-[23px] text-ink-soft">
        <span className="mr-2 inline-block h-[10px] w-[10px] rounded-full bg-accent align-middle" />
        {t.stewards}{' '}
        <Link href={t.stewardsUrl} className="font-bold text-ink underline">
          {t.stewardsLink}
        </Link>
      </Text>
      <Text className="mt-3 mb-0 text-[15px] leading-[23px] text-muted">
        {t.reply}
      </Text>
    </Shell>
  )
}
