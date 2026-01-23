# AGENTS.md - Botsmann

> A README for AI coding agents. Works with Claude Code, Cursor, GitHub Copilot, OpenAI Codex, and other AI tools.

---

## Project Overview

**Botsmann** is an AI bot platform with intelligent assistants for legal, medical, research, and language learning domains.

| Aspect     | Details                                         |
| ---------- | ----------------------------------------------- |
| Framework  | Next.js 14 (App Router)                         |
| Language   | TypeScript                                      |
| Styling    | Tailwind CSS + DaisyUI                          |
| Database   | Supabase (Postgres + Storage)                   |
| Deployment | Vercel                                          |
| Testing    | Jest + React Testing Library + Playwright (e2e) |

---

## Dev Environment

```bash
# Install dependencies
npm ci

# Start development server
npm run dev

# Run linting and format check
npm run lint && npm run format:check

# Run tests
npm run test

# Production build
npm run build
```

**Required environment variables:** Copy `.env.example` to `.env.local` and fill in values (Supabase, API keys). Never commit `.env*` files.

See also: `docs/SSOT.md` for the single source of truth on where things live.

---

## Testing Instructions

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# E2E tests (headless Chromium)
npm run test:e2e
```

Tests live alongside components in `__tests__/` directories.

**Before committing:** Run `npm run lint && npm run build` to catch errors.

---

## Code Style Guidelines

### TypeScript

- Use strict typing, minimize `any`
- Prefer interfaces over type aliases for objects
- Use `type` for unions and intersections

### React Components

- Functional components with hooks only
- Named exports (except page components)
- Props interface above component

### File Naming

- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Types: `camelCase.types.ts`

### Imports Order

1. React/Next.js imports
2. Third-party libraries
3. Local components
4. Local utilities
5. Types
6. Styles

---

## Project Structure

```
botsmann/
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   │   ├── consultations/  # Consultation endpoints
│   │   ├── health/         # Health check
│   │   └── waitlist/       # Waitlist signup
│   ├── bots/               # Bot pages
│   │   ├── legal-expert/
│   │   ├── medical-expert/
│   │   ├── research-assistant/
│   │   └── swiss-german-teacher/
│   ├── about/
│   ├── contact/
│   └── solutions/
├── components/             # Shared UI components (Header, Footer, Navigation, shared/*)
├── lib/                    # Utility functions
├── types/                  # TypeScript definitions
├── data/                   # Static data (bot configs)
├── public/                 # Static assets
└── docs/                   # Documentation (best practices, guides)
    ├── BEST_PRACTICES.md   # Coding principles
    ├── SHARED_CONTEXT.md   # Tech stack details
    └── COMMANDS.md         # npm scripts
```

---

## PR Guidelines

### Commit Message Format

```
type(scope): description

type: feat|fix|chore|docs|style|refactor|test
scope: component or area affected
```

Examples:

- `feat(bots): add new Swiss legal expert bot`
- `fix(api): handle empty request body`
- `chore(deps): update Next.js to 14.1`

### Pre-commit Checklist

- [ ] `npm run lint` passes
- [ ] `npm run format:check` passes
- [ ] `npm run build` succeeds
- [ ] Tests pass (if applicable)
- [ ] No hardcoded secrets

---

## Security Considerations

- **Never** commit `.env*` files
- **Always** validate API inputs with Zod
- **Use** environment variables for secrets
- **Check** for exposed credentials before pushing

---

## Key Files

| File                     | Purpose                   |
| ------------------------ | ------------------------- |
| `.claude/CLAUDE.md`      | Claude Code instructions  |
| `docs/BEST_PRACTICES.md` | DRY, SSOT, SoC principles |
| `docs/SHARED_CONTEXT.md` | Architecture details      |
| `docs/COMMANDS.md`       | npm script reference      |
| `data/bots.ts`           | Bot configurations        |

---

## Common Tasks

### Adding a New Bot

1. Create directory: `app/bots/[bot-name]/`
2. Add `page.tsx` with bot UI
3. Register in `data/bots.ts`
4. Add API route if needed: `app/api/[bot-name]/`

### Adding an API Route

1. Create file: `app/api/[route]/route.ts`
2. Export HTTP method handlers (GET, POST, etc.)
3. Use Zod for request validation
4. Return `NextResponse.json()`

---

## Supabase Migrations

- Location: `supabase/migrations/*.sql`
- Apply (SQL API): Use Supabase SQL editor or `bash scripts/deployment/apply-supabase-migrations.sh` with `SUPABASE_ACCESS_TOKEN` + `SUPABASE_PROJECT_REF`.
- Apply (psql): Set `SUPABASE_DB_URL` and run `bash scripts/deployment/apply-migrations-psql.sh`.
- Included: `20260117_user_settings.sql` (creates `user_settings` with RLS policies).

Checklist:

- Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.
- Ensure RLS is enabled and policies exist for sensitive tables.

---

## UI/UX & Performance Tips

- Reuse shared components (PageHeader, Section, StatCard, Prose) for consistency.
- Accessibility: correct heading hierarchy, visible focus, sufficient contrast.
- Use `next/image` where possible; keep heavy background effects light on content pages.
- Avoid heavy imports at module scope (e.g., `@xenova/transformers`); dynamically import inside functions.
- Mark static pages with `export const dynamic = 'force-static'` and set `revalidate`.

**Last Updated:** 2026-01-07
