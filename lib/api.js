import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

/**
 * @param {string} locale
 * @returns string
 */
const getPostsDirectory = (locale) =>
  join(process.cwd(), locale === 'en' ? 'content' : 'contenu', 'posts')

/**
 * @param {string} locale
 * @returns string[]
 */
export function getPostSlugs(locale) {
  return fs.readdirSync(getPostsDirectory(locale))
}

/**
 * @param {Object} params
 * @param {string} params.slug
 * @param {string} params.locale
 * @param {string[]} [params.fields]
 * @returns {Object} Post with fields specified in params
 */
export function getPostBySlug({ slug, locale, fields = [] }) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(getPostsDirectory(locale), `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const items = {}

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug
    }
    if (field === 'content') {
      items[field] = content
    }

    if (data[field]) {
      items[field] = data[field]
    }
  })

  return items
}

/**
 * @param {Object} params
 * @param {string} params.locale
 * @param {string[]} [params.fields]
 * @returns {Object} Post with fields specified in params
 */
export function getAllPosts({ locale, fields = [] }) {
  const slugs = getPostSlugs(locale)
  const posts = slugs
    .map((slug) => getPostBySlug({ slug: slug, locale, fields: fields }))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return posts
}

/**
 * @param {Object} params
 * @param {string} params.locale
 * @param {string[]} [params.fields]
 * @returns {Object} Post with fields specified in params
 */
export function getEventPosts({ locale, fields = [] }) {
  const allSlugs = getPostSlugs(locale)
  const slugs = allSlugs.filter(
    (el) => el !== 'about.md' && el !== 'contact.md'
  )
  const posts = slugs
    .map((slug) => getPostBySlug({ slug: slug, locale, fields: fields }))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return posts
}
