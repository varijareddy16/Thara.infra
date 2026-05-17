# Supabase Setup — Thara Infra

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) → New project
2. Choose a region close to India (e.g. **ap-south-1 Mumbai**)
3. Save your database password

## 2. Run the Schema

1. Open **SQL Editor** in your Supabase dashboard
2. Paste the contents of `supabase/schema.sql`
3. Click **Run**

This creates all tables, enums, RLS policies, triggers, and seed data.

## 3. Create Storage Buckets

In **Storage** → **New bucket**, create these three buckets (all public):

| Bucket name       | Public |
|-------------------|--------|
| `property-images` | ✅     |
| `brochures`       | ✅     |
| `avatars`         | ✅     |

Then add storage policies (see commented section at the bottom of `schema.sql`).

## 4. Get Your API Keys

**Settings → API**:
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Add them to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

## 5. Create Your Admin User

1. **Authentication → Users → Invite user** (or use the signup form at `/login`)
2. After the user confirms their email, run this in the SQL Editor:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = '<paste-user-id-here>';
```

3. Now log in at `/admin/login` with that email and password.

## 6. Create Sales Executive Users

Same process — create the user, then:

```sql
UPDATE public.profiles
SET role = 'sales'
WHERE id = '<user-id>';
```

Sales users can view and update leads assigned to them.

## 7. Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project (Next.js)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy, then set your Vercel URL in Supabase Auth URL configuration

## Architecture Summary

```
Browser
  └── React (TanStack Router + TanStack Query)
        ├── Public pages  → Supabase anon key (read properties, submit leads)
        └── Admin pages   → Supabase auth session (full CRUD)

Supabase
  ├── PostgreSQL (properties, leads, careers, profiles, blogs, bookings)
  ├── Auth (email/password, sessions, JWT)
  ├── Storage (property-images, brochures, avatars)
  └── Row Level Security (enforces role-based access at DB level)
```

## User Roles

| Role       | Can do                                              |
|------------|-----------------------------------------------------|
| `customer` | Sign up, view properties, submit inquiries          |
| `sales`    | View & update assigned leads, view properties       |
| `admin`    | Full CRUD on properties, leads, careers, users      |
