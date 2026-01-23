# Security Guidelines

This repo previously contained a committed `.env.local`. Consider all exposed credentials compromised and rotate immediately.

Immediate actions

- Rotate Supabase: `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- Rotate Groq API key and AWS credentials (if used).
- Remove cached file: `git rm --cached .env.local` (do not commit secrets again).

Prevent future leaks

- `.gitignore` already ignores `.env`, `.env.local`, and `.env*.local`.
- Husky pre-commit runs a secrets check (see `.husky/pre-commit`).
- Never store real secrets in docs. Use placeholders like `eyJhbGci...` or `gsk_...`.

Report & handling

- If a secret appears in git history, rotate it and open a short internal incident note in `logs/` (redact values).
