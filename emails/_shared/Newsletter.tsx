import {
  Button,
  Column,
  Heading,
  Hr,
  Img,
  Link,
  Row,
  Section,
  Text,
} from 'react-email'
import { type Locale, Shell, SITE_URL } from './Shell'

// October 2026 broadcast: the new website and the call for new stewards.
// Images live in public/email/, so their URLs do not change between builds.
const HERO_URL = `${SITE_URL}/email/newsletter-2026-10.jpg`
const AVATAR_URL = `${SITE_URL}/email/jp.jpg`

const copy = {
  fr: {
    preview: 'Un nouveau site, un profil plus simple, et un appel à la relève.',
    kicker: 'Nouvelles du club',
    heading: 'Un nouveau site, et un appel à la relève',
    intro:
      'Ça faisait longtemps ! Deux nouvelles aujourd’hui : le club a un nouveau site, et il cherche des gens pour prendre le relais.',
    heroAlt: 'Deux photographes sur des quais de métro, vus d’en haut',
    siteTitle: 'Le nouveau site',
    siteBody:
      'montrealphoto.club fait peau neuve. Toutes nos sorties depuis 2018 sont réunies sur une ligne de métro, et le site est en français et en anglais.',
    profileBody:
      'Gérer votre profil est aussi plus simple : plus de lien spécial à garder, juste un code à 6 chiffres envoyé par courriel.',
    siteCta: 'Découvrir le site',
    siteUrl: SITE_URL,
    profileLink: 'Mettre à jour mon profil',
    profileUrl: `${SITE_URL}/profil`,
    stewardsTitle: 'Le club cherche sa relève',
    stewardsBody:
      'Je n’ai plus le temps de faire vivre le club comme il le mérite. La pandémie l’a mis en veille, et depuis, la vie a pris de la place.',
    stewardsAsk:
      'Je cherche une ou plusieurs personnes pour organiser des sorties et faire évoluer le club à leur façon. Pas besoin d’être pro : il faut surtout aimer rassembler du monde. Je transmets le nom, le site, la liste des membres et mon aide pour la transition.',
    stewardsCta: 'Lire l’appel',
    stewardsUrl: `${SITE_URL}/releve`,
    reply:
      'Ça vous intéresse ? Répondez simplement à ce courriel. Une ligne suffit.',
    thanks: 'Merci de faire partie de l’aventure,',
    signTitle: 'Fondateur du Montréal Photo Club',
    why: 'Vous recevez ce courriel parce que vous êtes membre du Montréal Photo Club.',
    footer: 'Montréal Photo Club · Fait à Montréal',
    unsubscribe: 'Se désinscrire de tous les courriels',
  },
  en: {
    preview: 'A new website, a simpler profile, and a call for new stewards.',
    kicker: 'Club news',
    heading: 'A new website, and a call for new stewards',
    intro:
      'It’s been a while! Two pieces of news today: the club has a new website, and it’s looking for people to take over.',
    heroAlt: 'Two photographers on metro platforms, seen from above',
    siteTitle: 'The new website',
    siteBody:
      'montrealphoto.club got a makeover. Every outing since 2018 now sits on a metro line, and the site is in French and English.',
    profileBody:
      'Managing your profile is simpler too: no special link to keep, just a 6-digit code sent by email.',
    siteCta: 'Visit the website',
    siteUrl: `${SITE_URL}/en`,
    profileLink: 'Update my profile',
    profileUrl: `${SITE_URL}/en/profile`,
    stewardsTitle: 'The club is looking for new stewards',
    stewardsBody:
      'I no longer have the time to keep the club going the way it deserves. The pandemic put it on hold, and since then, life got busy.',
    stewardsAsk:
      'I’m looking for one or more people to organize outings and shape the club their own way. No need to be a pro: what matters is liking to bring people together. I’ll hand over the name, the website, the member list and my help with the transition.',
    stewardsCta: 'Read the call',
    stewardsUrl: `${SITE_URL}/en/stewards`,
    reply: 'Interested? Just reply to this email. One line is enough.',
    thanks: 'Thanks for being part of the adventure,',
    signTitle: 'Founder of the Montréal Photo Club',
    why: 'You get this email because you are a member of the Montréal Photo Club.',
    footer: 'Montréal Photo Club · Made in Montréal',
    unsubscribe: 'Unsubscribe from all emails',
  },
} as const

const body = 'mt-4 mb-0 text-[17px] leading-[26px] text-ink-soft'
const sectionTitle =
  'mt-0 mb-0 text-[22px] leading-[28px] font-extrabold tracking-[-0.5px]'

