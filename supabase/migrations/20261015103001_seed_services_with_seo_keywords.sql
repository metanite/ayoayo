-- Seed the service records that own the requested SEO search phrases.
-- Existing rows are reactivated and keep their current keywords.

insert into public.categories (name, slug, description, sort_order)
values
  ('Computers', 'computers', 'Laptop and desktop computer repair services.', 10),
  ('Mobile devices', 'mobile-devices', 'Phone and mobile device repair services.', 20),
  ('Electronics', 'electronics', 'TV, watch and consumer electronics repair services.', 30),
  ('Aircon and automotive', 'aircon-automotive', 'Aircon and automotive repair services.', 40)
on conflict (slug) do update
set is_active = true;

insert into public.services as existing (category_id, name, slug, description, keywords, is_active)
values
  (
    (select id from public.categories where slug = 'computers'),
    'Laptop repair',
    'laptop-repair',
    'Find dependable laptop repair shops for diagnostics, parts and upgrades.',
    array[
      'notebook repair',
      'laptop technician',
      'laptop adapter repair',
      'laptop monitor repair',
      'laptop repair cebu city',
      'laptop repair shop cebu',
      'laptop repair cebu'
    ],
    true
  ),
  (
    (select id from public.categories where slug = 'computers'),
    'Computer repair',
    'computer-repair',
    'Local computer repair for slow, broken or unreliable desktops and workstations.',
    array[
      'desktop repair',
      'pc repair',
      'computer repair shop business',
      'computer repair shop names',
      'repair shop for computers',
      'computer repair shop',
      'computer repair shop near me',
      'computer repair shop in cebu',
      'computer repair cebu'
    ],
    true
  ),
  (
    (select id from public.categories where slug = 'mobile-devices'),
    'iPhone repair',
    'iphone-repair',
    'Find iPhone repair shops for screens, batteries, charging ports and more.',
    array[
      'iphone screen replacement',
      'apple phone repair',
      'iphone battery replacement cebu',
      'iphone repair in cebu'
    ],
    true
  ),
  (
    (select id from public.categories where slug = 'mobile-devices'),
    'Android phone repair',
    'android-repair',
    'Android phone repair for screens, batteries, charging issues and software problems.',
    array['samsung repair', 'phone repair', 'android head unit repair', 'android repair'],
    true
  ),
  (
    (select id from public.categories where slug = 'electronics'),
    'TV repair',
    'tv-repair',
    'TV and LCD display repair services from local technicians.',
    array['tv repair cebu', 'lcd tv repair', 'tv repair home service'],
    true
  ),
  (
    (select id from public.categories where slug = 'aircon-automotive'),
    'Aircon repair',
    'aircon-repair',
    'Home and automotive aircon repair services in Cebu.',
    array['car aircon repair in cebu city', 'aircon repair cebu'],
    true
  ),
  (
    (select id from public.categories where slug = 'electronics'),
    'Watch repair',
    'watch-repair',
    'Watch repair and maintenance services in Cebu.',
    array['watch repair cebu'],
    true
  )
on conflict (slug) do update
set
  category_id = excluded.category_id,
  name = excluded.name,
  description = excluded.description,
  is_active = true,
  keywords = (
    select array_agg(keyword order by keyword)
    from (
      select distinct keyword
      from unnest(
        coalesce(existing.keywords, '{}'::text[]) || excluded.keywords
      ) as items(keyword)
    ) as merged
  );
