# Apple Digital Twin - AI Agent

This module demonstrates advanced capabilities in building agentic systems, addressing the following core requirements:

## 🚀 Usage

### Running the Evaluation Suite
The fastest way to verify the Agent's guardrails and fallback logic is running the `pytest` suite:
```bash
cd server
python -m pytest agent/evals/test_agent.py
```

### Running the Analytics Orchestrator
To execute a live prompt against the Gemini API that fetches data from the MongoDB:
1. Ensure `GEMINI_API_KEY` is present in your root `.env` file.
2. Start the MongoDB via docker-compose (`docker-compose up -d mongodb`).
3. Run the orchestration script directly:
```bash
cd server
python agent/analytics_agent.py
```

### Running the MCP Server
To expose the Digital Twin telemetry tools to external MCP-compatible AI Assistants (like Claude Desktop or Cursor):
```bash
cd server
mcp run agent/mcp_server.py
```

## 1. Proven integration of LLMs
The `llm_client.py` and `analytics_agent.py` showcase a robust wrapper around LLM providers. Rather than simple text completion, this system orchestrates data-fetching and passes it as context to the LLM.

## 2. MCP Experience
`mcp_server.py` implements the Model Context Protocol (MCP) using the `mcp.server.fastmcp` library. It exposes specific tools like `get_digital_twin`, `get_all_active_twins`, and `get_sales_data` to allow AI agents to safely query Apple digital twin telemetry and Postgres/MongoDB sales data.

## 3. Structured Output (JSON, Reports)
We use `pydantic` in `llm_client.py` alongside Google Gemini's `response_schema` feature to enforce strict JSON schemas (`AnalyticsReport`). This guarantees the LLM's output can be programmatically consumed by the frontend without regex parsing.

## 4. Prompt Engineering & Workflow Optimization
`prompts.py` isolates our system and user prompts. It demonstrates context injection and constraints (e.g., highlighting specific temperature thresholds).
`analytics_agent.py` orchestrates a defined workflow: 
1. Call MCP Tools 
2. Assemble Prompts 
3. Call LLM 
4. Parse Output.

## 5. Evaluation Frameworks
The `evals/test_agent.py` suite uses `pytest` to evaluate the system. It uses mocked clients to test the workflow without incurring latency/cost, validating that the guardrails and data structures behave as expected.

## 6. Retries, Validation, and Guardrails
`llm_client.py` uses the standard `tenacity` library to implement exponential backoff retries. If the LLM generates output that fails Pydantic validation, an `LLMGuardrailException` is raised, triggering a graceful retry sequence before ultimately failing over.

## 7. Optimizing Cost, Latency, and Accuracy
The codebase is explicitly designed with trade-offs in mind:
- **Accuracy**: We use a `temperature` of `0.1` and explicit Pydantic schemas to reduce hallucinations for Analytics logic.
- **Latency/Cost**: The wrapper allows seamless configuration of smaller, high-speed models (`gemini-3-flash-preview`) for analytical tasks where heavy reasoning isn't needed but strict formatting is.
