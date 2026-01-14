# Botsmann Expertise Refresh Plan

**Created**: 2026-01-13
**Mission**: Transform botsmann.com to communicate serious AI assistant expertise with fresh, modern content and consistent design.

---

## Executive Summary

After auditing the entire site, I've identified three categories of issues:
1. **Stale/misleading content** that undermines credibility
2. **Design inconsistencies** across pages
3. **Missing expertise signals** that would establish authority

---

## Priority 1: Critical Credibility Issues (Fix First)

### 1.1 Remove Misleading Statistics
- **Location**: `app/page.tsx` (line 111)
- **Issue**: Shows "6+ AI Bots" but only 2 are actually live
- **Fix**: Change to "2 Live Bots" or remove the stat entirely
- **Impact**: High - visitors will quickly see the mismatch

### 1.2 Update Technology References
- **Location**: `app/knowledge/page.tsx` (line 43)
- **Issue**: "GPT-4 and Claude" is outdated - should reference current models
- **Fix**: Update to "Claude 3.5, GPT-4o, and other frontier models" or make generic "latest frontier LLMs"
- **Impact**: Medium - signals we stay current

### 1.3 Remove Time Estimates from FAQ
- **Location**: `app/knowledge/page.tsx` (lines 51-54)
- **Issue**: Says "2-4 weeks" for simple bots, "2-3 months" for enterprise
- **Fix**: Remove specific timelines, replace with "varies based on complexity"
- **Impact**: Medium - avoids setting unrealistic expectations

### 1.4 Fix Broken/Generic Try Links
- **Location**: `data/bots.ts`
- **Issue**: `research-assistant` has generic ChatGPT link, others may be broken
- **Fix**: Either create actual GPTs or remove try links for non-live bots
- **Impact**: High - broken links destroy credibility

---

## Priority 2: Design Consistency (Fix Second)

### 2.1 Unify Color Schemes Across Pages
| Page | Current Colors | Target |
|------|---------------|--------|
| Homepage | Blue/Purple gradients | Keep as primary |
| About | Plain white/gray | Add subtle blue gradients |
| Knowledge | Emerald/Teal | Change to Blue/Purple |
| Contact | Unknown | Align with homepage |

### 2.2 Standardize Page Layouts
- **About page** (`app/about/page.tsx`): Currently plain prose layout
- **Fix**: Add hero section, background effects to match homepage
- **Impact**: Medium - creates visual unity

### 2.3 Consolidate Bot Card Styles
- Homepage featured bots vs /bots page cards have different designs
- **Fix**: Create single `BotCard` component used everywhere
- **Impact**: Low - mostly aesthetic

---

## Priority 3: Add Expertise Signals (High Value)

### 3.1 Add Founder/Team Section
- **Location**: New section on About page or dedicated `/team` page
- **Content needed**:
  - Founder bio with AI/tech credentials
  - Years of experience in AI/ML
  - Notable projects or companies worked with
- **Impact**: Very High - people want to know who's behind the product

### 3.2 Add Case Studies Section
- **Location**: New `/case-studies` page linked from homepage
- **Content needed**:
  - 2-3 detailed project examples
  - Problem, solution, results format
  - Specific technologies used
  - Metrics if available
- **Impact**: Very High - proves real expertise

### 3.3 Add Technology Stack Details
- **Location**: New section on homepage or dedicated page
- **Show expertise with**:
  - Specific frameworks (LangChain, LlamaIndex, etc.)
  - Vector databases used (Pinecone, Weaviate, etc.)
  - Cloud infrastructure (Vercel, AWS, etc.)
  - Security certifications pursued
- **Impact**: High - technical credibility

### 3.4 Add Real Testimonials
- **Location**: Replace placeholder testimonials in bot pages
- **Current state**: `legal-expert/components/testimonials/` has generic content
- **Fix**: Add real testimonials or remove section entirely
- **Impact**: High - fake testimonials hurt more than none

### 3.5 Create Technical Blog Content
- **Location**: `/blog` (if exists) or create new
- **Content ideas**:
  - "How we built Lex: Architecture deep dive"
  - "RAG best practices from building Heidi"
  - "LLM evaluation strategies for domain-specific bots"
- **Impact**: Very High - thought leadership establishes expertise

---

## Priority 4: Content Freshness (Polish)

### 4.1 Update About Page
- Current content is generic "transparency and automation" philosophy
- Needs: Specific AI bot building expertise, methodology, differentiation
- Add: Specific approach to building AI assistants

### 4.2 Make Knowledge Guides Real
- Current guides link to `/knowledge/guides/*` pages
- **Check**: Do these pages exist? If not, either create them or remove links
- **Impact**: Medium - broken internal links hurt SEO and trust

### 4.3 Refresh Bot Descriptions
- Some bot descriptions are generic
- Add specific capabilities, integrations, use cases

---

## Implementation Phases

### Phase A: Credibility Fixes (1-2 iterations)
1. Fix "6+ bots" stat
2. Update technology references
3. Remove time estimates
4. Fix/remove broken try links

### Phase B: Design Unification (2-3 iterations)
1. Update About page design
2. Update Knowledge page colors
3. Standardize card components

### Phase C: Expertise Content (3-5 iterations)
1. Add founder/team section
2. Create case studies page
3. Add tech stack section
4. Update testimonials or remove

### Phase D: Content Refresh (2-3 iterations)
1. Rewrite About page
2. Create or remove knowledge guides
3. Refresh bot descriptions

---

## Files to Modify

**Priority 1 (Critical)**:
- `app/page.tsx` - Fix stats, possibly add tech stack section
- `app/knowledge/page.tsx` - Update FAQ, fix tech references
- `data/bots.ts` - Fix try links

**Priority 2 (Design)**:
- `app/about/page.tsx` - Major redesign
- `app/knowledge/page.tsx` - Color scheme update
- `app/globals.css` - Possibly add shared styles

**Priority 3 (New Content)**:
- Create `app/case-studies/page.tsx`
- Create `app/team/page.tsx` or add section to About
- Update `app/bots/legal-expert/components/testimonials/`

---

## Success Criteria

When complete, the site should:
1. Show only accurate statistics (live bots count)
2. Reference current AI technology (2025-2026 models)
3. Have consistent blue/purple color scheme across all pages
4. Display real founder/team credentials
5. Include at least one detailed case study
6. Show specific technology stack used
7. Have either real testimonials or no testimonials section
8. All internal links should work

---

## Next Step

Begin with **Phase A: Credibility Fixes** - start by fixing the "6+ AI Bots" stat on the homepage.
