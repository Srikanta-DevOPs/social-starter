export default function Compose(){
  return (
    <div className="card max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Compose</h1>
      <form action="/api/posts" method="post" encType="multipart/form-data" className="space-y-3">
        <div><label className="label">Text</label><textarea name="content" className="textarea" maxLength={500} required placeholder="What's happening? #hashtags welcome" /></div>
        <div><label className="label">Image (optional)</label><input type="file" name="image" accept="image/*" /></div>
        <button className="btn btn-primary">Post</button>
      </form>
    </div>
  );
}
