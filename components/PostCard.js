import { format, parseISO } from 'date-fns'
import NextLink from 'next/link'

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
      <div className="grid max-w-4xl cursor-pointer grid-flow-col items-stretch gap-x-8 rounded border p-4">
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
