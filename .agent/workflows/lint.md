---
description: Run linting and formatting for both frontend and backend
---

# Project-Wide Linting Workflow

This workflow ensures all code in the project follows the established design and style guidelines.

## Frontend (JS/TS)

Uses **ESLint** for logic and **Prettier** for formatting.

```bash
cd client
npm run lint
npm run fmt
```

## Backend (Python)

Uses **Ruff** for high-performance linting, formatting, and import sorting.

```bash
cd server
# Install ruff if not present
pip install ruff
# Check for issues
ruff check .
# Format code
ruff format .
```

## Benefits

✅ Consistent code style across the entire stack.
✅ Early detection of bugs and logic errors.
✅ Clean, readable diffs in version control.
