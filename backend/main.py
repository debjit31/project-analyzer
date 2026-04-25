"""
Entry point for the Project Analyzer backend.

Run locally:
    uvicorn main:app --reload --port 8000

Or via the helper:
    python main.py
"""

import uvicorn

from app.application import create_app

app = create_app()

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )

