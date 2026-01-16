"""Basic research agent example.

Run with:
    python examples/basic_research.py
"""

import anyio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from src import research, ResearchAgent


async def quick_research_example():
    """One-shot research query."""
    print("\n=== Quick Research Example ===\n")
    await research(
        topic="Latest developments in retrieval-augmented generation (RAG)",
        depth="quick"
    )


async def deep_research_example():
    """Deep research with Big Discovery Mode."""
    print("\n=== Deep Research Example ===\n")
    await research(
        topic="How can knowledge graphs enhance RAG systems?",
        depth="deep",
        save_results=True
    )


async def interactive_session_example():
    """Multi-turn interactive research session."""
    print("\n=== Interactive Research Session ===\n")

    async with ResearchAgent() as agent:
        # First query
        await agent.ask(
            "What are the main approaches to document chunking in RAG systems?"
        )

        print("\n" + "-"*40 + "\n")

        # Follow-up query (maintains context)
        await agent.ask(
            "How does semantic chunking compare to fixed-size chunking?"
        )

        print("\n" + "-"*40 + "\n")

        # Run Big Discovery Mode
        await agent.discover(
            "What novel approaches could improve RAG system accuracy?"
        )


async def main():
    # Choose which example to run
    await quick_research_example()

    # Uncomment for other examples:
    # await deep_research_example()
    # await interactive_session_example()


if __name__ == "__main__":
    anyio.run(main)
