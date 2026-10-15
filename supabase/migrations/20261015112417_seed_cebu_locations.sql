insert into public.locations (name, slug, type, description, is_active)
values ('Cebu', 'cebu', 'province', 'Tech repair shops across Cebu Province and Metro Cebu.', true)
on conflict (slug) do update
set name = excluded.name,
    type = excluded.type,
    description = excluded.description,
    is_active = true;

with location_rows (name, slug, type) as (
  values
    ('Alcantara', 'alcantara', 'municipality'),
    ('Alcoy', 'alcoy', 'municipality'),
    ('Alegria', 'alegria', 'municipality'),
    ('Aloguinsan', 'aloguinsan', 'municipality'),
    ('Argao', 'argao', 'municipality'),
    ('Asturias', 'asturias', 'municipality'),
    ('Badian', 'badian', 'municipality'),
    ('Balamban', 'balamban', 'municipality'),
    ('Bantayan', 'bantayan', 'municipality'),
    ('Barili', 'barili', 'municipality'),
    ('Bogo City', 'bogo-city', 'city'),
    ('Boljoon', 'boljoon', 'municipality'),
    ('Borbon', 'borbon', 'municipality'),
    ('Carcar City', 'carcar-city', 'city'),
    ('Carmen', 'carmen', 'municipality'),
    ('Catmon', 'catmon', 'municipality'),
    ('Cebu City', 'cebu-city', 'city'),
    ('Compostela', 'compostela', 'municipality'),
    ('Consolacion', 'consolacion', 'municipality'),
    ('Cordova', 'cordova', 'municipality'),
    ('Daanbantayan', 'daanbantayan', 'municipality'),
    ('Dalaguete', 'dalaguete', 'municipality'),
    ('Danao City', 'danao-city', 'city'),
    ('Dumanjug', 'dumanjug', 'municipality'),
    ('Ginatilan', 'ginatilan', 'municipality'),
    ('Lapu-Lapu City', 'lapu-lapu-city', 'city'),
    ('Liloan', 'liloan', 'municipality'),
    ('Madridejos', 'madridejos', 'municipality'),
    ('Malabuyoc', 'malabuyoc', 'municipality'),
    ('Mandaue City', 'mandaue-city', 'city'),
    ('Medellin', 'medellin', 'municipality'),
    ('Minglanilla', 'minglanilla', 'municipality'),
    ('Moalboal', 'moalboal', 'municipality'),
    ('Naga City', 'naga-city', 'city'),
    ('Oslob', 'oslob', 'municipality'),
    ('Pilar', 'pilar', 'municipality'),
    ('Pinamungahan', 'pinamungahan', 'municipality'),
    ('Poro', 'poro', 'municipality'),
    ('Ronda', 'ronda', 'municipality'),
    ('Samboan', 'samboan', 'municipality'),
    ('San Fernando', 'san-fernando', 'municipality'),
    ('San Francisco', 'san-francisco', 'municipality'),
    ('San Remigio', 'san-remigio', 'municipality'),
    ('Santa Fe', 'santa-fe', 'municipality'),
    ('Santander', 'santander', 'municipality'),
    ('Sibonga', 'sibonga', 'municipality'),
    ('Sogod', 'sogod', 'municipality'),
    ('Tabogon', 'tabogon', 'municipality'),
    ('Tabuelan', 'tabuelan', 'municipality'),
    ('Talisay City', 'talisay-city', 'city'),
    ('Toledo City', 'toledo-city', 'city'),
    ('Tuburan', 'tuburan', 'municipality'),
    ('Tudela', 'tudela', 'municipality')
)
insert into public.locations (parent_id, name, slug, type, description, is_active)
select
  province.id,
  location_rows.name,
  location_rows.slug,
  location_rows.type,
  location_rows.name || ' in Cebu Province.',
  true
from location_rows
cross join (select id from public.locations where slug = 'cebu') as province
on conflict (slug) do update
set parent_id = excluded.parent_id,
    name = excluded.name,
    type = excluded.type,
    description = excluded.description,
    is_active = true;
