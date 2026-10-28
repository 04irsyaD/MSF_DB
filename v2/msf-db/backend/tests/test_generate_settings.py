"""Setting yang divalidasi tapi dibuang adalah janji palsu ke pengguna."""

from app.services.doc_generator import DocGenerator


class ProviderPerekam:
    def __init__(self):
        self.prompt = None

    async def generate(self, prompt, model):
        self.prompt = prompt
        return "Deskripsi."


def test_doc_generator_menerima_project_description():
    gen = DocGenerator(
        provider=ProviderPerekam(),
        model="model-uji",
        project_description="Sistem manajemen risiko operasional.",
    )

    assert gen.project_description == "Sistem manajemen risiko operasional."


def test_project_description_bawaan_none():
    gen = DocGenerator(provider=ProviderPerekam(), model="model-uji")

    assert gen.project_description is None


def test_kedua_router_meneruskan_project_description():
    """Dict settings disusun manual di dua tempat; mudah terlewat satu."""
    import inspect

    from app.routers import generate as modul

    sumber = inspect.getsource(modul)

    assert sumber.count('"project_description": payload.project_description') == 2


def test_job_runner_meneruskan_ke_generator():
    """Nilai yang sampai ke dict settings tetap tidak berguna bila berhenti di situ."""
    import inspect

    from app.routers import generate as modul

    sumber = inspect.getsource(modul._run_generate_job)

    assert 'settings.get("project_description")' in sumber
