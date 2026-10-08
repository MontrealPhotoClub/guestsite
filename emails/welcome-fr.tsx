import { Welcome, type WelcomeProps } from './_shared/Welcome'

type Props = Partial<Omit<WelcomeProps, 'locale'>>

// `email export` renders without props, so the defaults are the Liquid parts
// that Customer.io fills in. See scripts/build-emails.mjs.
export default function WelcomeFr({
  greeting = '{{snippets.greetings}}',
  unsubscribeUrl = '__UNSUBSCRIBE_URL__',
}: Props) {
  return (
    <Welcome locale="fr" greeting={greeting} unsubscribeUrl={unsubscribeUrl} />
  )
}

WelcomeFr.PreviewProps = {
  greeting: 'Bonjour Ada,',
  unsubscribeUrl: 'https://montrealphoto.club',
} satisfies Props
