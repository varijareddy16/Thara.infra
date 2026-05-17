-- ============================================================
-- THARA INFRA — Supabase Database Schema
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. EXTENSIONS
-- ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- 2. ENUMS
-- ─────────────────────────────────────────────
create type user_role as enum ('admin', 'sales', 'customer');
create type property_status as enum ('Ready to Move', 'Under Construction');
create type property_type as enum ('Apartment', 'Villa', 'Penthouse');
create type lead_status as enum ('New', 'Contacted', 'Site Visit', 'Negotiation', 'Closed Won', 'Closed Lost');
create type career_type as enum ('Full-time', 'Part-time', 'Contract');
create type booking_status as enum ('Pending', 'Confirmed', 'Cancelled');

-- ─────────────────────────────────────────────
-- 3. PROFILES (extends auth.users)
-- ─────────────────────────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  phone       text,
  role        user_role not null default 'customer',
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'customer')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────
-- 4. PROPERTIES
-- ─────────────────────────────────────────────
create table public.properties (
  id          uuid primary key default uuid_generate_v4(),
  slug        text unique not null,
  name        text not null,
  location    text not null,
  price       text not null,
  bhk         text not null default '',
  size        text not null default '',
  status      property_status not null default 'Under Construction',
  type        property_type not null default 'Apartment',
  image_url   text not null default '',
  featured    boolean not null default false,
  amenities   text[] not null default '{}',
  description text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- 5. LEADS (enquiries / inquiries)
-- ─────────────────────────────────────────────
create table public.leads (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  email           text not null,
  phone           text not null,
  message         text not null default '',
  property_id     uuid references public.properties(id) on delete set null,
  property_name   text,                          -- denormalised for display
  status          lead_status not null default 'New',
  assigned_to     uuid references public.profiles(id) on delete set null,
  notes           text not null default '',
  source          text not null default 'website',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- 6. BOOKINGS (site visits)
-- ─────────────────────────────────────────────
create table public.bookings (
  id          uuid primary key default uuid_generate_v4(),
  lead_id     uuid references public.leads(id) on delete cascade,
  property_id uuid references public.properties(id) on delete set null,
  visit_date  date not null,
  visit_time  text not null default '10:00',
  status      booking_status not null default 'Pending',
  notes       text not null default '',
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- 7. CAREERS
-- ─────────────────────────────────────────────
create table public.careers (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  department  text not null,
  location    text not null default 'Hyderabad',
  type        career_type not null default 'Full-time',
  description text not null default '',
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- 8. BLOGS
-- ─────────────────────────────────────────────
create table public.blogs (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  slug        text unique not null,
  excerpt     text not null default '',
  content     text not null default '',
  cover_url   text,
  author_id   uuid references public.profiles(id) on delete set null,
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- 9. UPDATED_AT TRIGGER (reusable)
-- ─────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.properties
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.leads
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.careers
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.blogs
  for each row execute procedure public.set_updated_at();

-- ─────────────────────────────────────────────
-- 10. ROW LEVEL SECURITY
-- ─────────────────────────────────────────────

-- profiles
alter table public.profiles enable row level security;
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles"
  on public.profiles for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "Admins can update all profiles"
  on public.profiles for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- properties — public read, admin write
alter table public.properties enable row level security;
create policy "Anyone can view properties"
  on public.properties for select using (true);
create policy "Admins can insert properties"
  on public.properties for insert
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "Admins can update properties"
  on public.properties for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "Admins can delete properties"
  on public.properties for delete
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- leads — anyone can insert (inquiry form), admin/sales can read/update
alter table public.leads enable row level security;
create policy "Anyone can submit a lead"
  on public.leads for insert with check (true);
create policy "Admins can view all leads"
  on public.leads for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'sales')));
create policy "Admins can update leads"
  on public.leads for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'sales')));
create policy "Admins can delete leads"
  on public.leads for delete
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "Sales can view assigned leads"
  on public.leads for select
  using (assigned_to = auth.uid());

-- bookings
alter table public.bookings enable row level security;
create policy "Anyone can create a booking"
  on public.bookings for insert with check (true);
