import NextLink from 'next/link'
import { parseISO, format } from 'date-fns'

export default function PostCard({
  title,
  date,
  slug,
  author,
  coverImage,
  excerpt,
}) {
  const fdate = parseISO(date)
  return (
    <NextLink href={slug}>
      <div className="grid items-stretch max-w-4xl grid-flow-col p-4 border rounded cursor-pointer gap-x-8">
        <div>
          <img src={coverImage} className="rounded" />
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="font-semibold">
              <time dateTime={fdate}>{format(fdate, 'LLLL	d, yyyy')}</time> —{' '}
              {author}
            </p>
          </div>
          <div>
            <p>{excerpt}</p>
          </div>
        </div>
      </div>
    </NextLink>
  )
}
