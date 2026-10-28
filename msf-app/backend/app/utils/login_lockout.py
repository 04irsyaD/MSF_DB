"""
Lockout percobaan login gagal per key (IP), in-memory.

Cukup untuk backend 1 worker (Render free). Kalau nanti multi-worker /
multi-instance, pindahkan state ke storage bersama (Redis/DB).
"""

import time
from collections import deque
from typing import Callable, Deque, Dict

# Batas jumlah key yang dilacak sebelum entri basi dibersihkan (cegah memori tumbuh).
MAX_TRACKED_KEYS = 10_000


class LoginLockout:
    def __init__(
        self,
        max_failures: int = 5,
        window_seconds: int = 15 * 60,
        lockout_seconds: int = 15 * 60,
        clock: Callable[[], float] = time.monotonic,
    ):
        self.max_failures = max_failures
        self.window_seconds = window_seconds
        self.lockout_seconds = lockout_seconds
        self.clock = clock
        self._failures: Dict[str, Deque[float]] = {}
        self._locked_until: Dict[str, float] = {}

    def retry_after(self, key: str) -> int:
        """Sisa detik lockout untuk key ini (0 = tidak terkunci)."""
        until = self._locked_until.get(key)
        if until is None:
            return 0
        remaining = until - self.clock()
        if remaining <= 0:
            del self._locked_until[key]
            return 0
        return int(remaining) + 1

    def register_failure(self, key: str) -> int:
        """Catat kegagalan; kembalikan jumlah kegagalan di dalam window."""
        now = self.clock()
        if len(self._failures) >= MAX_TRACKED_KEYS:
            self._prune(now)
        failures = self._failures.setdefault(key, deque())
        failures.append(now)
        while failures and now - failures[0] > self.window_seconds:
            failures.popleft()
        if len(failures) >= self.max_failures:
            self._locked_until[key] = now + self.lockout_seconds
            failures.clear()
            return self.max_failures
        return len(failures)

    def register_success(self, key: str) -> None:
        self._failures.pop(key, None)
        self._locked_until.pop(key, None)

    def _prune(self, now: float) -> None:
        stale = [k for k, q in self._failures.items() if not q or now - q[-1] > self.window_seconds]
        for k in stale:
            del self._failures[k]
        expired = [k for k, until in self._locked_until.items() if until <= now]
        for k in expired:
            del self._locked_until[k]

    def reset(self) -> None:
        self._failures.clear()
        self._locked_until.clear()
