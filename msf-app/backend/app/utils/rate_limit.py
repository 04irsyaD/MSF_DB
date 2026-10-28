"""
Rate limit sliding window per key (IP), in-memory.

Sama seperti `login_lockout`: cukup untuk backend 1 worker (Render free).
"""

import time
from collections import deque
from typing import Callable, Deque, Dict

from app.utils.login_lockout import MAX_TRACKED_KEYS


class SlidingWindowLimiter:
    def __init__(
        self,
        max_requests: int,
        window_seconds: int,
        clock: Callable[[], float] = time.monotonic,
    ):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.clock = clock
        self._hits: Dict[str, Deque[float]] = {}

    def hit(self, key: str) -> int:
        """Catat satu request. Kembalikan sisa detik tunggu (0 = diizinkan, tidak dicatat kalau ditolak)."""
        now = self.clock()
        if len(self._hits) >= MAX_TRACKED_KEYS:
            self._prune(now)
        hits = self._hits.setdefault(key, deque())
        while hits and now - hits[0] >= self.window_seconds:
            hits.popleft()
        if len(hits) >= self.max_requests:
            return int(self.window_seconds - (now - hits[0])) + 1
        hits.append(now)
        return 0

    def _prune(self, now: float) -> None:
        stale = [k for k, q in self._hits.items() if not q or now - q[-1] >= self.window_seconds]
        for k in stale:
            del self._hits[k]

    def reset(self) -> None:
        self._hits.clear()
