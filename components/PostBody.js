export default function PostBody({ content }) {
  return (
    <div className="prose max-w-4xl">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