function Content({
  locale,
  greeting,
  showHero,
}: {
  locale: Locale
  greeting: string
  showHero: boolean
}) {
  const t = copy[locale]
  return (
    <>
      <Text className="m-0 text-[17px] leading-[26px] text-ink-soft">
        {greeting}
      </Text>
      <Text className="mt-4 mb-0 text-[12px] font-bold tracking-[1.2px] text-muted uppercase">
        {t.kicker}
      </Text>
      <Heading
        as="h1"
        className="mt-2 mb-0 text-[30px] leading-[34px] font-extrabold tracking-[-0.8px]"
      >
        {t.heading}
      </Heading>
      <Text className={body}>{t.intro}</Text>
      {showHero && (
        <Img
          src={HERO_URL}
          width="488"
          alt={t.heroAlt}
          className="mt-6 block h-auto w-full rounded-[16px]"
        />
      )}

      <Heading as="h2" className={`${sectionTitle} mt-8`}>
        {t.siteTitle}
      </Heading>
      <Text className={body}>{t.siteBody}</Text>
      <Text className={body}>{t.profileBody}</Text>
      <Section className="mt-6">
        <Button
          href={t.siteUrl}
          className="rounded-full bg-ink px-7 py-4 text-[16px] font-bold text-white"
        >
          {t.siteCta}
        </Button>
      </Section>
      <Text className="mt-4 mb-0 text-[15px] leading-[23px]">
        <Link href={t.profileUrl} className="font-bold text-ink underline">
          {t.profileLink}
        </Link>
      </Text>

      <Hr className="my-8 border-0 border-t border-solid border-line" />

      <Heading as="h2" className={sectionTitle}>
        <span className="mr-3 inline-block h-[14px] w-[14px] rounded-full border-[4px] border-solid border-ink bg-accent align-middle" />
        {t.stewardsTitle}
      </Heading>
      <Text className={body}>{t.stewardsBody}</Text>
      <Text className={body}>{t.stewardsAsk}</Text>
      <Section className="mt-6">
        <Button
          href={t.stewardsUrl}
          className="rounded-full bg-accent px-7 py-4 text-[16px] font-bold text-ink"
        >
          {t.stewardsCta}
        </Button>
      </Section>
      <Text className={body}>{t.reply}</Text>

      <Text className="mt-8 mb-0 text-[17px] leading-[26px] text-ink-soft">
        {t.thanks}
      </Text>
      <Section className="mt-3">
        <Row>
          <Column className="w-[60px] align-middle">
            <Img
              src={AVATAR_URL}
              width="48"
              height="48"
              alt=""
              className="block rounded-full"
            />
          </Column>
          <Column className="align-middle">
            <Text className="m-0 text-[16px] leading-[22px] font-extrabold">
              Jp Valery
            </Text>
            <Text className="m-0 text-[14px] leading-[20px] text-muted">
              {t.signTitle}
            </Text>
          </Column>
        </Row>
      </Section>
    </>
  )
}

export type NewsletterProps = {
  /** "both": French then English, for members with no language set. */
  locale: Locale | 'both'
  /** Exported as the Customer.io snippet {{snippets.greetings}}. */
  greeting: string
  /** Exported as a placeholder; the build script puts the Liquid tag in. */
  unsubscribeUrl: string
}

export function Newsletter({
  locale,
  greeting,
  unsubscribeUrl,
}: NewsletterProps) {
  const both = locale === 'both'
  const t = copy[both ? 'fr' : locale]
  const muted = 'm-0 text-[13px] leading-[20px] text-muted'
  return (
    <Shell
      locale={both ? 'fr' : locale}
      preview={both ? `${copy.fr.preview} ${copy.en.preview}` : t.preview}
      footer={
        <>
          <Text className={muted}>
            {both ? `${copy.fr.why} ${copy.en.why}` : t.why}
          </Text>
          <Text className={`${muted} mt-1 mb-0`}>
            {t.footer} ·{' '}
            <Link href={SITE_URL} className="text-muted underline">
              montrealphoto.club
            </Link>{' '}
            ·{' '}
            <Link
              href="mailto:contact@montrealphoto.club"
              className="text-muted underline"
            >
              contact@montrealphoto.club
            </Link>
          </Text>
          <Text className={`${muted} mt-1 mb-0`}>
            <Link href={unsubscribeUrl} className="text-muted underline">
              {both
                ? `${copy.fr.unsubscribe} · ${copy.en.unsubscribe}`
                : t.unsubscribe}
            </Link>
          </Text>
        </>
      }
    >
      {both ? (
        <>
          <Text className="mt-0 mb-4 text-[13px] text-muted">
            English version below.
          </Text>
          <Content locale="fr" greeting="Bonjour," showHero />
          <Hr className="my-10 border-0 border-t-[3px] border-solid border-line" />
          <Content locale="en" greeting="Hi," showHero={false} />
        </>
      ) : (
        <Content locale={locale} greeting={greeting} showHero />
      )}
    </Shell>
  )
}