create policy "Admins and sales can view bookings"
  on public.bookings for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'sales')));
create policy "Admins and sales can update bookings"
  on public.bookings for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'sales')));

-- careers — public read, admin write
alter table public.careers enable row level security;
create policy "Anyone can view active careers"
  on public.careers for select using (active = true);
create policy "Admins can view all careers"
  on public.careers for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "Admins can manage careers"
  on public.careers for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- blogs — public read for published, admin write
alter table public.blogs enable row level security;
create policy "Anyone can view published blogs"
  on public.blogs for select using (published = true);
create policy "Admins can manage blogs"
  on public.blogs for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- ─────────────────────────────────────────────
-- 11. STORAGE BUCKETS
-- ─────────────────────────────────────────────
-- Run these in the Supabase Dashboard > Storage, or via the API:
-- insert into storage.buckets (id, name, public) values ('property-images', 'property-images', true);
-- insert into storage.buckets (id, name, public) values ('brochures', 'brochures', true);
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

-- Storage policies (after creating buckets):
-- create policy "Public read property images"
--   on storage.objects for select using (bucket_id = 'property-images');
-- create policy "Admins can upload property images"
--   on storage.objects for insert
--   with check (bucket_id = 'property-images' and
--     exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- ─────────────────────────────────────────────
-- 12. SEED DATA (optional — matches existing frontend data)
-- ─────────────────────────────────────────────
insert into public.properties (slug, name, location, price, bhk, size, status, type, image_url, featured, amenities, description) values
(
  'thara-skyline-residences',
  'Thara Skyline Residences',
  'Kokapet, Hyderabad',
  '₹1.25 Cr Onwards',
  '3 & 4 BHK',
  '1850 – 2640 sq.ft',
  'Under Construction',
  'Apartment',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
  true,
  array['Infinity Pool', 'Sky Lounge', 'Clubhouse', 'EV Charging', '24/7 Security'],
  'An iconic address rising above Kokapet — Thara Skyline Residences brings cinematic skyline views, hotel-grade amenities and master-crafted interiors to Hyderabad''s fastest-growing financial corridor.'
),
(
  'thara-mirador-villas',
  'Thara Mirador Villas',
  'Tellapur, Hyderabad',
  '₹3.40 Cr Onwards',
  '4 & 5 BHK Villas',
  '3800 – 5200 sq.ft',
  'Ready to Move',
  'Villa',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
  true,
  array['Private Pool', 'Landscaped Garden', 'Home Automation', 'Servant Quarters'],
  'A gated enclave of 42 architect-designed villas — each home opens to a private pool, double-height living rooms, and quiet courtyards framed in travertine and oak.'
),
(
  'thara-aurum-towers',
  'Thara Aurum Towers',
  'Financial District, Hyderabad',
  '₹2.10 Cr Onwards',
  '3 BHK & Penthouses',
  '2100 – 4800 sq.ft',
  'Under Construction',
  'Penthouse',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
  true,
  array['Sky Deck', 'Concierge', 'Spa & Salon', 'Co-working Lounge'],
  'A 38-storey landmark with curated penthouses on the upper tiers. Floor-to-ceiling glass frames the entire Hyderabad skyline from your living room.'
),
(
  'thara-celeste',
  'Thara Celeste',
  'Gachibowli, Hyderabad',
  '₹95 L Onwards',
  '2 & 3 BHK',
  '1180 – 1720 sq.ft',
  'Ready to Move',
  'Apartment',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
  false,
  array['Rooftop Garden', 'Yoga Pavilion', 'Kids'' Play Area', 'Smart Homes'],
  'Thoughtfully designed homes for the new generation of urban families — close to IT hubs, international schools and the city''s best dining.'
);

insert into public.careers (title, department, location, type, active) values
('Senior Architect', 'Design', 'Hyderabad', 'Full-time', true),
('Sales Manager — Luxury', 'Sales', 'Hyderabad', 'Full-time', true),
('Project Engineer', 'Construction', 'Hyderabad', 'Full-time', false);
