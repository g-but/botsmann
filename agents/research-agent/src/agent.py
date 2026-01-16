"""Nerd Research Agent - Multi-provider research assistant.

Supports:
- Ollama (free, local)
- Groq (free tier)
- Anthropic Claude (paid)

Set RESEARCH_PROVIDER env var to switch: ollama, groq, anthropic
"""

import anyio
from datetime import datetime
from .providers import (
    Provider,
    get_provider_config,
    query_provider,
    print_provider_info,
)


# System prompt for research agent behavior
RESEARCH_SYSTEM_PROMPT = """You are Nerd, an advanced AI research assistant. Your mission is to help users conduct thorough, accurate research.

## Core Capabilities
1. **Information Synthesis**: Combine knowledge into coherent insights
2. **Critical Analysis**: Evaluate sources and claims
3. **Big Discovery Mode**: Find novel connections between concepts

## Research Workflow
1. Clarify the research question
2. Break down into sub-questions
3. Analyze from multiple perspectives
4. Synthesize findings
5. Identify gaps and novel connections

## Guidelines
- Distinguish between facts and interpretations
- Acknowledge uncertainty and limitations
- Suggest follow-up questions
- Be concise but thorough

## Output Format
Structure your responses with clear sections:
- **Summary**: Brief overview (2-3 sentences)
- **Key Findings**: Numbered list of main points
- **Analysis**: Deeper examination
- **Gaps & Questions**: What remains unknown
- **Follow-up**: Suggested next steps
"""

DISCOVERY_PROMPT = """
## Big Discovery Mode

Analyze the research topic to identify:

### 1. Unexpected Connections
Look for surprising relationships between seemingly unrelated concepts.

### 2. Research Gaps
What questions remain unanswered? What hasn't been explored?

### 3. Novel Hypotheses
Based on the evidence, what new hypotheses could be tested?

### 4. Cross-Domain Insights
How might findings from one domain apply to another?

### 5. Contrarian Perspectives
What assumptions might be wrong? What's the opposite view?

Provide specific, actionable insights.
"""


async def research(
    topic: str,
    depth: str = "standard",
) -> None:
    """
    Conduct research on a topic.

    Args:
        topic: The research topic or question
        depth: Research depth - "quick", "standard", or "deep"
    """
    config = get_provider_config()

    depth_instructions = {
        "quick": "Provide a brief, focused overview.",
        "standard": "Conduct thorough research with analysis.",
        "deep": f"Conduct exhaustive research.\n\n{DISCOVERY_PROMPT}",
    }

    instruction = depth_instructions.get(depth, depth_instructions["standard"])

    prompt = f"""
Research Topic: {topic}

{instruction}
"""

    print(f"\n{'='*60}")
    print(f"NERD RESEARCH AGENT")
    print(f"{'='*60}")
    print_provider_info(config)
    print(f"Topic: {topic}")
    print(f"Depth: {depth}")
    print(f"{'='*60}\n")

    try:
        async for chunk in query_provider(prompt, RESEARCH_SYSTEM_PROMPT, config):
            print(chunk, end="", flush=True)
    except Exception as e:
        print(f"\nError: {e}")
        if config.name == Provider.OLLAMA:
            print("\nMake sure Ollama is running: ollama serve")
            print("And you have a model: ollama pull llama3.1")
        elif config.name == Provider.GROQ:
            print("\nCheck your GROQ_API_KEY in .env")
        return

    print(f"\n\n{'='*60}")
    print(f"Research complete - {datetime.now().strftime('%H:%M:%S')}")
    print(f"{'='*60}\n")


class ResearchAgent:
    """
    Stateful research agent for multi-turn interactions.
    """

    def __init__(self):
        self.config = get_provider_config()
        self.history: list[dict] = []

    async def ask(self, question: str) -> str:
        """Send a research query and get response."""
        # Build context from history
        context = ""
        if self.history:
            context = "Previous discussion:\n"
            for h in self.history[-3:]:  # Last 3 exchanges
                context += f"Q: {h['question'][:100]}...\n"

        prompt = f"{context}\nNew question: {question}"

        print(f"\n> {question}\n")

        response_parts = []
        async for chunk in query_provider(prompt, RESEARCH_SYSTEM_PROMPT, self.config):
            response_parts.append(chunk)
            print(chunk, end="", flush=True)

        response = "".join(response_parts)
        self.history.append({"question": question, "response": response})
        print("\n")
        return response

    async def discover(self, research_question: str) -> str:
        """Run Big Discovery Mode."""
        prompt = f"{DISCOVERY_PROMPT}\n\nResearch question: {research_question}"
        return await self.ask(prompt)


# CLI entry point
async def main():
    """CLI entry point for quick research."""
    import sys

    if len(sys.argv) < 2:
        print("Usage: python -m src.agent 'your research topic'")
        print("       python -m src.agent 'topic' --deep")
        print("")
        print("Set provider via env var:")
        print("  RESEARCH_PROVIDER=ollama  (free, local)")
        print("  RESEARCH_PROVIDER=groq    (free tier)")
        print("  RESEARCH_PROVIDER=anthropic (paid)")
        sys.exit(1)

    topic = sys.argv[1]
    depth = "deep" if "--deep" in sys.argv else "standard"

    await research(topic, depth=depth)


if __name__ == "__main__":
    anyio.run(main)
