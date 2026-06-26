"""Generic agent-run engine backed by OpenAI.

Any agent in the catalog can be run: we take its system prompt and the user's
input text and ask the model to produce the agent's output. Kept deliberately
simple (single chat completion) so it's easy to extend later with tools, RAG, etc.
"""

from openai import OpenAI

from app.agents_catalog import AgentTemplate
from app.core.config import settings


class OpenAINotConfigured(RuntimeError):
    pass


def _client() -> OpenAI:
    if not settings.openai_api_key:
        raise OpenAINotConfigured(
            "OPENAI_API_KEY is not set. Add it to backend/.env to run agents."
        )
    return OpenAI(api_key=settings.openai_api_key)


def run_agent(agent: AgentTemplate, user_input: str) -> str:
    """Run one agent against the user's input and return its markdown output."""
    client = _client()
    user_input = (user_input or "").strip()
    if not user_input:
        user_input = "(No input provided. Produce a helpful example output and note that inputs were empty.)"

    response = client.chat.completions.create(
        model=settings.openai_model,
        temperature=0.4,
        messages=[
            {"role": "system", "content": agent.system_prompt},
            {"role": "user", "content": user_input},
        ],
    )
    return response.choices[0].message.content or ""
