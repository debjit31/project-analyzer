"""
Thread-safe, TTL-aware in-memory cache backed by cachetools.

Usage:
    cache = InMemoryCache(maxsize=128, ttl=600)
    cache.set("key", value)
    value = cache.get("key")          # returns None on miss
    cache.invalidate("key")
    cache.clear()
"""

from __future__ import annotations

import threading
from typing import Any, Generic, TypeVar

from cachetools import TTLCache

V = TypeVar("V")


class InMemoryCache(Generic[V]):
    """A generic, thread-safe TTL cache."""

    def __init__(self, maxsize: int = 128, ttl: int = 600) -> None:
        self._store: TTLCache = TTLCache(maxsize=maxsize, ttl=ttl)
        self._lock = threading.Lock()

    def get(self, key: str) -> V | None:
        with self._lock:
            return self._store.get(key)

    def set(self, key: str, value: V) -> None:
        with self._lock:
            self._store[key] = value

    def invalidate(self, key: str) -> None:
        with self._lock:
            self._store.pop(key, None)

    def clear(self) -> None:
        with self._lock:
            self._store.clear()

    def __len__(self) -> int:
        with self._lock:
            return len(self._store)

