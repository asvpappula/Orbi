alter table public.user_integrations
  add column if not exists canvas_ical_url text;
