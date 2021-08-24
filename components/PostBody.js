export default function PostBody({ content }) {
  return (
    <div className="max-w-4xl prose">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
