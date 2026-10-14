# ayoayo.ph

ayoayo.ph is a Cebu tech-repair directory that helps people find local shops for laptop, phone, computer, gaming PC, electronics, and other device repairs.

The public MVP includes:

- Service and municipality search
- Interactive municipality filtering on the homepage
- Service/location SEO pages, such as `/cebu/laptop-repair`
- Business profile pages, such as `/business/cebu-laptop-lab`
- Responsive listing cards with service-specific placeholder images
- Metadata, canonical URLs, sitemap, and robots rules

The UI uses Supabase listings when the Supabase environment variables are configured, and falls back to the starter listings in `src/lib/data.ts` for local UI work. The admin dashboard is available at `/admin` and is intentionally not linked from the public site.

## Run locally

Requirements: Node.js and pnpm.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` when running the site with a custom or production URL.

## Admin dashboard

Apply `supabase/schema.sql`, set the public Supabase URL/publishable key plus a server-only `SUPABASE_SERVICE_ROLE_KEY`, then seed the administrator with:

```bash
ADMIN_PASSWORD='use-a-strong-password' pnpm db:seed-admin
```

This creates or updates the `admin@ayoayo.ph` Supabase Auth user and its `admin_users` record. Sign in at `/admin`; no public navigation link is provided. The dashboard supports adding, editing, publishing, unpublishing, flagging, featuring, verifying, and removing shops, including contacts, social links, services, hours, coordinates, and all listing text.

## Useful commands

```bash
pnpm dev          # Start the development server
pnpm build        # Create the production build
pnpm start        # Serve the production build
pnpm lint         # Run ESLint
pnpm format       # Format files with Prettier
pnpm format:check # Check formatting without changing files
```

## Project structure

- `src/app/` — App Router pages, layouts, SEO routes, sitemap, and robots rules
- `src/components/` — Shared UI components
- `src/lib/` — Types and starter directory data
- `public/` — Logos, icons, and generic listing images
- `supabase/schema.sql` — Database schema for the future directory backend
