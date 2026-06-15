"""
Ollama AI Provider — implementasi untuk Ollama LLM lokal.
"""

import httpx
import json
import os
from typing import List
from datetime import datetime
import structlog

from app.services.ai_provider import AIProvider
from app.models.schemas import AIModelInfo

logger = structlog.get_logger()

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_TIMEOUT = int(os.getenv("OLLAMA_TIMEOUT", "300"))


class OllamaProvider(AIProvider):
    """
    Ollama AI Provider.
    Dokumentasi API: https://github.com/ollama/ollama/blob/main/docs/api.md
    """

    def __init__(self, base_url: str = None, timeout: int = None):
        self.base_url = (base_url or OLLAMA_BASE_URL).rstrip("/")
        self.timeout = timeout or OLLAMA_TIMEOUT

    @property
    def name(self) -> str:
        return "ollama"

    @property
    def label(self) -> str:
        return "Ollama (Lokal)"

    async def generate(self, prompt: str, model: str) -> str:
        """
        Generate teks menggunakan Ollama /api/generate endpoint.
        Menggunakan non-streaming mode untuk simplicity.
        """
        url = f"{self.base_url}/api/generate"
        payload = {
            "model": model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.3,       # Lebih deterministik untuk dokumentasi
                "num_predict": 2048,      # Max token output
                "top_p": 0.9,
            },
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(url, json=payload)
                response.raise_for_status()
                data = response.json()
                return data.get("response", "").strip()

        except httpx.ConnectError:
            raise ConnectionError(
                f"Tidak bisa konek ke Ollama di {self.base_url}. "
                "Pastikan Ollama sudah berjalan."
            )
        except httpx.TimeoutException:
            raise TimeoutError(
                f"Ollama timeout setelah {self.timeout} detik. "
                "Coba model yang lebih kecil atau tingkatkan timeout."
            )
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                raise ValueError(
                    f"Model '{model}' tidak ditemukan. "
                    f"Jalankan: ollama pull {model}"
                )
            raise RuntimeError(f"Ollama error: {e.response.status_code} — {e.response.text}")

    async def list_models(self) -> List[AIModelInfo]:
        """Ambil list model yang sudah di-pull di Ollama"""
        url = f"{self.base_url}/api/tags"

        try:
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.get(url)
                response.raise_for_status()
                data = response.json()

                models = []
                for model in data.get("models", []):
                    # Format ukuran ke human-readable
                    size_bytes = model.get("size", 0)
                    size_str = cls_format_size(size_bytes) if size_bytes else None

                    # Format tanggal
                    modified = model.get("modified_at", "")
                    if modified:
                        try:
                            dt = datetime.fromisoformat(modified.replace("Z", "+00:00"))
                            modified = dt.strftime("%Y-%m-%d")
                        except Exception:
                            pass

                    models.append(AIModelInfo(
                        name=model.get("name", ""),
                        size=size_str,
                        modified_at=modified,
                    ))

                return models

        except httpx.ConnectError:
            logger.warning("Ollama tidak tersedia", url=self.base_url)
            return []
        except Exception as e:
            logger.error("Error ambil model list", error=str(e))
            return []

    async def health_check(self) -> bool:
        """Cek apakah Ollama bisa diakses"""
        try:
            async with httpx.AsyncClient(timeout=5) as client:
                response = await client.get(f"{self.base_url}/api/tags")
                return response.status_code == 200
        except Exception:
            return False

    def get_info(self) -> dict:
        return {
            **super().get_info(),
            "base_url": self.base_url,
        }


def cls_format_size(size_bytes: int) -> str:
    """Format bytes ke human-readable (GB/MB)"""
    if size_bytes >= 1024 ** 3:
        return f"{size_bytes / (1024 ** 3):.1f} GB"
    elif size_bytes >= 1024 ** 2:
        return f"{size_bytes / (1024 ** 2):.0f} MB"
    else:
        return f"{size_bytes} B"


# Singleton instance
ollama_provider = OllamaProvider()
