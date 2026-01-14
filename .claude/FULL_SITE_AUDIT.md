# Botsmann Full Site Audit

**Date**: 2026-01-13
**Auditor**: Claude (Ralph Loop P10)

---

## Executive Summary: What's Actually Broken

The site is essentially a **polished demo/portfolio** with very little functional backend. Most "features" are either:
1. Simulated with `setTimeout()` delays
2. Dependent on missing environment variables
3. Pointing to external services that don't exist
4. Writing to local JSON files (won't work in production)

---

## 🚨 CRITICAL: Non-Functional Components

### 1. Bot Try Links (NONE WORK)

| Bot | Try Link | Status |
|-----|----------|--------|
| Heidi (swiss-german-teacher) | `https://chatgpt.com/g/g-rni41WTSh-heidi-tell` | ❌ Likely invalid GPT ID |
| Nerd (research-assistant) | `https://chatgpt.com/g/research-assistant` | ❌ Invalid URL format |
| Imhotep (medical-expert) | No tryLink defined | ❌ Falls back to generic ChatGPT |
| Lex (legal-expert) | No tryLink defined | ❌ Falls back to generic ChatGPT |
| Muse (artistic-advisor) | No tryLink defined | ❌ Falls back to generic ChatGPT |
| Trident (product-manager) | No tryLink defined | ❌ Falls back to generic ChatGPT |

**Fallback behavior** (`lib/bots.ts:212`): Returns `https://chat.openai.com/` - useless generic link.

### 2. ConsultationForm (`components/ConsultationForm.tsx`)

**Status**: FAKE - Does nothing

```typescript
// Line 20-26 - Just simulates a delay, doesn't actually submit
const onSubmit = async (_data: FormData) => {
  // Simulate a successful submission for now
  await new Promise(resolve => setTimeout(resolve, 1000));
  reset();
  setSubmitSuccess(true);
```

- **What it claims**: "Submit consultation request"
- **What it does**: Shows success message after 1 second delay
- **Data goes nowhere**: Not stored, not emailed, not logged

### 3. Consultations API (`app/api/consultations/route.ts`)

**Status**: BROKEN - Missing infrastructure

Dependencies that don't exist or aren't configured:
- `MONGODB_URI` environment variable (not set in .env)
- `AWS SES credentials` for email (not configured)
- API key validation middleware

**Even if called**, would return 503 (database connection error).

### 4. Products Search API (`app/api/products/search/route.ts`)

**Status**: FAKE + BROKEN

- **NLP processing** (`lib/nlp.ts`): Requires `OPENAI_API_KEY` - not configured
- **Amazon search** (`lib/platforms/amazon.ts`): Returns hardcoded mock data
- **Ricardo search** (`lib/platforms/ricardo.ts`): Returns hardcoded mock data

This entire feature has no real implementation - just returns fake products.

### 5. Waitlist API (`app/api/waitlist/route.ts`)

**Status**: PARTIALLY WORKS (local only)

- Writes to `data/waitlist.json` (empty array)
- **Problem**: File system writes won't work on Vercel serverless
- **Problem**: No duplicate checking works because file might not persist

### 6. Knowledge Guides (`app/knowledge/guides/`)

**Status**: EXTERNAL DEPENDENCY - Likely empty

Content is fetched from:
```
https://github.com/g-but/botsmann-knowledge-content
```

**Questions**:
- Does this repository exist?
- Does it have any published guides?
- If not, the entire Knowledge Center shows nothing

---

## ⚠️ MISLEADING: Content That Overpromises

### 1. Homepage Stats (`app/page.tsx:111-124`)

```jsx
<div className="text-3xl font-bold text-blue-600 mb-2">6+</div>
<div className="text-gray-600 font-medium">AI Bots</div>
```

**Reality**: 0 bots actually work. All try links are broken.

### 2. "How It Works" Section

Claims:
1. "Choose Your Bot"
2. "Start Interacting"
3. "Get Results"

**Reality**: Can't interact with any bot - they don't exist.

### 3. Bot Pages "Live" Indicators

`app/bots/page.tsx:79`:
```typescript
const readyBots = ['swiss-german-teacher', 'legal-expert'];
```

Shows green "live" dots for these bots, but neither actually works.

### 4. Legal Expert Demo (`DemoOrchestrator.tsx`)

Shows a 4-step demo flow:
1. Case Intake ✅ (form works)
2. AI Analysis ⚠️ (simulated - no real AI)
3. Lawyer Match ❌ (placeholder: "This is where the lawyer matching component will go")
4. Workspace ❌ (placeholder: "This is where the workspace preview will show")

**Lines 136-157 are literally placeholder text admitting it's not built.**

### 5. Testimonials

The testimonials sections (legal-expert, product-manager) need inspection - likely fake.

---

## 🔧 PARTIALLY WORKING

### 1. Swiss German Teacher Waitlist Form

`app/bots/swiss-german-teacher/components/shared/WaitlistForm.tsx`

- Uses `useWaitlistForm` hook
- Posts to `/api/waitlist`
- **Works locally** but not in production (file system issue)

### 2. Knowledge Page FAQ

`app/knowledge/page.tsx`

- FAQ accordion works (client-side)
- Category filtering works (client-side)
- **But**: Links to `/knowledge/guides/*` which depends on external repo

### 3. Form Validation

Email validation and form handling work correctly in:
- `lib/validation.ts`
- Individual form components

---

## 🐛 CODE ISSUES

### 1. Unused Variables

`DemoOrchestrator.tsx:77`:
```typescript
const _isUpcoming = idx > currentStepIndex;
```
Prefixed with `_` to suppress warning - suggests incomplete implementation.

### 2. Hard Dependencies on Missing Services

The codebase assumes:
- MongoDB is configured (`MONGODB_URI`)
- AWS SES is configured (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`)
- OpenAI API is configured (`OPENAI_API_KEY`)
- GitHub repo exists (`g-but/botsmann-knowledge-content`)

None of these appear to be set up based on `.env.local`.

### 3. Environment File Issues

Current `.env.local` only contains:
```
NEXT_PUBLIC_API_KEY="development-key"
VERCEL_OIDC_TOKEN="..."
```

Missing required vars for any real functionality.

---

## 📊 SUMMARY TABLE

| Feature | Claimed | Actual Status |
|---------|---------|---------------|
| Heidi Bot | Live | ❌ Broken link |
| Lex Bot | Live | ❌ No real AI |
| Other Bots | Coming Soon | ❌ No try links |
| Consultation Form | Submit inquiry | ❌ Fake (setTimeout) |
| Waitlist | Join waitlist | ⚠️ Local only |
| Knowledge Guides | Learn to build bots | ❓ External dependency |
| Product Search | Search products | ❌ Mock data only |
| Email System | Send notifications | ❌ Not configured |
| Database | Store data | ❌ Not configured |

---

## WHAT NEEDS TO HAPPEN

### Option A: Make It Real
1. Create actual GPTs for each bot with working links
2. Set up MongoDB Atlas for data storage
3. Configure AWS SES or alternative email service
4. Create actual knowledge content in GitHub repo
5. Implement real product search or remove feature
6. Connect ConsultationForm to actual API

### Option B: Make It Honest (Minimum Viable)
1. Remove all "Live" indicators
2. Label everything as "Demo" or "Coming Soon"
3. Remove fake try links (don't link to generic ChatGPT)
4. Remove broken APIs entirely
5. Make demos clearly simulated
6. Focus on waitlist collection only

### Option C: Rebuild as Portfolio
1. Accept this is a portfolio/showcase site
2. Rewrite all copy to be forward-looking ("We're building...")
3. Remove all functional claims
4. Focus on demonstrating design/UX skills
5. Be transparent about development stage

---

## NEXT STEPS FOR RALPH

1. **Immediate**: Fix the most misleading content (stats, live indicators)
2. **Short-term**: Remove or fix broken try links
3. **Medium-term**: Decide on strategy (Option A, B, or C)
4. **Long-term**: Implement chosen strategy

---

## Files That Need Changes

### Must Fix (Misleading):
- `app/page.tsx` - Remove "6+ AI Bots" stat
- `app/bots/page.tsx` - Remove "readyBots" array or fix it
- `data/bots.ts` - Fix or remove tryLinks

### Should Fix (Broken):
- `components/ConsultationForm.tsx` - Either connect to real API or clearly label as demo
- `app/api/consultations/route.ts` - Either configure infrastructure or remove
- `app/api/products/search/route.ts` - Remove entirely (unused, broken)

### Can Wait (Enhancements):
- Knowledge content (depends on external repo)
- Email system (needs AWS setup)
- Database (needs MongoDB setup)
