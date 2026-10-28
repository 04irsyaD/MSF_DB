"""
HTTP security headers untuk semua respons backend.

Backend hanya melayani JSON dan file unduhan, jadi CSP dibuat seketat mungkin.
Pengecualian: halaman Swagger/ReDoc (hanya aktif jika ENABLE_DOCS=true) butuh
script dari CDN, sehingga CSP tidak dipasang di path dokumentasi.
"""

BASE_HEADERS = [
    (b"strict-transport-security", b"max-age=31536000; includeSubDomains"),
    (b"x-content-type-options", b"nosniff"),
    (b"x-frame-options", b"DENY"),
    (b"referrer-policy", b"no-referrer"),
]

CSP_HEADER = (b"content-security-policy", b"default-src 'none'; frame-ancestors 'none'")
NO_STORE_HEADER = (b"cache-control", b"no-store")

DOCS_PATHS = ("/docs", "/redoc")
NO_STORE_PREFIXES = ("/api/admin", "/api/jobs")


class SecurityHeadersMiddleware:
    """ASGI middleware murni: tambahkan header keamanan di setiap respons HTTP."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        path = scope.get("path", "")
        extra = list(BASE_HEADERS)
        if not path.startswith(DOCS_PATHS):
            extra.append(CSP_HEADER)
        if path.startswith(NO_STORE_PREFIXES):
            extra.append(NO_STORE_HEADER)

        async def send_with_headers(message):
            if message["type"] == "http.response.start":
                existing = {name.lower() for name, _ in message.get("headers", [])}
                headers = list(message.get("headers", []))
                headers.extend(h for h in extra if h[0] not in existing)
                message = {**message, "headers": headers}
            await send(message)

        await self.app(scope, receive, send_with_headers)
