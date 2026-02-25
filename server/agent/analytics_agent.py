import asyncio
from typing import List

from pydantic import BaseModel, Field

from agent.llm_client import LLMClient
from agent.mcp_server import get_all_active_twins, get_sales_data
from agent.prompts import ANALYTICS_SYSTEM_PROMPT, build_analytics_prompt


class AnalyticsReport(BaseModel):
    """
    Structured output demonstrating Pydantic validation and guardrails.
    """

    summary: str = Field(
        description="A concise summary of the active fleet status and overall health."
    )
    anomalies_detected: List[str] = Field(
        description="List of specific devices and their anomalies. E.g., 'MacBook Pro M3 (mac-m3-002) is overheating at 45.1C'."
    )
    recommended_actions: List[str] = Field(
        description="Actionable steps like 'Throttle CPU' or 'Schedule Maintenance'."
    )


async def run_analytics_agent(region_filter: str = None) -> AnalyticsReport:
    """
    Simulates an agentic workflow:
    1. Agent determines data needed (Mocked here by direct MCP tool calls).
    2. Fetches from MCP tools (Digital Twin DB).
    3. Prompts LLM with clear context.
    4. Enforces JSON structured output and catches validation failures.
    """
    print("🤖 Agent starting analytics run...")

    # --- MCP Tool Invocation Phase ---
    print("↳ Calling MCP Tool: get_all_active_twins")
    active_twins_json = await get_all_active_twins()

    print(f"↳ Calling MCP Tool: get_sales_data (Region: {region_filter or 'All'})")
    sales_data_json = await get_sales_data(region=region_filter)

    # --- Prompt Engineering Phase ---
    user_prompt = build_analytics_prompt(active_twins_json, sales_data_json)

    # --- LLM Client Invocation (with Retries and Guardrails) ---
    print("↳ Sending context to LLM with structured output constraints...")
    client = LLMClient()

    report: AnalyticsReport = await client.generate_structured(
        system_prompt=ANALYTICS_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        response_model=AnalyticsReport,
        temperature=0.1,  # Trade-off: Very low temp for strict format adherence and analytical precision
    )

    print("✅ Report generated successfully.")
    return report


if __name__ == "__main__":
    report = asyncio.run(run_analytics_agent())
    print("\n--- FINAL REPORT ---")
    print(report.model_dump_json(indent=2))
