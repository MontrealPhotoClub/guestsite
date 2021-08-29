import { getEventPosts } from '../lib/api'
import PostCard from '../components/PostCard'

import { useRouter } from 'next/router'

import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const Past = ({ allPosts }) => {
  const router = useRouter()
  const { t } = useTranslation('common')

  return (
    <main className="grid grid-flow-row gap-12 justify-items-center">
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
