# Ralph Autonomous Task Prompt

## Current Task

Fix all TypeScript errors and ESLint warnings in Botsmann to achieve a clean build.

## Context

- **Project**: Botsmann - AI Bot Suite
- **Tech Stack**: Next.js 14, React, TypeScript, TailwindCSS, MongoDB
- **Key Docs**: See `CLAUDE.md` and `ARCHITECTURE.md`

## Task Requirements

1. Fix all TypeScript errors (17 errors blocking build)
2. Fix all ESLint warnings (17 warnings)
3. Ensure build succeeds

## Success Criteria

- [ ] Type check passes (`npx tsc --noEmit`)
- [ ] Lint passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] No `any` types - replaced with proper types
- [ ] All `<img>` replaced with `<Image />` from next/image

## Constraints

- Use SSOT: `data/bots.ts`, `types/`
- Use Zod for validation (`src/lib/schemas/`)
- No `any` types - use proper types or `unknown`
- Tailwind classes only (no inline styles)

## Completion Signal

When ALL success criteria are met, output exactly:

```
<promise>TASK_COMPLETE</promise>
```

## Current Progress

Check `@fix_plan.md` for task breakdown and progress tracking.
