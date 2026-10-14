-- Optional long-form copy for a product page (lineup, release info). Shown on
-- /produk/[slug] under "Tentang produk ini" and used for the meta description.
alter table products add column if not exists description text;
