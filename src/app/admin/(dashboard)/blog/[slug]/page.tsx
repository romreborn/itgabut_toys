import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { adminStyles as s } from "../../../adminStyles";
import ConfirmButton from "../../../ConfirmButton";
import BlogForm from "../BlogForm";
import { updateBlogPostAction, deleteBlogPostAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: post } = await supabaseAdmin
    .from("blog_posts")
    .select("slug,title,excerpt,category,readTime,dateLabel,isPublished,body")
    .eq("slug", slug)
    .maybeSingle();

  if (!post) notFound();

  const updateWithSlug = updateBlogPostAction.bind(null, slug);
  const deleteWithSlug = deleteBlogPostAction.bind(null, slug);

  return (
    <div style={s.page}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <h1 style={s.h1}>Edit artikel</h1>
        <form action={deleteWithSlug}>
          <ConfirmButton confirmText={`Hapus artikel "${post.title}"? Tindakan ini tidak bisa dibatalkan.`} style={s.buttonDanger}>
            Hapus artikel
          </ConfirmButton>
        </form>
      </div>
      <BlogForm action={updateWithSlug} values={post} isNew={false} />
    </div>
  );
}
