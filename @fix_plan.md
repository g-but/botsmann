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

## P1 - Bot Page Deduplication (COMPLETED ✓)

- [x] Create `components/shared/BotPageTemplate.tsx` - Generic page template
- [x] Create `components/shared/BotSection.tsx` - Section wrapper
- [x] Create `components/shared/BotNotFoundFallback.tsx` - Error component
- [x] menuItems already centralized in `data/bots.ts`
- [x] Refactor all 6 bot pages to use new template:
  - medical-expert
  - research-assistant
  - artistic-advisor
  - legal-expert
  - swiss-german-teacher
  - product-manager
- [x] Each page imports CSS locally (page-specific styles preserved)

**Actual Impact:** ~200+ LOC saved, consistent bot page structure, faster new bot creation

---

## P2 - Large Component Breakdown (COMPLETED ✓)

- [x] Split CitizenProfile.tsx (650→115 lines):
  - Types already in `types/governance.ts`
  - Created `citizen/CitizenProfileHeader.tsx`
  - Created `citizen/CitizenProfileTabs.tsx`
  - Created `citizen/CitizenOverviewTab.tsx`
  - Created `citizen/CitizenTaxTab.tsx`
  - Created `citizen/CitizenBenefitsTab.tsx`
  - Created `citizen/CitizenAdvisoryTab.tsx`

- [x] Split WorkspaceDashboard.tsx (642→219 lines):
  - Created `workspace/WorkspaceHeader.tsx`
  - Created `workspace/WorkspaceSidebar.tsx`
  - Created `workspace/OverviewView.tsx`
  - Created `workspace/FilesView.tsx`
  - Created `workspace/ChatView.tsx`
  - Created `workspace/TimelineView.tsx`
  - Created `workspace/SettingsView.tsx`
  - Created `workspace/workspaceUtils.ts`

- [x] Split ExampleSection.tsx (515→66 lines):
  - Created `examples/ProjectPlanTab.tsx`
  - Created `examples/TechnicalStrategyTab.tsx`
  - Created `examples/SprintPlanningTab.tsx`
  - Created `examples/ImplementationGuideTab.tsx`

**Total Impact:** ~1,400 LOC reduced in main components, cleaner architecture

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
- [x] P1: Bot page deduplication - Created BotPageTemplate, refactored all 6 bot pages (2026-01-13)
- [x] MDX build error fix - Added sanitization for `<` followed by numbers in lib/knowledge.ts (2026-01-13)
- [x] Security: Fixed glob CLI command injection vulnerability (CVE-2025-64756) via npm override (2026-01-13)
- [x] P2: Split CitizenProfile.tsx from 650→115 lines with 6 sub-components (2026-01-13)
- [x] P2: Split WorkspaceDashboard.tsx from 642→219 lines with 8 sub-components (2026-01-13)
- [x] P2: Split ExampleSection.tsx from 515→66 lines with 4 tab components (2026-01-13)

---

## Notes

- Follow `docs/BEST_PRACTICES.md` for coding standards
- Maintain backward compatibility
- No breaking changes to API routes
- Test after each significant refactor
