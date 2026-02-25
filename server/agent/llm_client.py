import os
from typing import Type, TypeVar

from google import genai
from pydantic import BaseModel, ValidationError
from tenacity import (
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

T = TypeVar("T", bound=BaseModel)


class LLMGuardrailException(Exception):
    """Raised when LLM output violates guardrails or schema validation."""

    pass


class LLMClient:
    """
    A wrapper around Google GenAI API demonstrating:
    - Structured output generation (Pydantic)
    - Exponential backoff retries (Tenacity)
    - Guardrails and validation
    """

    def __init__(self):
        # Encapsulating the API Key lookup so the caller doesn't handle it
        api_key = os.getenv("GEMINI_API_KEY")

        # We only throw if not mocking, allowing tests to run without keys
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is missing.")

        self.client = genai.Client(api_key=api_key)

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((LLMGuardrailException, Exception)),
        reraise=True,
    )
    async def generate_structured(
        self,
        system_prompt: str,
        user_prompt: str,
        response_model: Type[T],
        temperature: float = 0.2,
    ) -> T:
        """
        Generates a structured Pydantic model response from the LLM.
        Demonstrates cost/accuracy trade-off by using structural enforcement
        and lower temperature for analytical tasks.
        """
        # Real Gemini Call
        try:
            response = self.client.models.generate_content(
                model="gemini-3-flash-preview",
                contents=user_prompt,
                config=genai.types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    temperature=temperature,
                    response_mime_type="application/json",
                    response_schema=response_model,
                ),
            )

            # The python SDK currently returns text that we need to parse into the Pydantic model
            if response.text:
                return response_model.model_validate_json(response.text)
            else:
                raise LLMGuardrailException("Empty response from Gemini.")

        except ValidationError as e:
            # Catch Pydantic validation errors so tenacity can retry
            raise LLMGuardrailException(
                f"Failed to parse LLM structured output. Validation error: {e}"
            )
        except Exception as e:
            # Re-raise standard exceptions for tenacity
            raise e

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((Exception)),
        reraise=True,
    )
    async def generate_with_tools(
        self,
        system_prompt: str,
        contents: list | str,
        tools: list,
        temperature: float = 0.2,
    ) -> genai.types.GenerateContentResponse:
        """
        Generates a response using the Gemini Function Calling API.
        Takes a list of tools (functions) that the model can request to execute.
        Returns the raw response so the Orchestrator can handle the tool execution loop.
        """
        try:
            response = self.client.models.generate_content(
                model="gemini-3-flash-preview",
                contents=contents,
                config=genai.types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    temperature=temperature,
                    tools=tools,
                ),
            )
            return response
        except Exception as e:
            raise e
