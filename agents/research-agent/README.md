# Nerd Research Agent

Multi-provider research assistant - backend for the Nerd bot.

## Providers

| Provider | Cost | Setup |
|----------|------|-------|
| **Ollama** | FREE | Local, runs on your machine |
| **Groq** | FREE tier | Cloud, fast inference |
| **Anthropic** | Paid | Claude API |

## Quick Start

```bash
cd agents/research-agent
source venv/bin/activate

# Option 1: Ollama (free, local)
ollama serve &
ollama pull llama3.1
python -m src.agent "your research topic"

# Option 2: Groq (free tier)
echo "RESEARCH_PROVIDER=groq" > .env
echo "GROQ_API_KEY=your-key" >> .env
python -m src.agent "your research topic"
```

## Usage

### CLI
```bash
python -m src.agent "Latest advances in RAG"
python -m src.agent "Knowledge graphs" --deep  # Big Discovery Mode
```

### Python
```python
from src import research
import anyio

# Quick research
anyio.run(research("Your topic", depth="quick"))

# Deep research with Big Discovery Mode
anyio.run(research("Your topic", depth="deep"))
```

### Interactive Session
```python
from src import ResearchAgent
import anyio

async def main():
    agent = ResearchAgent()
    await agent.ask("What are the main approaches to RAG?")
    await agent.ask("How do knowledge graphs fit in?")
    await agent.discover("Novel improvements to RAG?")

anyio.run(main)
```

## Configuration

Set in `.env` or environment:

```bash
RESEARCH_PROVIDER=ollama    # ollama, groq, anthropic
RESEARCH_MODEL=llama3.1     # Override default model
GROQ_API_KEY=xxx            # For Groq
ANTHROPIC_API_KEY=xxx       # For Anthropic
```

## Features

- **Multi-provider**: Switch with one env var
- **Big Discovery Mode**: Find novel connections
- **Streaming**: Real-time output
- **Stateful sessions**: Multi-turn conversations
