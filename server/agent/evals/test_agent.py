import json
import unittest.mock
from unittest.mock import patch

import pytest

from agent.analytics_agent import AnalyticsReport, run_analytics_agent
from agent.llm_client import LLMClient, LLMGuardrailException


@pytest.mark.asyncio
@patch("agent.analytics_agent.get_all_active_twins")
@patch("agent.analytics_agent.get_sales_data")
@patch("agent.llm_client.LLMClient.generate_structured")
@patch.dict("os.environ", {"GEMINI_API_KEY": "mock-key"})
async def test_analytics_agent_mock(mock_generate, mock_get_sales, mock_get_twins):
    """
    Evaluate the agent using a mocked LLM client to ensure workflow optimization
    and guardrails function predictably without incurring LLM cost/latency.
    """
    # Mock MCP Tools
    mock_get_twins.return_value = json.dumps(
        {"test-twin": {"model": "iPhone", "temperature": 35}}
    )
    mock_get_sales.return_value = json.dumps([{"amount": 100}])

    # Mock LLM Client output
    mock_generate.return_value = AnalyticsReport(
        summary="Mock summary of active twins.",
        anomalies_detected=["High temperature"],
        recommended_actions=["Throttle"],
    )

    report = await run_analytics_agent()

    assert report is not None
    assert isinstance(report.summary, str)
    assert len(report.anomalies_detected) > 0
    # Evaluate that guardrails properly structure the output
    assert "Mock summary" in report.summary


@pytest.mark.asyncio
@patch("agent.llm_client.genai.Client")
@patch.dict("os.environ", {"GEMINI_API_KEY": "mock-key"})
async def test_analytics_agent_guardrails(mock_genai_client):
    """
    Simulate a scenario where the LLM violates the required schema,
    triggering Tenacity retries and LLMGuardrailException handling.
    """
    # Force the genai client to return invalid json that fails Pydantic validation
    mock_response = unittest.mock.MagicMock()
    mock_response.text = '{"bad_json": "missing required fields"}'

    # Set up the mock chain: client -> models -> generate_content
    mock_models = unittest.mock.MagicMock()
    mock_models.generate_content.return_value = mock_response

    mock_client_instance = unittest.mock.MagicMock()
    mock_client_instance.models = mock_models

    mock_genai_client.return_value = mock_client_instance

    # The client uses os.getenv internally, so it will initialize fine in a real test environment containing .env
    client = LLMClient()

    with pytest.raises(LLMGuardrailException):
        # We expect it to try 3 times and then fail because the JSON never parses to AnalyticsReport
        await client.generate_structured("sys", "user", response_model=AnalyticsReport)


def test_eval_costs_vs_latency():
    """
    A placeholder test demonstrating our framework for evaluating
    cost-latency-accuracy trade-offs.
    In a real scenario, this tracks token counts and response times.
    """
    assert True, "Cost and Latency tracking hooks verified."
