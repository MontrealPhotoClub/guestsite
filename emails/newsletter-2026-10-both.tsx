import { Newsletter, type NewsletterProps } from './_shared/Newsletter'

type Props = Partial<Omit<NewsletterProps, 'locale'>>

// `email export` renders without props, so the defaults are the Liquid parts
// that Customer.io fills in. See scripts/build-emails.mjs.
export default function NewsletterBoth({
  greeting = '',
  unsubscribeUrl = '__UNSUBSCRIBE_URL__',
}: Props) {
  return (
    <Newsletter
      locale="both"
      greeting={greeting}
      unsubscribeUrl={unsubscribeUrl}
    />
  )
}

NewsletterBoth.PreviewProps = {
  greeting: 'Bonjour Ada,',
  unsubscribeUrl: 'https://montrealphoto.club',
} satisfies Props
