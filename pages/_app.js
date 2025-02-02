import '../styles/globals.css'

import { appWithTranslation } from 'next-i18next'
import Head from 'next/head'

import { DefaultSeo } from 'next-seo'

import SEO from '../next-seo-config'

import Footer from '../components/Footer'
import Header from '../components/Header'

import { useRouter } from 'next/router'

import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter()
  const { t } = useTranslation('common')

  return (
    <>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <DefaultSeo {...SEO} />
      <div className="mx-auto max-w-6xl px-6 pb-6">
        <Header
          menuAbout={t('menuAbout')}
          menuPast={t('menuPast')}
          menuContact={t('menuContact')}
          menuLogin={t('menuLogin')}
        />
        <div className="mx-auto py-12">
          <Component {...pageProps} />
        </div>
        <Footer />
      </div>
    </>
  )
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
})

export default appWithTranslation(MyApp)
