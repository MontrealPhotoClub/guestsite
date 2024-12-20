const title = 'Montréal Photo Club 📷'
const description =
  'A friendly gathering of photographers in Montréal from all horizons and skills.'

const SEO = {
  titleTemplate: '%s | Montréal Photo Club 📷',
  defaultTitle: title,
  description: description,
  canonical: 'https://montrealphoto.club',
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://montrealphoto.club',
    title,
    description,
    images: [
      {
        url: 'https://og.jpvalery.me/api/og/photo/club/Montréal%20Photo%20Club',
        alt: title,
      },
    ],
  },
  twitter: {
    handle: '@mtlphotoclub',
    site: 'montrealphoto.club',
    cardType: 'summary_large_image',
  },
}

export default SEO
