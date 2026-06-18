from datetime import datetime, timezone
from typing import Optional
from fastapi.responses import JSONResponse

class AppDetailedException(Exception):
    """Exception custom untuk error yang terstruktur di seluruh backend"""
    def __init__(
        self,
        detail: str,
        status_code: int = 400,
        error_code: Optional[str] = None
    ):
        self.detail = detail
        self.status_code = status_code
        self.error_code = error_code
        self.timestamp = datetime.now(timezone.utc).isoformat()
        super().__init__(detail)

    def to_response(self) -> JSONResponse:
        return JSONResponse(
            status_code=self.status_code,
            content={
                "detail": self.detail,
                "error_code": self.error_code,
                "timestamp": self.timestamp
            }
        )
