"""Dokumen yang tidak dapat direproduksi tidak dapat diverifikasi."""

from app.services.ollama_provider import OllamaProvider


def test_payload_ollama_memuat_seed(monkeypatch):
    monkeypatch.setenv("AI_SEED", "42")
    provider = OllamaProvider()

    payload = provider.bangun_payload("prompt uji", "llama3.2")

    assert payload["options"]["seed"] == 42


def test_temperature_bawaan_rendah_untuk_tugas_faktual(monkeypatch):
    monkeypatch.delenv("AI_TEMPERATURE", raising=False)
    provider = OllamaProvider()

    payload = provider.bangun_payload("prompt uji", "llama3.2")

    assert payload["options"]["temperature"] == 0.1


def test_temperature_dapat_ditimpa_lewat_env(monkeypatch):
    monkeypatch.setenv("AI_TEMPERATURE", "0.7")
    provider = OllamaProvider()

    payload = provider.bangun_payload("prompt uji", "llama3.2")

    assert payload["options"]["temperature"] == 0.7


def test_seed_kosong_berarti_tidak_dikirim(monkeypatch):
    """Seed kosong harus berarti perilaku lama, bukan seed nol."""
    monkeypatch.setenv("AI_SEED", "")
    provider = OllamaProvider()

    payload = provider.bangun_payload("prompt uji", "llama3.2")

    assert "seed" not in payload["options"]


def test_prompt_dan_model_diteruskan_apa_adanya(monkeypatch):
    monkeypatch.delenv("AI_SEED", raising=False)
    provider = OllamaProvider()

    payload = provider.bangun_payload("prompt uji", "llama3.2")

    assert payload["prompt"] == "prompt uji"
    assert payload["model"] == "llama3.2"
    assert payload["stream"] is False
