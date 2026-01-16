"""FastAPI server for the Nerd Research Agent.

Exposes the research agent as an API for the botsmann frontend.

Run with:
    uvicorn src.server:app --reload --port 8100
"""

import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from .providers import get_provider_config, query_provider, print_provider_info
from .agent import RESEARCH_SYSTEM_PROMPT, DISCOVERY_PROMPT

app = FastAPI(
    title="Nerd Research Agent API",
    description="Research agent powered by multiple LLM providers",
    version="0.1.0",
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://botsmann.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ResearchRequest(BaseModel):
    topic: str
    depth: str = "standard"  # quick, standard, deep


class ChatRequest(BaseModel):
    message: str
    history: list[dict] | None = None


@app.get("/")
async def root():
    """Health check and provider info."""
    config = get_provider_config()
    return {
        "status": "ok",
        "agent": "nerd-research-agent",
        "provider": config.name.value,
        "model": config.model,
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.post("/research")
async def research(request: ResearchRequest):
    """
    Conduct research on a topic.
    Returns streaming response.
    """
    config = get_provider_config()

    depth_instructions = {
        "quick": "Provide a brief, focused overview.",
        "standard": "Conduct thorough research with analysis.",
        "deep": f"Conduct exhaustive research.\n\n{DISCOVERY_PROMPT}",
    }

    instruction = depth_instructions.get(request.depth, depth_instructions["standard"])
    prompt = f"Research Topic: {request.topic}\n\n{instruction}"

    async def generate():
        try:
            async for chunk in query_provider(prompt, RESEARCH_SYSTEM_PROMPT, config):
                yield chunk
        except Exception as e:
            yield f"\n\nError: {str(e)}"

    return StreamingResponse(
        generate(),
        media_type="text/plain",
        headers={"X-Provider": config.name.value, "X-Model": config.model},
    )


@app.post("/chat")
async def chat(request: ChatRequest):
    """
    Single chat message with optional history.
    Returns streaming response.
    """
    config = get_provider_config()

    # Build context from history
    context = ""
    if request.history:
        context = "Previous conversation:\n"
        for h in request.history[-3:]:
            role = h.get("role", "user")
            content = h.get("content", "")[:200]
            context += f"{role}: {content}...\n"
        context += "\n"

    prompt = f"{context}User: {request.message}"

    async def generate():
        try:
            async for chunk in query_provider(prompt, RESEARCH_SYSTEM_PROMPT, config):
                yield chunk
        except Exception as e:
            yield f"\n\nError: {str(e)}"

    return StreamingResponse(generate(), media_type="text/plain")


@app.post("/discover")
async def discover(request: ResearchRequest):
    """
    Big Discovery Mode - find novel connections.
    """
    config = get_provider_config()

    prompt = f"""
{DISCOVERY_PROMPT}

Research question: {request.topic}

Analyze deeply and provide specific, actionable insights.
"""

    async def generate():
        try:
            async for chunk in query_provider(prompt, RESEARCH_SYSTEM_PROMPT, config):
                yield chunk
        except Exception as e:
            yield f"\n\nError: {str(e)}"

    return StreamingResponse(generate(), media_type="text/plain")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8100)
