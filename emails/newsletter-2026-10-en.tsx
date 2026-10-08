import { Newsletter, type NewsletterProps } from './_shared/Newsletter'

type Props = Partial<Omit<NewsletterProps, 'locale'>>

// `email export` renders without props, so the defaults are the Liquid parts
// that Customer.io fills in. See scripts/build-emails.mjs.
export default function NewsletterEn({
  greeting = '{{snippets.greetings}}',
  unsubscribeUrl = '__UNSUBSCRIBE_URL__',
}: Props) {
  return (
    <Newsletter
      locale="en"
      greeting={greeting}
      unsubscribeUrl={unsubscribeUrl}
    />
  )
}

NewsletterEn.PreviewProps = {
  greeting: 'Hi Ada,',
  unsubscribeUrl: 'https://montrealphoto.club',
} satisfies Props
