export default function PostBody({ content }) {
  return (
    <div className="prose">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
