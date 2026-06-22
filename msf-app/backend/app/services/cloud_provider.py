"""
Cloud AI Provider — implementasi untuk DeepSeek dan OpenAI.
Keduanya kompatibel dengan OpenAI API format.
"""

import httpx
import os
from typing import List
import structlog

from app.services.ai_provider import AIProvider
from app.models.schemas import AIModelInfo

logger = structlog.get_logger()


class DeepSeekProvider(AIProvider):
    """
    DeepSeek AI Provider.
    API DeepSeek kompatibel dengan OpenAI format.
    """

    def __init__(self):
        self.api_key = os.getenv("DEEPSEEK_API_KEY", "")
        self.base_url = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com/v1").rstrip("/")
        self.default_model = os.getenv("DEEPSEEK_DEFAULT_MODEL", "deepseek-chat")
        self.timeout = int(os.getenv("DEEPSEEK_TIMEOUT", "120"))
        self._client = None

    def get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(timeout=self.timeout)
        return self._client

    async def close(self):
        if self._client and not self._client.is_closed:
            await self._client.aclose()

    @property
    def name(self) -> str:
        return "deepseek"

    @property
    def label(self) -> str:
        return "DeepSeek"

    def _is_configured(self) -> bool:
        return bool(self.api_key)

    async def generate(self, prompt: str, model: str) -> str:
        if not self._is_configured():
            raise ValueError("DeepSeek API key tidak dikonfigurasi. Set DEEPSEEK_API_KEY di .env")

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": model or self.default_model,
            "messages": [
                {
                    "role": "system",
                    "content": "You are a professional database documentation expert. Generate clear, concise, and accurate documentation.",
                },
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.3,
            "max_tokens": 2048,
        }

        try:
            client = self.get_client()
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=payload,
                timeout=self.timeout,
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"].strip()

        except httpx.HTTPStatusError as e:
            if e.response.status_code == 401:
                raise ValueError("DeepSeek API key tidak valid.")
            raise RuntimeError(f"DeepSeek error: {e.response.status_code}")
        except Exception as e:
            raise RuntimeError(f"DeepSeek request gagal: {str(e)}")

    async def list_models(self) -> List[AIModelInfo]:
        if not self._is_configured():
            return []
        # DeepSeek models yang umum tersedia
        return [
            AIModelInfo(name="deepseek-chat"),
            AIModelInfo(name="deepseek-coder"),
            AIModelInfo(name="deepseek-reasoner"),
        ]

    async def health_check(self) -> bool:
        return self._is_configured()

    def get_info(self) -> dict:
        return {
            **super().get_info(),
            "base_url": self.base_url,
        }


class OpenAIProvider(AIProvider):
    """
    OpenAI API Provider.
    """

    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY", "")
        self.base_url = "https://api.openai.com/v1"
        self.default_model = os.getenv("OPENAI_DEFAULT_MODEL", "gpt-4o-mini")
        self.timeout = int(os.getenv("OPENAI_TIMEOUT", "60"))
        self._client = None

    def get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(timeout=self.timeout)
        return self._client

    async def close(self):
        if self._client and not self._client.is_closed:
            await self._client.aclose()

    @property
    def name(self) -> str:
        return "openai"

    @property
    def label(self) -> str:
        return "OpenAI"

    def _is_configured(self) -> bool:
        return bool(self.api_key)

    async def generate(self, prompt: str, model: str) -> str:
        if not self._is_configured():
            raise ValueError("OpenAI API key tidak dikonfigurasi. Set OPENAI_API_KEY di .env")

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": model or self.default_model,
            "messages": [
                {
                    "role": "system",
                    "content": "You are a professional database documentation expert.",
                },
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.3,
            "max_tokens": 2048,
        }

        try:
            client = self.get_client()
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=payload,
                timeout=self.timeout,
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"].strip()

        except httpx.HTTPStatusError as e:
            if e.response.status_code == 401:
                raise ValueError("OpenAI API key tidak valid.")
            if e.response.status_code == 429:
                raise RuntimeError("OpenAI rate limit tercapai. Coba lagi nanti.")
            raise RuntimeError(f"OpenAI error: {e.response.status_code}")
        except Exception as e:
            raise RuntimeError(f"OpenAI request gagal: {str(e)}")

    async def list_models(self) -> List[AIModelInfo]:
        if not self._is_configured():
            return []
        return [
            AIModelInfo(name="gpt-4o"),
            AIModelInfo(name="gpt-4o-mini"),
            AIModelInfo(name="gpt-4-turbo"),
            AIModelInfo(name="gpt-3.5-turbo"),
        ]

    async def health_check(self) -> bool:
        return self._is_configured()


# Singleton instances
deepseek_provider = DeepSeekProvider()
openai_provider = OpenAIProvider()
