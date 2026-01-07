# Commands Reference

All npm scripts available in the Botsmann project.

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |

---

## Development

### Start Dev Server
```bash
npm run dev
```
Starts Next.js development server on `http://localhost:3000` with:
- Hot Module Replacement (HMR)
- Fast Refresh
- Error overlay

### Run Linting
```bash
npm run lint
```
Runs ESLint to check for code quality issues.

---

## Building

### Production Build
```bash
npm run build
```
Creates optimized production build in `.next/` directory.

### CI Build
```bash
npm run build:ci
```
Runs `npm ci` (clean install) then builds. Used in CI pipelines.

### Start Production Server
```bash
npm run start
```
Starts the production server. Requires `npm run build` first.

---

## Testing

### Run All Tests
```bash
npm run test
```
Runs Jest test suite once.

### Watch Mode
```bash
npm run test:watch
```
Runs tests in watch mode - re-runs on file changes.

---

## Common Workflows

### Before Committing
```bash
npm run lint && npm run build
```
Ensures code passes linting and builds successfully.

### Full Test Run
```bash
npm run lint && npm run test && npm run build
```
Complete verification before pushing.

### Fresh Start
```bash
rm -rf node_modules .next
npm install
npm run dev
```
Clean reinstall and restart.

---

## Environment Setup

### First Time Setup
```bash
# Clone repository
git clone git@github.com:g-but/botsmann.git
cd botsmann

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your values

# Start development
npm run dev
```

### Update Dependencies
```bash
npm update
```

### Check for Vulnerabilities
```bash
npm audit
```

### Fix Vulnerabilities
```bash
npm audit fix
```

---

## Deployment

### Manual Deploy to Vercel
```bash
# Install Vercel CLI if needed
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Automatic Deploy
Push to `main` branch - GitHub Actions handles deployment.

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>
```

### Clear Next.js Cache
```bash
rm -rf .next
npm run dev
```

### Reset Everything
```bash
rm -rf node_modules .next package-lock.json
npm install
npm run dev
```

---

**Last Updated:** 2026-01-07
