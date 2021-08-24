import { getEventPosts } from '../lib/api'
import PostCard from '../components/PostCard'

export default function Index({ allPosts }) {
  return (
    <main className="grid grid-flow-row gap-12 justify-items-center">
      {allPosts.map((post) => (
        <PostCard
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

export async function getStaticProps() {
  const allPosts = getEventPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
  ])

  return {
    props: { allPosts },
  }
}
