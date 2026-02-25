import asyncio
import os
import sys

from agent.analytics_agent import run_analytics_agent
from agent.llm_client import LLMClient
from agent.prompts import MANAGER_SYSTEM_PROMPT
from agent.tools import reporting


async def call_analytics_agent(region: str = None) -> dict:
    """
    Calls the specialized Analytics Agent to fetch and analyze telemetry and sales data for Apple Digital Twins.
    Returns the analytics report as a dictionary containing summary, anomalies, and recommendations.
    Use this tool when you need raw hardware insights.
    """
    print(
        f"👔 [Manager] Delegating to Analytics Agent for region: {region or 'GLOBAL'}"
    )
    report = await run_analytics_agent(region_filter=region)
    return report.model_dump()


async def run_manager_agent(user_request: str) -> str:
    """
    The main dynamic execution loop loop using Gemini function calling.
    It loops until the LLM decides no more tools are needed.
    """
    print(f"\n👔 [Manager] Received request: '{user_request}'")

    client = LLMClient()

    tool_map = {
        "call_analytics_agent": call_analytics_agent,
        "generate_pdf_report": reporting.generate_pdf_report,
        "save_report_to_db": reporting.save_report_to_db,
    }

    messages = [{"role": "user", "parts": [{"text": user_request}]}]

    # Simple Dynamic Execution Loop
    for step in range(10):  # Max 10 interaction turns to prevent infinite loops
        response = await client.generate_with_tools(
            system_prompt=MANAGER_SYSTEM_PROMPT,
            contents=messages,
            tools=list(tool_map.values()),
            temperature=0.3,
        )

        # Add the model's response to the conversation history
        messages.append(response.candidates[0].content)

        if not response.function_calls:
            print(f"👔 [Manager] Final Answer: {response.text}")
            return response.text

        for fc in response.function_calls:
            print(f"👔 [Manager] Attempting to execute tool '{fc.name}'...")

            func = tool_map.get(fc.name)
            if not func:
                print(f"⚠️ [Manager] Model Hallucinated an unknown tool: {fc.name}")
                error_part = {
                    "function_response": {
                        "name": fc.name,
                        "response": {"error": f"Tool {fc.name} not found"},
                    }
                }
                messages.append({"role": "user", "parts": [error_part]})
                continue

            try:
                # Convert args representation to dict correctly if it's not already
                args = fc.args if isinstance(fc.args, dict) else dict(fc.args)

                if asyncio.iscoroutinefunction(func):
                    result = await func(**args)
                else:
                    result = func(**args)

                # Return the result back to Gemini so it can proceed
                success_part = {
                    "function_response": {
                        "name": fc.name,
                        "response": {"result": result},
                    }
                }
                messages.append({"role": "user", "parts": [success_part]})

            except Exception as e:
                print(f"❌ [Manager] Tool '{fc.name}' threw an error: {e}")
                err_part = {
                    "function_response": {
                        "name": fc.name,
                        "response": {"error": str(e)},
                    }
                }
                messages.append({"role": "user", "parts": [err_part]})

    return "Workflow Failed: Exceeded maximum iterations."


if __name__ == "__main__":
    # A quick script to manually verify the capability

    # Must run asyncio event loop
    if not os.getenv("GEMINI_API_KEY"):
        print("Please set GEMINI_API_KEY.")
        sys.exit(1)

    asyncio.run(
        run_manager_agent("I need a full EU health report saved to the system.")
    )
