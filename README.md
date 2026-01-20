# Botsmann - Your Private AI Professionals

Expert guidance from AI advisors in law, health, research, language, art, and business. Available 24/7, completely private, at a fraction of traditional costs.

**Live at**: [botsmann.vercel.app](https://botsmann.vercel.app)

## Our AI Professionals

| Professional | Role                | Description                                                  |
| ------------ | ------------------- | ------------------------------------------------------------ |
| **Lex**      | Legal Advisor       | Contract reviews, legal questions, case analysis             |
| **Imhotep**  | Health Advisor      | Health questions, symptom guidance, wellness support         |
| **Nerd**     | Research Assistant  | Literature review, data analysis, research synthesis         |
| **Heidi**    | Language Coach      | German/Swiss German learning, translation, cultural guidance |
| **Muse**     | Artistic Advisor    | Art feedback, creative direction, style development          |
| **Trident**  | Business Strategist | Business planning, strategy, market analysis                 |

## Technology Stack

- **Frontend**: React, Next.js 14, TailwindCSS
- **Backend**: Next.js API routes, OpenAI/Groq API
- **Database**: Supabase (PostgreSQL + pgvector)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- OpenAI or Groq API key

### Installation

```bash
# Clone and install
git clone https://github.com/g-but/botsmann.git
cd botsmann
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
botsmann/
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   ├── bots/             # Detailed bot pages
│   ├── professionals/    # Minimal professional pages
│   └── ...
├── components/           # Shared UI components
├── data/                 # Static data (professionals, bots)
├── lib/                  # Utilities and helpers
└── types/                # TypeScript definitions
```

## Development

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run lint      # ESLint check
npm run test      # Run tests
```

## Deployment

Push to `main` branch triggers automatic deployment to Vercel via GitHub Actions.

```bash
git add .
git commit -m "Your changes"
git push origin main
```

## Documentation

- [Best Practices](./docs/BEST_PRACTICES.md) - Coding standards (DRY, SSOT, SoC)
- [Commands](./docs/COMMANDS.md) - Available npm scripts
- [Shared Context](./docs/SHARED_CONTEXT.md) - Architecture overview

## Enterprise

For law firms, medical practices, and businesses needing private, compliant AI deployment, see our [Enterprise page](https://botsmann.vercel.app/enterprise).

## License

[MIT License](LICENSE)
