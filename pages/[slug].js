import { useRouter } from 'next/router'
import { getPostBySlug, getAllPosts } from '../lib/api'
import markdownToHtml from '../lib/markdownToHtml'

import PostBody from '../components/PostBody'
import SignupCard from '../components/SignupCard'

export default function Post({ post }) {
  const router = useRouter()
  return (
    <div>
      <main className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-semibold">{post.title}</h1>
        <img className="my-6" src={post.ogImage.url} alt="" />
        <PostBody content={post.content} />
      </main>
      <section className="mt-12">
        <SignupCard />
      </section>
    </div>
  )
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'ogImage',
    'coverImage',
  ])
  const content = await markdownToHtml(post.content || '')

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug'])

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}
