-- "Hari ini" on /admin/analytics: p_days = 0 means since midnight Asia/Jakarta (WIB)
-- instead of a rolling window. All period-based functions share one start helper.

create or replace function admin_period_start(p_days integer)
returns timestamptz
language sql stable as $$
  select case
    when p_days = 0 then date_trunc('day', now() at time zone 'Asia/Jakarta') at time zone 'Asia/Jakarta'
    else now() - (p_days || ' days')::interval
  end;
$$;

create or replace function admin_top_paths(p_days integer, p_kind text, p_limit integer)
returns table(path text, slug text, views bigint)
language sql stable as $$
  select pv.path, pv.slug,
         count(distinct coalesce(pv."visitorHash", 'row:' || pv.id::text))::bigint as views
  from page_views pv
  where pv."createdAt" >= admin_period_start(p_days)
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
  where "createdAt" >= admin_period_start(p_days)
  group by 1
  order by 1;
$$;

create or replace function admin_views_summary(p_days integer)
returns table(total bigint, unique_visitors bigint, unique_paths bigint, product_views bigint, blog_views bigint)
language sql stable as $$
  select
    count(*)::bigint,
    count(distinct coalesce("visitorHash", 'row:' || id::text))::bigint,
    count(distinct path)::bigint,
    count(distinct coalesce("visitorHash", 'row:' || id::text) || '|' || path) filter (where kind = 'product')::bigint,
    count(distinct coalesce("visitorHash", 'row:' || id::text) || '|' || path) filter (where kind = 'blog')::bigint
  from page_views
  where "createdAt" >= admin_period_start(p_days);
$$;

-- Unique visitors per WIB hour for today, all 24 hours present (zeros included).
create or replace function admin_views_hourly_today()
returns table(hour integer, views bigint)
language sql stable as $$
  with v as (
    select extract(hour from ("createdAt" at time zone 'Asia/Jakarta'))::int as h,
           coalesce("visitorHash", 'row:' || id::text) as visitor
    from page_views
    where "createdAt" >= admin_period_start(0)
  )
  select g.h, count(distinct v.visitor)::bigint
  from generate_series(0, 23) as g(h)
  left join v on v.h = g.h
  group by g.h
  order by g.h;
$$;
