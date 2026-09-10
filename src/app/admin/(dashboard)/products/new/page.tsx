import { adminStyles as s } from "../../../adminStyles";
import ProductForm from "../ProductForm";
import { createProductAction } from "../actions";

export default function NewProductPage() {
  return (
    <div style={s.page}>
      <h1 style={s.h1}>Produk baru</h1>
      <ProductForm action={createProductAction} isNew />
    </div>
  );
}
