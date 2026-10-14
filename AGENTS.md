# Repository Guidelines

## Project Structure & Module Organization

This repository contains the public MVP for ayoayo.ph, a Cebu tech-repair directory.

- `src/app/`: Next.js App Router pages, layouts, SEO routes, sitemap, and robots rules.
- `src/components/`: Reusable UI components such as search forms and business cards.
- `src/lib/`: Types and the current starter directory dataset.
- `supabase/schema.sql`: Database schema for categories, services, locations, businesses, reports, and analytics.
- `public/`: Static assets (add this directory when public images or icons are introduced).
- `.env.example`: Required environment variable template.

## Build, Test, and Development Commands

Run these commands from the repository root:

```bash
pnpm install       # Install dependencies
pnpm dev           # Start the local Next.js development server
pnpm lint          # Run Next.js ESLint checks
pnpm build         # Create and type-check the production build
pnpm start         # Serve the production build locally
```

There is currently no automated test suite. At minimum, run `pnpm lint` and `pnpm build` before submitting changes.

## Coding Style & Naming Conventions

Use TypeScript and React server components by default. Use two-space indentation, double quotes, semicolons, and strict typing consistent with the existing files. Name components in PascalCase (`BusinessCard`), utilities in camelCase (`getBusinessesFor`), and URL slugs in lowercase kebab-case (`laptop-repair`). Keep SEO metadata and route logic close to the page that owns it. Use Tailwind utility classes for styling and the shared classes in `src/app/globals.css` for repeated patterns.

## Testing Guidelines

No test framework or coverage threshold is configured yet. When adding tests, place them near the related module or under a future `src/**/__tests__/` directory, and use descriptive names such as `searchBusinesses.test.ts`. New search, filtering, and routing behavior should include tests when the test setup is introduced.

## Commit & Pull Request Guidelines

No usable Git history is available in this workspace, so no existing commit convention can be verified. Use concise imperative messages, preferably Conventional Commit style (for example, `feat: add Cebu location filter`). Pull requests should describe the user-facing change, list validation commands, note schema or environment changes, and include screenshots for visual changes.

## Security & Configuration

Never commit `.env.local`, Supabase secrets, or real private business data. Keep public Supabase access protected with Row Level Security. Replace the demo records in `src/lib/data.ts` with verified listings before production launch.
