import { adminStyles as s } from "../../../adminStyles";
import BlogForm from "../BlogForm";
import { createBlogPostAction } from "../actions";

export default function NewBlogPostPage() {
  return (
    <div style={s.page}>
      <h1 style={s.h1}>Artikel baru</h1>
      <BlogForm action={createBlogPostAction} isNew />
    </div>
  );
}
