import { useRouter } from 'next/router'
import { getAllPosts, getPostBySlug } from '../lib/api'
import markdownToHtml from '../lib/markdownToHtml'

import PostBody from '../components/PostBody'
import SignupCard from '../components/SignupCard'

import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { NextSeo } from 'next-seo'

const Post = ({ post }) => {
  const router = useRouter()
  const { t } = useTranslation('common')

  return (
    <>
      <NextSeo
        title={post.title}
        description={post.excerpt}
        openGraph={{
          title: `${post.title}`,
          description: `${post.excerpt}`,
          images: [{ url: `https://montrealphoto.club/${post.ogImage.url}` }],
        }}
      />
      <div>
        <main className="mx-auto max-w-4xl">
          <h1 className="text-5xl font-semibold">{post.title}</h1>
          <img className="my-6" src={post.ogImage.url} alt="" />
          <PostBody content={post.content} />
        </main>
        <section className="mt-12">
          <SignupCard
            signupHeadline={t('signupHeadline')}
            signupSubline={t('signupSubline')}
            signupPlaceholder={t('signupPlaceholder')}
            signupCta={t('signupCta')}
            signupPrivacy={t('signupPrivacy')}
          />
        </section>
      </div>
    </>
  )
}

export async function getStaticProps({ params, locale }) {
  const post = getPostBySlug({
    locale,
    slug: params.slug,
    fields: [
      'title',
      'date',
      'slug',
      'author',
      'content',
      'ogImage',
      'coverImage',
    ],
  })
  const content = await markdownToHtml(post.content || '')

  return {
    props: {
      post: {
        ...post,
        content,
      },
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

/**
 * @type {import('next').GetStaticPathsContext}
 *
 * @param {Object} params
 * @param {string[]} params.locales
 * @param {string} params.defaultLocale
 **/
export async function getStaticPaths({ locales }) {
  const posts = []

  for (const locale of locales) {
    posts.push(
      ...getAllPosts({ locale, fields: ['slug'] }).map((post) => {
        post.locale = locale
        return post
      })
    )
  }

  const paths = posts.map((post) => {
    return {
      params: {
        slug: post.slug,
      },
      locale: post.locale,
    }
  })

  return {
    paths,
    fallback: false,
  }
}

export default Post
