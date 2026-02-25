import datetime
import os
from typing import Dict

from database import get_database


async def generate_pdf_report(title: str, content: str) -> str:
    """
    Simulates generating a PDF report. In a real system, this would use a library
    like reportlab to write the structured content into a binary PDF and save to cloud storage.
    For this demo, we "compile" it to a text file.
    """
    print(f"📄 [PDF Generator] Formatting '{title}' into PDF layout...")

    # Simulate saving to disk
    safe_title = title.replace(" ", "_").lower()
    os.makedirs("reports", exist_ok=True)
    filename = (
        f"reports/{safe_title}_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}.pdf"
    )

    with open(filename, "w", encoding="utf-8") as f:
        f.write(f"--- CONFIDENTIAL REPORT: {title} ---\n\n")
        f.write(content)
        f.write("\n\n--- END OF REPORT ---")

    print(f"✅ [PDF Generator] Report successfully compiled and saved to {filename}")
    return filename


async def save_report_to_db(title: str, content: Dict) -> str:
    """
    Saves the structured analytics report to the MongoDB database for future frontend/API retrieval.
    """
    print(f"💾 [DB Storage] Storing report '{title}' in the database...")
    db = await get_database()

    document = {
        "title": title,
        "content": content,  # Store the actual JSON struct
        "created_at": datetime.datetime.utcnow(),
    }

    result = await db.reports.insert_one(document)

    doc_id = str(result.inserted_id)
    print(f"✅ [DB Storage] Successfully saved report object ID: {doc_id}")
    return doc_id
