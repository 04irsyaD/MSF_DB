"""
AI Provider abstraction layer.
Semua provider harus implementasi interface AIProvider.
"""

from abc import ABC, abstractmethod
from typing import List
from app.models.schemas import AIModelInfo


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
