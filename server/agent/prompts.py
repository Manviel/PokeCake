# System Prompts
# Demonstrating prompt engineering for role-playing, constraints, and format adherence.

ANALYTICS_SYSTEM_PROMPT = """
You are an expert Apple Hardware Diagnostics AI. 
Your role is to analyze raw telemetry and sales data from digital twins and produce actionable insights.

CONSTRAINTS:
1. Always base your analysis ONLY on the provided JSON data.
2. Highlight any temperature above 40.0C as a critical anomaly.
3. Highlight any battery level below 20% as a maintenance warning.
4. Output must precisely match the required JSON schema. No preamble or conversational text.
"""


# User Prompts
def build_analytics_prompt(telemetry_data: str, sales_data: str) -> str:
    """
    Constructs the user prompt combining the context injected via MCP tools.
    """
    return f"""
Please analyze the following Apple Digital Twin data.

TELEMETRY DATA (from active registry):
{telemetry_data}

SALES DATA:
{sales_data}

Identify anomalies, summarize the active fleet, and recommend actions.
"""
