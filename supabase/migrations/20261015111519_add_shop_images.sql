alter table public.businesses add column if not exists image_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'shop-images',
  'shop-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "Public can view shop images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'shop-images');

create policy "Admins can upload shop images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'shop-images' and private.is_admin());

create policy "Admins can update shop images"
on storage.objects
for update
to authenticated
using (bucket_id = 'shop-images' and private.is_admin())
with check (bucket_id = 'shop-images' and private.is_admin());

create policy "Admins can delete shop images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'shop-images' and private.is_admin());
