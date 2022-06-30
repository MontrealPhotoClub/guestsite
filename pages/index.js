import FounderWord from '../components/FounderWord'
import SignupCard from '../components/SignupCard'

import { useRouter } from 'next/router'

import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const Homepage = () => {
  const router = useRouter()
  const { t } = useTranslation('common')

  return (
    <div>
      <main className="grid grid-flow-row gap-y-32 pt-16">
        <div className="grid grid-flow-row gap-y-16 px-2">
          <h1 className="text-4xl font-bold sm:text-5xl">
            {t('missionStatement')}
          </h1>

          <SignupCard
            signupHeadline={t('signupHeadline')}
            signupSubline={t('signupSubline')}
            signupPlaceholder={t('signupPlaceholder')}
            signupCta={t('signupCta')}
            signupPrivacy={t('signupPrivacy')}
            signupLocale={t('signupLocale')}
          />
        </div>
        <FounderWord
          founderQuote={t('founderQuote')}
          founderTitle={t('founderTitle')}
        />
      </main>
    </div>
  )
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
})

export default Homepage
