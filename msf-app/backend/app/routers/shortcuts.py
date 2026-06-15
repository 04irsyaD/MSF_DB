"""Router: SQL Shortcuts — /api/shortcuts"""

import json
import os
from functools import lru_cache
from typing import Optional, List
from fastapi import APIRouter, Query
from app.models.schemas import ShortcutsResponse, ShortcutItem

router = APIRouter(prefix="/api/shortcuts", tags=["Shortcuts"])

SHORTCUTS_DIR = os.getenv("SHORTCUTS_DIR", "/app/shortcuts_data")


@lru_cache(maxsize=1)
def _load_all_shortcuts() -> List[dict]:
    """Load semua shortcut dari file JSON (cached)"""
    all_shortcuts = []

    if not os.path.exists(SHORTCUTS_DIR):
        return []

    for filename in os.listdir(SHORTCUTS_DIR):
        if filename.endswith(".json"):
            filepath = os.path.join(SHORTCUTS_DIR, filename)
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if isinstance(data, list):
                        all_shortcuts.extend(data)
            except Exception:
                pass

    return all_shortcuts


@router.get("", response_model=ShortcutsResponse)
async def list_shortcuts(
    engine: Optional[str] = Query(None, description="Filter by DB engine"),
    category: Optional[str] = Query(None, description="Filter by category"),
    risk_level: Optional[str] = Query(None, description="Filter by risk level"),
    q: Optional[str] = Query(None, description="Search by title/description"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    """List shortcut SQL dengan filter opsional"""
    shortcuts = _load_all_shortcuts()

    # Filter
    if engine:
        shortcuts = [s for s in shortcuts if s.get("engine", "").lower() == engine.lower()]
    if category:
        shortcuts = [s for s in shortcuts if s.get("category", "").lower() == category.lower()]
    if risk_level:
        shortcuts = [s for s in shortcuts if s.get("risk_level", "").lower() == risk_level.lower()]
    if q:
        q_lower = q.lower()
        shortcuts = [
            s for s in shortcuts
            if q_lower in s.get("title", "").lower()
            or q_lower in s.get("description", "").lower()
            or q_lower in " ".join(s.get("tags", [])).lower()
        ]

    total = len(shortcuts)
    paginated = shortcuts[offset: offset + limit]

    return ShortcutsResponse(
        total=total,
        items=[ShortcutItem(**s) for s in paginated],
    )


@router.get("/engines")
async def list_engines():
    """List semua engine yang tersedia di shortcuts"""
    shortcuts = _load_all_shortcuts()
    engines = sorted(set(s.get("engine", "") for s in shortcuts if s.get("engine")))
    return {"engines": engines}


@router.get("/categories")
async def list_categories():
    """List semua kategori yang tersedia"""
    shortcuts = _load_all_shortcuts()
    categories = sorted(set(s.get("category", "") for s in shortcuts if s.get("category")))
    return {"categories": categories}
