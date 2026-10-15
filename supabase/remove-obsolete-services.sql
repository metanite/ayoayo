-- Run this once against an existing project to remove the retired repair types.
delete from public.business_services
where service_id in (
  select id
  from public.services
  where slug in ('console-repair', 'cctv-repair', 'networking-repair')
);

update public.services
set is_active = false
where slug in ('console-repair', 'cctv-repair', 'networking-repair');
