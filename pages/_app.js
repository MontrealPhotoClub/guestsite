import 'tailwindcss/tailwind.css'

import React, { useEffect } from 'react'
import { appWithTranslation } from 'next-i18next'
import Head from 'next/head'

import { DefaultSeo } from 'next-seo'

import SEO from '../next-seo-config'

import Header from '../components/Header'
import Footer from '../components/Footer'

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
      <div className="max-w-6xl px-6 pb-6 mx-auto">
        <Header
          menuAbout={t('menuAbout')}
          menuPast={t('menuPast')}
          menuContact={t('menuContact')}
          menuLogin={t('menuLogin')}
        />
        <div className="py-12 mx-auto">
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
