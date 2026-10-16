-- Optional search-result overrides. When set, <title> and the meta description use these
-- instead of the display title/excerpt, so long headlines can stay on the page while the
-- search snippet stays within ~60 / ~160 characters.
alter table blog_posts add column if not exists "seoTitle" text;
alter table blog_posts add column if not exists "seoDescription" text;
alter table products add column if not exists "seoTitle" text;
