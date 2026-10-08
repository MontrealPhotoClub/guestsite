import { Welcome, type WelcomeProps } from './_shared/Welcome'

type Props = Partial<Omit<WelcomeProps, 'locale'>>

// `email export` renders without props, so the defaults are the Liquid parts
// that Customer.io fills in. See scripts/build-emails.mjs.
export default function WelcomeEn({
  greeting = '{{snippets.greetings}}',
  unsubscribeUrl = '__UNSUBSCRIBE_URL__',
}: Props) {
  return (
    <Welcome locale="en" greeting={greeting} unsubscribeUrl={unsubscribeUrl} />
  )
}

WelcomeEn.PreviewProps = {
  greeting: 'Hi Ada,',
  unsubscribeUrl: 'https://montrealphoto.club',
} satisfies Props
