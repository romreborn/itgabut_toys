-- Count analytics by unique visitor instead of raw page loads, so a reload by the
-- same person doesn't count twice. /api/track stores an HMAC of IP + user agent
-- (never the raw IP) in "visitorHash". Rows recorded before this column existed
-- have no hash, so each of them still counts as its own visitor.

alter table page_views add column if not exists "visitorHash" text;
create index if not exists page_views_path_visitor_idx on page_views (path, "visitorHash");

create or replace function admin_top_paths(p_days integer, p_kind text, p_limit integer)
returns table(path text, slug text, views bigint)
language sql stable as $$
  select pv.path, pv.slug,
         count(distinct coalesce(pv."visitorHash", 'row:' || pv.id::text))::bigint as views
  from page_views pv
  where pv."createdAt" > now() - (p_days || ' days')::interval
    and (p_kind is null or pv.kind = p_kind)
  group by pv.path, pv.slug
  order by views desc
  limit p_limit;
$$;

create or replace function admin_views_daily(p_days integer)
returns table(day date, views bigint)
language sql stable as $$
  select ("createdAt" at time zone 'Asia/Jakarta')::date as day,
         count(distinct coalesce("visitorHash", 'row:' || id::text))::bigint
  from page_views
  where "createdAt" > now() - (p_days || ' days')::interval
  group by 1
  order by 1;
$$;

-- Return shape changes (adds unique_visitors), so it has to be dropped first.
drop function if exists admin_views_summary(integer);
create function admin_views_summary(p_days integer)
returns table(total bigint, unique_visitors bigint, unique_paths bigint, product_views bigint, blog_views bigint)
language sql stable as $$
  select
    count(*)::bigint,
    count(distinct coalesce("visitorHash", 'row:' || id::text))::bigint,
    count(distinct path)::bigint,
    count(distinct coalesce("visitorHash", 'row:' || id::text) || '|' || path) filter (where kind = 'product')::bigint,
    count(distinct coalesce("visitorHash", 'row:' || id::text) || '|' || path) filter (where kind = 'blog')::bigint
  from page_views
  where "createdAt" > now() - (p_days || ' days')::interval;
$$;
