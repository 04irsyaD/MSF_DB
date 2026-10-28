"""
Redaksi data sensitif sebelum masuk log.

`redact_sensitive_processor` dipasang global di structlog sebagai jaring
pengaman: key sensitif di level mana pun (dict/list bersarang) disamarkan,
dan kredensial di dalam URL (`scheme://user:pass@host`) di string apa pun
ikut disamarkan.
"""

import re
from typing import Any

MASK = "***"

SENSITIVE_KEYS = {
    "password",
    "passcode",
    "connection_string",
    "api_key",
    "x_api_key",
    "authorization",
    "x_admin_passcode",
    "access_code",
    "secret",
    "token",
}

_URL_CREDENTIALS = re.compile(r"(\w[\w+.-]*://[^:/@\s]+):[^@\s]+@")


def _normalize_key(key: Any) -> str:
    return str(key).strip().lower().replace("-", "_")


def mask_url_credentials(text: str) -> str:
    """Samarkan password di dalam URL: `postgresql://u:secret@h` -> `postgresql://u:***@h`."""
    return _URL_CREDENTIALS.sub(r"\1:" + MASK + "@", text)


def _redact_value(key: Any, value: Any) -> Any:
    if _normalize_key(key) in SENSITIVE_KEYS and value not in (None, ""):
        return MASK
    return _redact(value)


def _redact(value: Any) -> Any:
    if isinstance(value, dict):
        return {k: _redact_value(k, v) for k, v in value.items()}
    if isinstance(value, list):
        return [_redact(v) for v in value]
    if isinstance(value, tuple):
        return tuple(_redact(v) for v in value)
    if isinstance(value, str):
        return mask_url_credentials(value)
    return value


def redact_sensitive_processor(logger, method_name, event_dict):
    """Processor structlog: samarkan key sensitif & kredensial URL di semua field log."""
    return _redact(event_dict)
