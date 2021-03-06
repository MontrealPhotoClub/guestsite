import PostCard from '../components/PostCard'
import { getEventPosts } from '../lib/api'

import { useRouter } from 'next/router'

import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { NextSeo } from 'next-seo'

const Past = ({ allPosts }) => {
  const router = useRouter()
  const { t } = useTranslation('common')

  return (
    <>
      <NextSeo
        title={t('pastTitle')}
        description={t('pastExcerpt')}
        openGraph={{
          title: `${t('pastTitle')}`,
          description: `${t('pastExcerpt')}`,
          images: [{ url: `${t('pastImage')}` }],
        }}
      />
      <main className="grid grid-flow-row justify-items-center gap-12">
        {allPosts.map((post, index) => (
          <PostCard
            key={index}
            title={post.title}
            date={post.date}
            slug={post.slug}
            author={post.author.name}
            coverImage={post.coverImage}
            excerpt={post.excerpt}
          />
        ))}
      </main>
    </>
  )
}

export const getStaticProps = async ({ locale }) => {
  const allPosts = getEventPosts({
    locale,
    fields: ['title', 'date', 'slug', 'author', 'coverImage', 'excerpt'],
  })

  return {
    props: {
      allPosts,
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

export default Past
