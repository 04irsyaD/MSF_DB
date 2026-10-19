"""
Test hardening admin — SECURITY_REMEDIATION_PLAN Batch 9 (T-030).
"""
import pytest

from app.routers import admin
from app.utils.login_lockout import LoginLockout

PASSCODE = "passcode-admin-yang-panjang-123"
VERIFY = "/api/admin/verify"


@pytest.fixture(autouse=True)
def admin_env(monkeypatch):
    monkeypatch.setenv("ADMIN_PASSCODE", PASSCODE)


@pytest.fixture
def fake_clock(monkeypatch):
    now = [1000.0]
    monkeypatch.setattr(admin.admin_lockout, "clock", lambda: now[0])
    return now


def _login(client, passcode, ip=None):
    headers = {"X-Admin-Passcode": passcode}
    if ip:
        headers["X-Forwarded-For"] = ip
    return client.post(VERIFY, headers=headers)


def test_five_failures_lock_out_even_correct_passcode(client, fake_clock):
    for _ in range(5):
        assert _login(client, "salah").status_code == 401

    res = _login(client, PASSCODE)
    assert res.status_code == 429
    assert int(res.headers["retry-after"]) > 0


def test_correct_passcode_works_after_lockout_expires(client, fake_clock):
    for _ in range(5):
        _login(client, "salah")
    fake_clock[0] += 15 * 60 + 1
    assert _login(client, PASSCODE).status_code == 200


def test_success_resets_failure_count(client, fake_clock):
    for _ in range(4):
        _login(client, "salah")
    assert _login(client, PASSCODE).status_code == 200
    for _ in range(4):
        assert _login(client, "salah").status_code == 401
    assert _login(client, PASSCODE).status_code == 200


def test_failures_outside_window_do_not_accumulate(client, fake_clock):
    for _ in range(4):
        _login(client, "salah")
    fake_clock[0] += 15 * 60 + 1
    assert _login(client, "salah").status_code == 401
    assert _login(client, PASSCODE).status_code == 200


def test_lockout_uses_rightmost_forwarded_ip(client, fake_clock):
    # Entri kiri bisa dipalsukan client; entri kanan ditambahkan proxy (Render).
    for i in range(5):
        _login(client, "salah", ip=f"10.0.0.{i}, 203.0.113.7")
    assert _login(client, PASSCODE, ip="1.2.3.4, 203.0.113.7").status_code == 429
    assert _login(client, PASSCODE, ip="203.0.113.8").status_code == 200


def test_short_passcode_disables_admin(client, monkeypatch):
    monkeypatch.setenv("ADMIN_PASSCODE", "pendek123")
    res = _login(client, "pendek123")
    assert res.status_code == 403
    assert "pendek123" not in res.text


def test_failed_login_log_has_no_passcode(client, monkeypatch):
    calls = []
    monkeypatch.setattr(admin, "logger", type("L", (), {"warning": lambda self, e, **kw: calls.append((e, kw))})())
    _login(client, "tebakan-rahasia")
    assert calls and calls[0][0] == "Login admin gagal"
    assert "tebakan-rahasia" not in str(calls)


def test_lockout_prunes_stale_keys(monkeypatch):
    from app.utils import login_lockout

    now = [0.0]
    monkeypatch.setattr(login_lockout, "MAX_TRACKED_KEYS", 3)
    lockout = LoginLockout(window_seconds=10, clock=lambda: now[0])
    for ip in ("a", "b", "c"):
        lockout.register_failure(ip)
    now[0] = 100.0
    lockout.register_failure("d")
    assert set(lockout._failures) == {"d"}
