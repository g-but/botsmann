"""Nerd Research Agent - Multi-provider research assistant."""

from .agent import ResearchAgent, research
from .providers import Provider, get_provider_config, print_provider_info

__all__ = [
    "ResearchAgent",
    "research",
    "Provider",
    "get_provider_config",
    "print_provider_info",
]

# Optional: Import tools only when using Anthropic provider
try:
    from .tools import (
        extract_pdf_text,
        summarize_document,
        save_research_notes,
    )
    __all__.extend([
        "extract_pdf_text",
        "summarize_document",
        "save_research_notes",
    ])
except ImportError:
    pass  # Tools not available (e.g., claude-agent-sdk not configured)
