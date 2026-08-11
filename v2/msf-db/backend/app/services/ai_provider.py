"""
AI Provider abstraction layer.
Semua provider harus implementasi interface AIProvider.
"""

from abc import ABC, abstractmethod
from typing import List, Optional, TypeVar, Callable, Awaitable
import asyncio
import os
import random
from app.models.schemas import AIModelInfo

T = TypeVar("T")


def ai_seed() -> Optional[int]:
    """
    Seed sampling AI. None berarti tidak dikirim sama sekali.

    Ditempatkan di sini, bukan di salah satu provider, karena dipakai
    provider lokal maupun cloud. Menaruhnya di ollama_provider akan
    memaksa cloud_provider bergantung pada provider lokal.
    """
    nilai = os.getenv("AI_SEED", "").strip()
    if not nilai:
        return None
    try:
        return int(nilai)
    except ValueError:
        return None


def ai_temperature() -> float:
    """Rendah secara bawaan: tugasnya ekstraksi fakta, bukan menulis kreatif."""
    try:
        return float(os.getenv("AI_TEMPERATURE", "0.1"))
    except ValueError:
        return 0.1

async def retry_with_backoff(
    func: Callable[[], Awaitable[T]],
    max_retries: int = 3,
    base_delay: float = 1.0,
    max_delay: float = 30.0,
    exceptions: tuple = (Exception,),
) -> T:
    """
    Retry async function dengan exponential backoff + jitter.
    
    Args:
        func: Async callable yang akan di-retry
        max_retries: Maksimum percobaan ulang (default: 3)
        base_delay: Delay awal dalam detik (default: 1.0)
        max_delay: Delay maksimum dalam detik (default: 30.0)
        exceptions: Tuple exception yang akan di-retry
    """
    last_exception = None
    for attempt in range(max_retries + 1):
        try:
            return await func()
        except exceptions as e:
            last_exception = e
            if attempt == max_retries:
                break
            # Exponential backoff dengan random jitter
            delay = min(base_delay * (2 ** attempt) + random.uniform(0, 1), max_delay)
            await asyncio.sleep(delay)

    raise last_exception


class AIProvider(ABC):
    """
    Abstract base class untuk semua AI provider.
    Tambah provider baru: buat class baru yang extend AIProvider,
    implement semua method abstract.
    """

    @property
    @abstractmethod
    def name(self) -> str:
        """Nama unik provider (e.g., 'ollama', 'deepseek')"""
        ...

    @property
    @abstractmethod
    def label(self) -> str:
        """Label yang ditampilkan di UI (e.g., 'Ollama (Lokal)')"""
        ...

    @abstractmethod
    async def generate(self, prompt: str, model: str) -> str:
        """
        Generate teks dari prompt.
        Raise Exception jika gagal.
        """
        ...

    @abstractmethod
    async def list_models(self) -> List[AIModelInfo]:
        """Return list model yang tersedia"""
        ...

    @abstractmethod
    async def health_check(self) -> bool:
        """Return True jika provider dapat diakses"""
        ...

    def get_info(self) -> dict:
        """Return info provider untuk API response"""
        return {
            "name": self.name,
            "label": self.label,
        }
