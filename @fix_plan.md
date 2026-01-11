# Task Plan & Priority Queue

Comprehensive refactoring for Botsmann - improve maintainability, performance, and code quality.

## Status: IN PROGRESS

---

## P0 - Analysis & Planning (COMPLETED)

- [x] Audit all components for size (identify >200 line files)
- [x] Identify repeated code patterns across codebase
- [x] Document current architecture pain points
- [x] Create refactoring priority list

### Findings Summary

**Large Components (>200 lines):**
1. CitizenProfile.tsx (650 lines) - Needs split into types + smaller components
2. WorkspaceDashboard.tsx (642 lines) - Complex demo, needs extraction
3. ExampleSection.tsx (515 lines) - Large example showcase
4. DemoSection.tsx (503 lines) - Demo orchestration
5. AICaseAnalysis.tsx (441 lines) - Analysis component
6. 30+ more files over 200 lines

**Bot Page Duplication:**
- All 5 bot pages share identical boilerplate (~60 lines each)
- Same pattern: imports, getTryLink(), menuItems, BotNavigation, section structure
- CSS animations duplicated across styles.css files
- Inconsistent main container padding patterns
- Different error message styling

---

## P1 - Bot Page Deduplication (IN PROGRESS)

- [ ] Create `components/shared/BotPageTemplate.tsx` - Generic page template
- [ ] Create `components/shared/BotSection.tsx` - Section wrapper
- [ ] Create `components/shared/BotNotFoundFallback.tsx` - Error component
- [ ] Add `menuItems` to `data/bots.ts` - Centralize configuration
- [ ] Refactor all 5 bot pages to use new template
- [ ] Consolidate shared CSS into `styles/bot-pages.css`

**Expected Impact:** ~300 LOC saved, faster new bot creation

---

## P2 - Large Component Breakdown

- [ ] Split CitizenProfile.tsx:
  - Extract types to `types/citizen.ts`
  - Create CitizenOverviewTab.tsx
  - Create CitizenTaxTab.tsx
  - Create CitizenBenefitsTab.tsx
  - Create CitizenAdvisoryTab.tsx

- [ ] Split WorkspaceDashboard.tsx into smaller components
- [ ] Split ExampleSection.tsx into example cards
- [ ] Review and split other >300 line components

---

## P3 - Code Deduplication (DRY)

- [ ] Consolidate repeated utility functions into `lib/`
- [ ] Create shared hooks for common patterns (`hooks/`)
- [ ] Centralize API call patterns
- [ ] Extract constants to `lib/constants.ts`

---

## P4 - Architecture Improvements

- [ ] Fix blog dynamic server usage errors (no-store fetch issue)
- [ ] Separate UI components from container/logic components
- [ ] Improve data fetching patterns (server components where appropriate)
- [ ] Review and optimize file organization

---

## P5 - Performance Optimization

- [ ] Add React.memo to expensive pure components
- [ ] Implement useMemo/useCallback where beneficial
- [ ] Audit and optimize image loading
- [ ] Review bundle size and code splitting opportunities

---

## P6 - Verification

- [ ] Run full test suite (`npm run test`)
- [ ] Lint check (`npm run lint`)
- [ ] Build verification (`npm run build`)
- [ ] Manual smoke test of key features

---

## Completed Tasks

- [x] Previous task: Fixed all TypeScript errors and lint warnings (2026-01-11)
- [x] Ralph setup for refactoring task (2026-01-11)
- [x] Deployed to Vercel (2026-01-11) - https://botsmann-orangecat.vercel.app
- [x] Codebase audit completed (2026-01-11)

---

## Notes

- Follow `docs/BEST_PRACTICES.md` for coding standards
- Maintain backward compatibility
- No breaking changes to API routes
- Test after each significant refactor
