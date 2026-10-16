"""
Test PDF exporter — memastikan export PDF tidak melakukan request ke resource
eksternal (SSRF) dan raw HTML di Markdown tidak dirender sebagai tag.
"""
import http.server
import threading

import pytest

from app.services.exporters.pdf_exporter import PdfExporter, _markdown_to_safe_html


@pytest.fixture
def capture_server():
    """HTTP server lokal yang mencatat setiap path yang di-request."""
    hits = []

    class Handler(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            hits.append(self.path)
            self.send_response(404)
            self.end_headers()

        def log_message(self, *args):
            pass

    server = http.server.HTTPServer(("127.0.0.1", 0), Handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    yield f"http://127.0.0.1:{server.server_address[1]}", hits
    server.shutdown()
    server.server_close()


def test_pdf_export_does_not_fetch_external_resources(capture_server):
    base_url, hits = capture_server
    markdown_content = (
        "# Judul\n\n"
        f'<img src="{base_url}/raw-img">\n\n'
        f'<link rel="stylesheet" href="{base_url}/raw-css">\n\n'
        f"![gambar]({base_url}/md-img)\n"
    )

    PdfExporter().export(markdown_content, "Proyek")

    assert hits == []


def test_pdf_export_does_not_read_local_files(tmp_path, monkeypatch):
    secret = tmp_path / "secret.png"
    secret.write_bytes(b"not-an-image")
    opened = []

    import builtins
    real_open = builtins.open

    def tracking_open(file, *args, **kwargs):
        opened.append(str(file))
        return real_open(file, *args, **kwargs)

    monkeypatch.setattr(builtins, "open", tracking_open)
    PdfExporter().export(f"![x](file:///{secret.as_posix()})\n\n![y]({secret})", "Proyek")

    assert not any("secret.png" in path for path in opened)


def test_raw_html_is_escaped():
    html_out = _markdown_to_safe_html('Teks <img src="http://example.com/x"> <b>tebal</b>')

    assert "<img" not in html_out
    assert "<b>" not in html_out
    assert "&lt;img" in html_out


def test_pdf_export_renders_normal_markdown():
    markdown_content = (
        "# Dokumentasi\n\n"
        "| Kolom | Tipe |\n|---|---|\n| id | int |\n\n"
        "```sql\nSELECT 1;\n```\n"
    )

    pdf_bytes = PdfExporter().export(markdown_content, "Proyek <A&B>", author="Tim")

    assert pdf_bytes.startswith(b"%PDF")


def test_markdown_tables_and_code_still_render():
    html_out = _markdown_to_safe_html("| a | b |\n|---|---|\n| 1 | 2 |\n\n```\nx < y\n```")

    assert "<table>" in html_out
    assert "<code>" in html_out
    assert "x &lt; y" in html_out
