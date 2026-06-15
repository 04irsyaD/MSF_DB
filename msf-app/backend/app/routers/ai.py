"""Router: AI provider — /api/ai/*"""

from fastapi import APIRouter
from typing import List
from app.models.schemas import AIModelsResponse, AIProviderInfo, AITestResponse, AIProviderType
from app.services.ollama_provider import ollama_provider
from app.services.cloud_provider import deepseek_provider, openai_provider
import time

router = APIRouter(prefix="/api/ai", tags=["AI"])

ALL_PROVIDERS = [ollama_provider, deepseek_provider, openai_provider]


@router.get("/models")
async def list_models(provider: str = "ollama"):
    """List model yang tersedia untuk provider tertentu"""
    prov_map = {
        "ollama": ollama_provider,
        "deepseek": deepseek_provider,
        "openai": openai_provider,
    }
    prov = prov_map.get(provider)
    if not prov:
        return AIModelsResponse(provider=provider, is_available=False, error="Provider tidak dikenal")

    is_available = await prov.health_check()
    models = await prov.list_models() if is_available else []
    return AIModelsResponse(provider=provider, is_available=is_available, models=models)


@router.get("/providers", response_model=List[AIProviderInfo])
async def list_providers():
    """List semua provider dan status ketersediaannya"""
    result = []
    for prov in ALL_PROVIDERS:
        is_available = await prov.health_check()
        info = prov.get_info()
        reason = None
        if not is_available:
            if prov.name == "ollama":
                reason = "Ollama tidak berjalan. Jalankan: docker-compose up -d ollama"
            else:
                reason = "API key tidak dikonfigurasi"

        result.append(AIProviderInfo(
            name=prov.name,
            label=prov.label,
            is_available=is_available,
            base_url=info.get("base_url"),
            reason=reason,
        ))
    return result


@router.post("/test", response_model=AITestResponse)
async def test_provider(provider: str = "ollama", model: str = "llama3.2"):
    """Test koneksi ke AI provider dengan generate teks singkat"""
    prov_map = {
        "ollama": ollama_provider,
        "deepseek": deepseek_provider,
        "openai": openai_provider,
    }
    prov = prov_map.get(provider)
    if not prov:
        return AITestResponse(provider=provider, success=False, message="Provider tidak dikenal")

    start = time.time()
    try:
        result = await prov.generate("Say 'OK' and nothing else.", model)
        latency = (time.time() - start) * 1000
        return AITestResponse(
            provider=provider,
            success=True,
            message=f"Berhasil. Response: {result[:50]}",
            latency_ms=round(latency, 2),
        )
    except Exception as e:
        return AITestResponse(
            provider=provider,
            success=False,
            message=str(e),
        )
