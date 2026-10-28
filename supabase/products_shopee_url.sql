-- Optional per-product Shopee link (affiliate link) for the "Beli di Shopee" button on
-- /produk/[slug]. When empty, the button falls back to the store page (SHOPEE_URL).
alter table products add column if not exists "shopeeUrl" text;

notify pgrst, 'reload schema';
