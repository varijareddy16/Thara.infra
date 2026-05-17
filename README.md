# Thara Infra — Premium Real Estate Web App

A luxury real estate web application for **Thara Infra**, showcasing landmark residences across Hyderabad.

---

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org) (App Router)
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **Backend:** [Supabase](https://supabase.com) (PostgreSQL, Auth, Storage)
- **State / Data Fetching:** TanStack Query
- **Forms:** React Hook Form + Zod
- **Deployment:** [Vercel](https://vercel.com)

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Find these in Supabase → **Settings → API**.

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Supabase setup

See [supabase/README.md](supabase/README.md) for schema, storage buckets, and admin user setup.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Run production build locally |
| `npm run lint` | Run ESLint |

---

## Deploy to Vercel

1. Push the repo to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy (framework preset: **Next.js**)

After deploy, add your Vercel URL to Supabase **Authentication → URL configuration**.

---

## Project Structure

```
src/
├── app/             # Next.js App Router pages
├── components/      # UI + layout components
├── views/           # Page content (client components)
├── lib/             # Supabase, auth, queries
├── hooks/
├── assets/
└── styles.css       # Tailwind v4 theme
supabase/            # SQL schema & setup docs
```

---

## License

Private — All rights reserved © Thara Infra.
