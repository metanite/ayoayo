-- Add the initial search phrases used by service landing pages.
-- This migration is idempotent: existing keywords are preserved, merged and de-duplicated.

grant select on public.categories to anon, authenticated, service_role;
grant select on public.services to anon;
grant select, insert, update on public.services to authenticated, service_role;

update public.services as service
set keywords = (
  select array_agg(keyword order by keyword)
  from (
    select distinct keyword
    from unnest(
      coalesce(service.keywords, '{}'::text[])
      || array[
        'computer repair shop business',
        'computer repair shop names',
        'repair shop for computers',
        'computer repair shop',
        'computer repair shop near me',
        'computer repair shop in cebu',
        'computer repair cebu'
      ]::text[]
    ) as items(keyword)
  ) as merged
)
where service.slug = 'computer-repair';

update public.services as service
set keywords = (
  select array_agg(keyword order by keyword)
  from (
    select distinct keyword
    from unnest(
      coalesce(service.keywords, '{}'::text[])
      || array[
        'laptop adapter repair',
        'laptop monitor repair',
        'laptop repair cebu city',
        'laptop repair shop cebu',
        'laptop repair cebu'
      ]::text[]
    ) as items(keyword)
  ) as merged
)
where service.slug = 'laptop-repair';

update public.services as service
set keywords = (
  select array_agg(keyword order by keyword)
  from (
    select distinct keyword
    from unnest(
      coalesce(service.keywords, '{}'::text[])
      || array['iphone battery replacement cebu', 'iphone repair in cebu']::text[]
    ) as items(keyword)
  ) as merged
)
where service.slug = 'iphone-repair';

update public.services as service
set keywords = (
  select array_agg(keyword order by keyword)
  from (
    select distinct keyword
    from unnest(coalesce(service.keywords, '{}'::text[]) || array['android head unit repair', 'android repair']::text[]) as items(keyword)
  ) as merged
)
where service.slug = 'android-repair';

update public.services as service
set keywords = (
  select array_agg(keyword order by keyword)
  from (
    select distinct keyword
    from unnest(
      coalesce(service.keywords, '{}'::text[])
      || array['tv repair cebu', 'lcd tv repair', 'tv repair home service']::text[]
    ) as items(keyword)
  ) as merged
)
where service.slug in ('tv-repair', 'television-repair');

update public.services as service
set keywords = (
  select array_agg(keyword order by keyword)
  from (
    select distinct keyword
    from unnest(
      coalesce(service.keywords, '{}'::text[])
      || array['car aircon repair in cebu city', 'aircon repair cebu']::text[]
    ) as items(keyword)
  ) as merged
)
where service.slug in ('aircon-repair', 'car-aircon-repair', 'air-conditioning-repair');

update public.services as service
set keywords = (
  select array_agg(keyword order by keyword)
  from (
    select distinct keyword
    from unnest(coalesce(service.keywords, '{}'::text[]) || array['watch repair cebu']::text[]) as items(keyword)
  ) as merged
)
where service.slug in ('watch-repair', 'watch-repair-service');
