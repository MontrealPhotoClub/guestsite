const title = 'Montréal Photo Club 📷'
const description =
  'A friendly gathering of photographers in Montréal from all horizons and skills.'

const SEO = {
  title,
  description,
  canonical: 'https://montrealphoto.club',
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://montrealphoto.club',
    title,
    description,
    images: [
      {
        url: 'https://montrealphoto.club/static/images/og-banner.jpg',
        alt: title,
      },
    ],
  },
  twitter: {
    handle: '@@mtlphotoclub',
    site: 'montrealphoto.club',
    cardType: 'summary_large_image',
  },
}

export default SEO
