create extension if not exists "uuid-ossp";
create extension if not exists postgis with schema extensions;
create schema if not exists private;

create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text not null default 'Administrator',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

grant select, insert, update on public.admin_users to service_role;
grant select on public.admin_users to authenticated;

create table if not exists public.categories (id uuid primary key default extensions.uuid_generate_v4(), name text not null, slug text not null unique, description text, sort_order integer not null default 0, is_active boolean not null default true, created_at timestamptz not null default now());
create table if not exists public.services (id uuid primary key default extensions.uuid_generate_v4(), category_id uuid not null references public.categories(id) on delete restrict, name text not null, slug text not null unique, description text, keywords text[] not null default '{}', is_active boolean not null default true, created_at timestamptz not null default now());
create table if not exists public.locations (id uuid primary key default extensions.uuid_generate_v4(), parent_id uuid references public.locations(id) on delete restrict, name text not null, slug text not null unique, type text not null check (type in ('province', 'city', 'municipality', 'barangay')), description text, coordinates extensions.geography(point, 4326), is_active boolean not null default true, created_at timestamptz not null default now());
create table if not exists public.businesses (id uuid primary key default extensions.uuid_generate_v4(), slug text not null unique, name text not null, tagline text, description text, location_id uuid not null references public.locations(id) on delete restrict, barangay text, address text not null, phone text, website text, facebook text, instagram text, hours jsonb not null default '{}'::jsonb, coordinates extensions.geography(point, 4326), status text not null default 'draft' check (status in ('draft', 'published', 'unpublished', 'flagged')), verified boolean not null default false, featured boolean not null default false, last_verified_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists public.business_services (business_id uuid not null references public.businesses(id) on delete cascade, service_id uuid not null references public.services(id) on delete cascade, primary key (business_id, service_id));
create table if not exists public.business_links (id uuid primary key default extensions.uuid_generate_v4(), business_id uuid not null references public.businesses(id) on delete cascade, label text not null, url text not null, created_at timestamptz not null default now());
create table if not exists public.business_hours (business_id uuid primary key references public.businesses(id) on delete cascade, hours jsonb not null default '{}'::jsonb);
create table if not exists public.business_reports (id uuid primary key default extensions.uuid_generate_v4(), business_id uuid not null references public.businesses(id) on delete cascade, reason text not null, details text, reporter_email text, status text not null default 'open' check (status in ('open', 'reviewed', 'resolved')), created_at timestamptz not null default now());
create table if not exists public.analytics_events (id bigint generated always as identity primary key, event_name text not null, business_id uuid references public.businesses(id) on delete set null, service_id uuid references public.services(id) on delete set null, location_id uuid references public.locations(id) on delete set null, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now());

create index if not exists businesses_coordinates_idx on public.businesses using gist (coordinates);
create index if not exists businesses_status_idx on public.businesses(status);
create index if not exists locations_parent_idx on public.locations(parent_id);

-- Retire repair types that are no longer part of the public directory.
delete from public.business_services
where service_id in (
  select id
  from public.services
  where slug in ('console-repair', 'cctv-repair', 'networking-repair')
);
update public.services
set is_active = false
where slug in ('console-repair', 'cctv-repair', 'networking-repair');

create or replace function private.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where lower(email) = lower(auth.jwt() ->> 'email')
      and is_active = true
  );
$$;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;

alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.services enable row level security;
alter table public.locations enable row level security;
alter table public.businesses enable row level security;
alter table public.business_services enable row level security;
alter table public.business_links enable row level security;
alter table public.business_hours enable row level security;
alter table public.business_reports enable row level security;
alter table public.analytics_events enable row level security;

create policy "Admins can read admin users" on public.admin_users for select using (private.is_admin());
create policy "Admins can manage categories" on public.categories for all using (private.is_admin()) with check (private.is_admin());
create policy "Admins can manage services" on public.services for all using (private.is_admin()) with check (private.is_admin());
create policy "Admins can manage locations" on public.locations for all using (private.is_admin()) with check (private.is_admin());
create policy "Admins can manage businesses" on public.businesses for all using (private.is_admin()) with check (private.is_admin());
create policy "Admins can manage business services" on public.business_services for all using (private.is_admin()) with check (private.is_admin());
create policy "Admins can manage business links" on public.business_links for all using (private.is_admin()) with check (private.is_admin());
create policy "Admins can manage business hours" on public.business_hours for all using (private.is_admin()) with check (private.is_admin());
create policy "Admins can manage business reports" on public.business_reports for all using (private.is_admin()) with check (private.is_admin());
create policy "Admins can manage analytics events" on public.analytics_events for all using (private.is_admin()) with check (private.is_admin());

create policy "Public can read active categories" on public.categories for select using (is_active = true);
create policy "Public can read active services" on public.services for select using (is_active = true);
create policy "Public can read active locations" on public.locations for select using (is_active = true);
create policy "Public can read published businesses" on public.businesses for select using (status = 'published');
create policy "Public can read published business services" on public.business_services for select using (exists (select 1 from public.businesses where businesses.id = business_id and businesses.status = 'published'));
create policy "Public can read published business links" on public.business_links for select using (exists (select 1 from public.businesses where businesses.id = business_id and businesses.status = 'published'));

-- The Auth user itself is created by scripts/seed-admin.mjs because passwords must
-- be handled by Supabase Auth. This row grants that user directory-admin access.
insert into public.admin_users (id, email, name)
select id, 'admin@ayoayo.ph', 'ayoayo Administrator'
from auth.users
where lower(email) = 'admin@ayoayo.ph'
on conflict (email) do update
set id = excluded.id, name = excluded.name, is_active = true;
