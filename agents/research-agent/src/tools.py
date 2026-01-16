"""Custom tools for the Nerd research agent.

Standalone utility functions for research tasks.
Can be used with any provider.
"""

import json
from pathlib import Path
from datetime import datetime


async def extract_pdf_text(file_path: str) -> str:
    """Extract text from a PDF file."""
    try:
        from pypdf import PdfReader

        reader = PdfReader(file_path)
        text_content = []

        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            if text:
                text_content.append(f"--- Page {i + 1} ---\n{text}")

        return "\n\n".join(text_content)
    except Exception as e:
        return f"Error extracting PDF: {str(e)}"


async def save_research_notes(
    topic: str,
    notes: str,
    sources: list[str] | None = None,
    output_dir: str = "./research_output"
) -> str:
    """Save research notes to a JSON file."""
    try:
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_topic = "".join(c if c.isalnum() or c in "-_ " else "_" for c in topic)
        filename = f"{safe_topic}_{timestamp}.json"

        research_data = {
            "topic": topic,
            "timestamp": datetime.now().isoformat(),
            "notes": notes,
            "sources": sources or [],
            "metadata": {
                "agent": "nerd-research-agent",
                "version": "0.1.0"
            }
        }

        file_path = output_path / filename
        with open(file_path, "w") as f:
            json.dump(research_data, f, indent=2)

        return f"Saved to: {file_path}"
    except Exception as e:
        return f"Error saving notes: {str(e)}"


def summarize_document(content: str, doc_type: str = "document") -> str:
    """Generate a summary template for document analysis."""
    return f"""
Analyze this {doc_type} and extract:

## Key Information
- **Title**: [Extract title]
- **Authors/Source**: [Extract if available]
- **Type**: {doc_type}

## Summary
[2-3 sentence overview]

## Key Points
1. [Main point 1]
2. [Main point 2]
3. [Main point 3]

## Key Findings
- [Finding 1]
- [Finding 2]

---
Content:
{content[:20000]}
"""
