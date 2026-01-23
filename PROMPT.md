# Ralph Autonomous Task Prompt

## Current Task

Fix MDX build error and complete bot page deduplication refactoring.

## Context

- **Project**: Botsmann - AI Bot Suite
- **Tech Stack**: Next.js 14, React, TypeScript, TailwindCSS
- **Key Docs**: See `CLAUDE.md`, `docs/BEST_PRACTICES.md`

## Task Requirements

### 1. Fix MDX Build Error (Quick Win)

- Fix the MDX compilation error in `/knowledge/guides/production-deployment`
- Error: "Unexpected character `1` (U+0031) before name"
- Likely a syntax issue in the MDX file
- Verify build passes after fix

### 2. Bot Page Deduplication (P1)

- Create `components/shared/BotPageTemplate.tsx` - Generic page template
- Create `components/shared/BotSection.tsx` - Section wrapper component
- Verify `components/shared/BotNotFoundFallback.tsx` exists (may already exist)
- Refactor all 6 bot pages to use the new template:
  - `/bots/legal-expert`
  - `/bots/swiss-german-teacher`
  - `/bots/research-assistant`
  - `/bots/medical-expert`
  - `/bots/artistic-advisor`
  - `/bots/product-manager`
- Consolidate shared CSS patterns

### 3. Verification

- Run `npm run build` - must succeed
- Run `npm run lint` - must pass with 0 warnings
- Ensure all bot pages still render correctly

## Success Criteria

- [ ] MDX error in production-deployment guide is fixed
- [ ] Build succeeds (`npm run build`)
- [ ] No TypeScript errors
- [ ] Lint passes (`npm run lint`)
- [ ] BotPageTemplate component created and working
- [ ] At least 3 bot pages refactored to use template
- [ ] No visual/functional regressions

## Constraints

- Follow existing patterns in the codebase
- Maintain SSOT in `data/bots.ts`
- Use Headless UI for any interactive components
- No breaking changes to existing functionality
- Follow `docs/BEST_PRACTICES.md` (DRY, SSOT, SoC)

## Completion Signal

When ALL success criteria are met, output exactly:

```
RALPH_STATUS: DONE
```
