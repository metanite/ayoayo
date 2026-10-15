-- The RLS policies protect these tables, but the API roles still need table privileges.
grant select on public.locations to anon, authenticated, service_role;
grant select on public.businesses to anon;
grant select, insert, update, delete on public.businesses to authenticated, service_role;
grant select on public.business_services to anon, authenticated, service_role;
grant insert, delete on public.business_services to authenticated, service_role;
grant select, insert, update on public.business_hours to authenticated, service_role;
