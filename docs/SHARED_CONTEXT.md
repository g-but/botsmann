# Shared Context - Botsmann Architecture

This document provides comprehensive technical context for the Botsmann project.

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.x | React framework (App Router) |
| React | 18.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Utility-first styling |
| DaisyUI | 5.x | Component library |
| Framer Motion | 12.x | Animations |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js API Routes | - | Serverless functions |
| MongoDB | 6.x | Database |
| Mongoose | 8.x | ODM |
| Zod | 3.x | Schema validation |

### Infrastructure

| Service | Purpose |
|---------|---------|
| Vercel | Hosting & deployment |
| MongoDB Atlas | Database hosting |
| AWS SES | Email delivery |
| SendGrid | Backup email |
| Mailgun | Backup email |

### Development Tools

| Tool | Purpose |
|------|---------|
| Jest | Unit testing |
| React Testing Library | Component testing |
| ESLint | Code linting |
| Prettier | Code formatting |

---

## Project Structure

```
botsmann/
├── .claude/                # Claude Code configuration
│   └── CLAUDE.md           # Claude-specific instructions
├── .github/                # GitHub configuration
│   ├── workflows/          # CI/CD workflows
│   └── dependabot.yml      # Dependency updates
├── app/                    # Next.js App Router
│   ├── api/                # API routes (serverless)
│   │   ├── consultations/  # Consultation booking
│   │   ├── health/         # Health check endpoint
│   │   ├── products/       # Product data
│   │   ├── rebuild/        # Cache rebuild
│   │   └── waitlist/       # Waitlist signup
│   ├── bots/               # Bot pages
│   │   ├── [slug]/         # Dynamic bot routing
│   │   ├── legal-expert/   # Lex - Legal assistant
│   │   ├── medical-expert/ # Imhotep - Medical advisor
│   │   ├── research-assistant/ # Nerd - Research helper
│   │   └── swiss-german-teacher/ # Swiss German tutor
│   ├── about/              # About page
│   ├── blog/               # Blog section
│   ├── contact/            # Contact form
│   ├── projects/           # Projects showcase
│   ├── solutions/          # Business solutions
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/             # Shared UI components
│   ├── blog/               # Blog components
│   ├── CollaborationForm.tsx
│   ├── ConsultationForm.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── MegaMenu.tsx
│   ├── Navigation.tsx
│   ├── SolutionLayout.tsx
│   └── TableOfContents.tsx
├── data/                   # Static data & configuration
│   └── bots.ts             # Bot configurations (SSOT)
├── docs/                   # Documentation
│   ├── BEST_PRACTICES.md   # Coding principles
│   ├── COMMANDS.md         # npm scripts
│   └── SHARED_CONTEXT.md   # This file
├── lib/                    # Utilities & helpers
├── public/                 # Static assets
│   └── images/             # Image files
├── src/                    # Additional source (legacy)
│   ├── components/         # Bot-specific components
│   └── lib/                # Additional utilities
├── tests/                  # Test files
├── types/                  # TypeScript definitions
├── AGENTS.md               # AI agent instructions
├── README.md               # Project overview
├── SECURITY.md             # Security policy
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies & scripts
```

---

## Architecture Decisions

### App Router (Next.js 14)

We use the App Router for:
- Server Components by default (better performance)
- Nested layouts
- Built-in loading/error states
- Simplified data fetching

### MongoDB with Mongoose

Chosen for:
- Flexible schema for diverse bot data
- Easy scaling with MongoDB Atlas
- Good TypeScript support via Mongoose

### Serverless API Routes

All backend logic runs in Vercel serverless functions:
- No server to maintain
- Auto-scaling
- Pay-per-use

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `API_KEY` | Yes | Internal API authentication |
| `NEXT_PUBLIC_API_KEY` | Yes | Client-side API key |
| `NEXT_AWS_ACCESS_KEY_ID` | No | AWS SES access key |
| `NEXT_AWS_SECRET_ACCESS_KEY` | No | AWS SES secret |
| `NEXT_AWS_REGION` | No | AWS region |
| `FROM_EMAIL` | No | Sender email address |
| `ADMIN_EMAIL` | No | Admin notification email |

**Setup:** Copy `.env.example` to `.env` and fill in values.

---

## Data Flow

### Bot Page Request
```
Browser → app/bots/[slug]/page.tsx
                ↓
        data/bots.ts (config lookup)
                ↓
        components/* (UI rendering)
                ↓
        Response HTML
```

### API Request
```
Client → app/api/[route]/route.ts
                ↓
        Zod validation
                ↓
        MongoDB (if needed)
                ↓
        JSON response
```

### Form Submission
```
User → components/*Form.tsx
                ↓
        react-hook-form + Zod
                ↓
        app/api/[endpoint]/route.ts
                ↓
        MongoDB + Email service
                ↓
        Success/Error response
```

---

## Key Files Reference

| File | Purpose | When to Modify |
|------|---------|----------------|
| `data/bots.ts` | Bot configurations | Adding/editing bots |
| `app/layout.tsx` | Root layout | Global UI changes |
| `components/Navigation.tsx` | Main nav | Adding pages |
| `tailwind.config.js` | Theme config | Styling changes |
| `types/*.ts` | Type definitions | Data structure changes |

---

## Deployment

### Automatic (Recommended)
Push to `main` branch → GitHub Actions → Vercel

### Manual
```bash
npm run build
vercel --prod
```

### Preview Deployments
Every PR gets a preview URL automatically.

---

## Performance Considerations

1. **Server Components**: Use by default, add `'use client'` only when needed
2. **Image Optimization**: Use `next/image` for all images
3. **Code Splitting**: Automatic with App Router
4. **Caching**: Vercel Edge caching for static content

---

## Known Limitations

1. **src/ directory**: Legacy structure, prefer `app/` for new code
2. **Multiple component directories**: Consolidation pending
3. **Email services**: Three providers configured (AWS SES, SendGrid, Mailgun) - needs cleanup

---

**Last Updated:** 2026-01-07
