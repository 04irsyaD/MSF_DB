import structlog
import logging
import sys
import os
import re
from logging.handlers import RotatingFileHandler

class DoubleWriter:
    """Writer yang menulis log ke stdout dan file secara bersamaan dengan rotasi."""
    def __init__(self, file_path: str):
        self.stdout = sys.stdout
        self.file_handler = None
        if file_path:
            try:
                os.makedirs(os.path.dirname(file_path), exist_ok=True)
                self.file_handler = RotatingFileHandler(
                    file_path, maxBytes=5 * 1024 * 1024, backupCount=3, encoding="utf-8"
                )
            except Exception:
                # Fallback jika gagal membuat file (misal di environment non-writable)
                pass

    def write(self, message: str):
        # Tulis ke stdout asli
        self.stdout.write(message)
        self.stdout.flush()
        
        # Tulis ke file log jika tersedia
        if self.file_handler and message.strip():
            # Hapus ANSI escape codes (warna terminal) agar log di file bersih
            clean_message = re.sub(r'\x1b\[[0-9;]*[mGKH]', '', message)
            record = logging.LogRecord(
                name="app",
                level=logging.INFO,
                pathname="",
                lineno=0,
                msg=clean_message.strip(),
                args=(),
                exc_info=None
            )
            self.file_handler.emit(record)

    def flush(self):
        self.stdout.flush()

def setup_logger():
    """Konfigurasi global structlog agar output rapi (JSON di prod, Console di dev)"""
    log_file_path = os.getenv("LOG_FILE_PATH", "/app/outputs/app.log")
    writer = DoubleWriter(log_file_path)

    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.processors.add_log_level,
            structlog.processors.StackInfoRenderer(),
            structlog.dev.set_exc_info,
            structlog.processors.TimeStamper(fmt="iso", utc=False),
            structlog.processors.JSONRenderer() if not sys.stdout.isatty() else structlog.dev.ConsoleRenderer()
        ],
        wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(file=writer),
        cache_logger_on_first_use=True,
    )
