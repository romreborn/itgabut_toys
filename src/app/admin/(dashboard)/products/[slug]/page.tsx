import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { adminStyles as s } from "../../../adminStyles";
import ConfirmButton from "../../../ConfirmButton";
import ProductForm from "../ProductForm";
import { updateProductAction, deleteProductAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: product } = await supabaseAdmin
    .from("products")
    .select(
      "slug,name,ip,type,battery,pack,condition,period,periodIndex,availability,tag,price,oldPrice,year,isActive,sortOrder,imageUrl"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (!product) notFound();

  const updateWithSlug = updateProductAction.bind(null, slug);
  const deleteWithSlug = deleteProductAction.bind(null, slug);

  return (
    <div style={s.page}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <h1 style={s.h1}>Edit produk</h1>
        <form action={deleteWithSlug}>
          <ConfirmButton confirmText={`Hapus produk "${product.name}"? Tindakan ini tidak bisa dibatalkan.`} style={s.buttonDanger}>
            Hapus produk
          </ConfirmButton>
        </form>
      </div>
      <ProductForm action={updateWithSlug} values={product} isNew={false} />
    </div>
  );
}
