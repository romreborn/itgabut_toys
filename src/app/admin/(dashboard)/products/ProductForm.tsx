import { adminStyles as s } from "../../adminStyles";

export interface ProductFormValues {
  slug: string;
  name: string;
  ip: string;
  type: "BLIND_BOX" | "NON_BLIND_BOX";
  battery: boolean;
  pack: string;
  condition: string;
  period: string;
  periodIndex: number;
  availability: "READY" | "PREORDER" | "SOLD";
  tag: "BEST" | "NEW" | "MOVIE" | null;
  price: number;
  oldPrice: number;
  year: number | null;
  isActive: boolean;
  sortOrder: number;
  imageUrl: string | null;
}

const EMPTY: ProductFormValues = {
  slug: "",
  name: "",
  ip: "",
  type: "BLIND_BOX",
  battery: false,
  pack: "",
  condition: "Ready Stock",
  period: "Ready Stock",
  periodIndex: 0,
  availability: "READY",
  tag: null,
  price: 0,
  oldPrice: 0,
  year: null,
  isActive: true,
  sortOrder: 0,
  imageUrl: null,
};

export default function ProductForm({
  action,
  values,
  isNew,
}: {
  action: (formData: FormData) => void;
  values?: Partial<ProductFormValues>;
  isNew: boolean;
}) {
  const v = { ...EMPTY, ...values };

  return (
    <form action={action} encType="multipart/form-data" style={s.card}>
      <div style={s.row}>
        <div style={s.col}>
          <label style={s.label}>Slug (identifier URL)</label>
          <input
            name="slug"
            defaultValue={v.slug}
            required
            readOnly={!isNew}
            style={{ ...s.input, background: isNew ? "#fff" : "#F2E7DC" }}
          />
        </div>
        <div style={s.col}>
          <label style={s.label}>Nama produk</label>
          <input name="name" defaultValue={v.name} required style={s.input} />
        </div>
      </div>

      <div style={s.row}>
        <div style={s.col}>
          <label style={s.label}>IP / Seri</label>
          <input name="ip" defaultValue={v.ip} required style={s.input} />
        </div>
        <div style={s.col}>
          <label style={s.label}>Tipe</label>
          <select name="type" defaultValue={v.type} style={s.input}>
            <option value="BLIND_BOX">Blind Box</option>
            <option value="NON_BLIND_BOX">Non Blind Box</option>
          </select>
        </div>
      </div>

      <div style={s.row}>
        <div style={s.col}>
          <label style={s.label}>Kemasan (pack)</label>
          <input name="pack" defaultValue={v.pack} style={s.input} placeholder='mis. "1 pcs / box"' />
        </div>
        <div style={s.col}>
          <label style={s.label}>Catatan stok (condition)</label>
          <input name="condition" defaultValue={v.condition} style={s.input} placeholder='mis. "Ready Stock"' />
        </div>
      </div>

      <div style={s.row}>
        <div style={s.col}>
          <label style={s.label}>Label periode</label>
          <input name="period" defaultValue={v.period} style={s.input} placeholder='mis. "September"' />
        </div>
        <div style={s.col}>
          <label style={s.label}>Index periode (0 = Ready Stock, 1–12 = bulan)</label>
          <input type="number" name="periodIndex" defaultValue={v.periodIndex} min={0} max={12} style={s.input} />
        </div>
      </div>

      <div style={s.row}>
        <div style={s.col}>
          <label style={s.label}>Ketersediaan</label>
          <select name="availability" defaultValue={v.availability} style={s.input}>
            <option value="READY">Ready</option>
            <option value="PREORDER">Pre-order</option>
            <option value="SOLD">Sold out</option>
          </select>
        </div>
        <div style={s.col}>
          <label style={s.label}>Tag</label>
          <select name="tag" defaultValue={v.tag ?? ""} style={s.input}>
            <option value="">— tidak ada —</option>
            <option value="BEST">Best seller</option>
            <option value="NEW">Baru</option>
            <option value="MOVIE">Movie</option>
          </select>
        </div>
      </div>

      <div style={s.row}>
        <div style={s.col}>
          <label style={s.label}>Harga (Rp)</label>
          <input type="number" name="price" defaultValue={v.price} required min={0} style={s.input} />
        </div>
        <div style={s.col}>
          <label style={s.label}>Harga coret (Rp, opsional)</label>
          <input type="number" name="oldPrice" defaultValue={v.oldPrice} min={0} style={s.input} />
        </div>
        <div style={s.col}>
          <label style={s.label}>Tahun rilis (opsional)</label>
          <input type="number" name="year" defaultValue={v.year ?? ""} style={s.input} />
        </div>
      </div>

      <div style={s.row}>
        <div style={s.col}>
          <label style={s.label}>Urutan (sortOrder — makin besar makin baru)</label>
          <input type="number" name="sortOrder" defaultValue={v.sortOrder} required style={s.input} />
        </div>
        <div style={{ ...s.col, display: "flex", gap: 24, alignItems: "center", paddingTop: 28 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 600 }}>
            <input type="checkbox" name="battery" defaultChecked={v.battery} style={{ width: 16, height: 16 }} />
            Pakai baterai
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 600 }}>
            <input type="checkbox" name="isActive" defaultChecked={v.isActive} style={{ width: 16, height: 16 }} />
            Aktif (tampil di katalog)
          </label>
        </div>
      </div>

      <div style={s.row}>
        <div style={s.col}>
          <label style={s.label}>URL foto (dipakai jika tidak upload file)</label>
          <input name="imageUrl" defaultValue={v.imageUrl ?? ""} style={s.input} placeholder="https://…" />
        </div>
        <div style={s.col}>
          <label style={s.label}>Atau upload foto baru</label>
          <input type="file" name="imageFile" accept="image/png,image/jpeg,image/webp,image/gif" style={s.input} />
        </div>
      </div>

      {v.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={v.imageUrl}
          alt=""
          style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 10, border: "2px solid #2E1A10", marginBottom: 16 }}
        />
      )}

      <button type="submit" style={s.button}>
        {isNew ? "Buat produk" : "Simpan perubahan"}
      </button>
    </form>
  );
}
