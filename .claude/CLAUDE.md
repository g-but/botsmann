# Botsmann Project Guide for Claude

**Location**: `.claude/CLAUDE.md` - Claude Code automatically loads this for project context.

---

## Project Overview

**Botsmann** is a modern AI bot platform featuring intelligent assistants for legal, medical, research, and language learning. Built with Next.js 14, deployed on Vercel.

**See SSOT files for details:**
- **Best Practices**: `docs/BEST_PRACTICES.md` (DRY, SSOT, SoC principles)
- **Tech Stack**: `docs/SHARED_CONTEXT.md` (architecture, database, file structure)
- **Commands**: `docs/COMMANDS.md` (all npm scripts)

---

## Quick Start

```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm run lint         # ESLint check
npm run test         # Run Jest tests
```

**Full command reference**: See `docs/COMMANDS.md`

---

## Critical Rules

### 1. Code Quality Standards

**Always use:**
- TypeScript with proper types - minimize `any` usage
- Zod for runtime validation (`import { z } from 'zod'`)
- Centralized constants - NOT hardcoded strings
- `async/await` - NOT `.then()` chains
- Named exports - NOT default exports (except pages)

**Never:**
- `console.log` in production code (use proper error handling)
- Hardcoded API keys or secrets
- `any` type without justification
- Inline styles (use Tailwind classes)

### 2. File Organization

```
app/                  # Next.js App Router pages
  api/                # API routes
  bots/               # Bot-specific pages
components/           # Shared UI components
lib/                  # Utilities and helpers
types/                # TypeScript type definitions
data/                 # Static data and configuration
```

### 3. Component Pattern

```typescript
// components/ExampleComponent.tsx
import { type FC } from 'react';

interface ExampleComponentProps {
  title: string;
  onAction?: () => void;
}

export const ExampleComponent: FC<ExampleComponentProps> = ({
  title,
  onAction
}) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {onAction && (
        <button onClick={onAction} className="btn btn-primary">
          Action
        </button>
      )}
    </div>
  );
};
```

### 4. API Route Pattern

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const RequestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = RequestSchema.parse(body);

    // Process request...

    return NextResponse.json({ success: true, data: validated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## Pre-Flight Checklist

Before ANY task:
- [ ] Search codebase for existing similar functionality
- [ ] Check `docs/BEST_PRACTICES.md` for coding standards
- [ ] Run `npm run lint` before committing
- [ ] Run `npm run build` to verify no type errors
- [ ] Add proper TypeScript types
- [ ] Use Zod validation for API inputs

---

## Key Documentation

| Document | Purpose |
|----------|---------|
| `docs/BEST_PRACTICES.md` | DRY, SSOT, SoC principles |
| `docs/SHARED_CONTEXT.md` | Tech stack, architecture |
| `docs/COMMANDS.md` | npm scripts reference |
| `AGENTS.md` | OpenAI Codex instructions |
| `README.md` | Project overview |

---

**Last Updated**: 2026-01-07
