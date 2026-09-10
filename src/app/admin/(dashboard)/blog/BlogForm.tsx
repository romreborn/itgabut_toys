import { adminStyles as s } from "../../adminStyles";

export interface BlogFormValues {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  dateLabel: string;
  isPublished: boolean;
  body: unknown;
}

const EMPTY: BlogFormValues = {
  slug: "",
  title: "",
  excerpt: "",
  category: "",
  readTime: "",
  dateLabel: "",
  isPublished: true,
  body: [],
};

export default function BlogForm({
  action,
  values,
  isNew,
}: {
  action: (formData: FormData) => void;
  values?: Partial<BlogFormValues>;
  isNew: boolean;
}) {
  const v = { ...EMPTY, ...values };

  return (
    <form action={action} style={s.card}>
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
          <label style={s.label}>Judul</label>
          <input name="title" defaultValue={v.title} required style={s.input} />
        </div>
      </div>

      <label style={s.label}>Ringkasan (excerpt)</label>
      <textarea name="excerpt" defaultValue={v.excerpt} rows={2} style={{ ...s.input, fontFamily: "inherit" }} />

      <div style={s.row}>
        <div style={s.col}>
          <label style={s.label}>Kategori</label>
          <input name="category" defaultValue={v.category} style={s.input} />
        </div>
        <div style={s.col}>
          <label style={s.label}>Estimasi baca</label>
          <input name="readTime" defaultValue={v.readTime} style={s.input} placeholder='mis. "4 menit"' />
        </div>
        <div style={s.col}>
          <label style={s.label}>Label tanggal (tampil apa adanya)</label>
          <input name="dateLabel" defaultValue={v.dateLabel} style={s.input} placeholder='mis. "31 Agustus 2026"' />
        </div>
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 600, marginBottom: 16 }}>
        <input type="checkbox" name="isPublished" defaultChecked={v.isPublished} style={{ width: 16, height: 16 }} />
        Publikasikan
      </label>

      <label style={s.label}>
        Body (array blok JSON — {"{"}"t":"p"|"h"|"img"|"products"|"link", ...{"}"})
      </label>
      <textarea
        name="body"
        defaultValue={JSON.stringify(v.body ?? [], null, 2)}
        rows={14}
        spellCheck={false}
        style={{ ...s.input, fontFamily: "ui-monospace, monospace", fontSize: 12.5 }}
      />

      <button type="submit" style={s.button}>
        {isNew ? "Buat artikel" : "Simpan perubahan"}
      </button>
    </form>
  );
}
