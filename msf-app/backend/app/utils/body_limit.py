"""
Batas ukuran body request global (anti-DoS).

ASGI middleware murni (bukan BaseHTTPMiddleware) supaya bisa membatasi body
tanpa membaca seluruh isinya ke memori:
- `Content-Length` melebihi batas -> langsung 413 tanpa menyentuh endpoint.
- Body chunked tanpa `Content-Length` -> dihitung saat dibaca; begitu lewat
  batas, `HTTPException(413)` dilempar dan ditangani exception handler app.

Env: MAX_REQUEST_BODY_BYTES (default 2 MB).
"""

import json
import os
from datetime import datetime, timezone

from fastapi import HTTPException

DEFAULT_MAX_BODY_BYTES = 2 * 1024 * 1024

TOO_LARGE_DETAIL = "Ukuran request terlalu besar."


def max_body_bytes() -> int:
    try:
        return int(os.getenv("MAX_REQUEST_BODY_BYTES", DEFAULT_MAX_BODY_BYTES))
    except ValueError:
        return DEFAULT_MAX_BODY_BYTES


class BodySizeLimitMiddleware:
    def __init__(self, app, max_bytes: int | None = None):
        self.app = app
        self.max_bytes = max_bytes if max_bytes is not None else max_body_bytes()

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        content_length = dict(scope.get("headers") or []).get(b"content-length")
        if content_length is not None:
            if not content_length.isdigit() or int(content_length) > self.max_bytes:
                await self._reject(send)
                return

        received = 0

        async def limited_receive():
            nonlocal received
            message = await receive()
            if message["type"] == "http.request":
                received += len(message.get("body", b""))
                if received > self.max_bytes:
                    raise HTTPException(status_code=413, detail=TOO_LARGE_DETAIL)
            return message

        await self.app(scope, limited_receive, send)

    @staticmethod
    async def _reject(send):
        body = json.dumps({
            "detail": TOO_LARGE_DETAIL,
            "error_code": "HTTP_413",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }).encode()
        await send({
            "type": "http.response.start",
            "status": 413,
            "headers": [
                (b"content-type", b"application/json"),
                (b"content-length", str(len(body)).encode()),
            ],
        })
        await send({"type": "http.response.body", "body": body})
