"""Guards against the whole class of "it was fine locally" mistakes: a shipped
default secret, a CORS policy that trusts everyone, and deprecated stdlib calls
that turn into hard errors on a future Python.
"""
from __future__ import annotations

import re
from pathlib import Path

import pytest
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import Settings
from app.main import app

BACKEND_ROOT = Path(__file__).resolve().parents[1]
APP_SOURCES = sorted((BACKEND_ROOT / "app").rglob("*.py"))


def _cors_options() -> dict:
    for middleware in app.user_middleware:
        if middleware.cls is CORSMiddleware:
            return middleware.kwargs
    pytest.fail("CORSMiddleware is not installed")


def test_cors_does_not_match_every_origin_by_regex():
    """allow_origin_regex=r'https?://.*' let any website on the internet call the
    API with the admin's credentials attached."""
    pattern = _cors_options().get("allow_origin_regex")
    if pattern is None:
        return
    for hostile in ("http://evil.example", "https://phishing.test"):
        assert not re.fullmatch(pattern, hostile), f"{pattern} admits {hostile}"


def test_cors_origins_come_from_configuration():
    options = _cors_options()
    origins = options.get("allow_origins") or []
    assert "*" not in origins
    assert "http://localhost:3000" in origins


def test_credentialed_cors_is_never_paired_with_a_wildcard():
    options = _cors_options()
    if options.get("allow_credentials"):
        assert "*" not in (options.get("allow_origins") or [])


def test_production_refuses_to_start_without_an_explicit_secret_key():
    with pytest.raises(ValueError, match="SECRET_KEY"):
        Settings(ENVIRONMENT="production", SECRET_KEY="")


def test_production_refuses_the_secret_key_that_leaked_into_git():
    with pytest.raises(ValueError, match="SECRET_KEY"):
        Settings(
            ENVIRONMENT="production",
            SECRET_KEY="supersecret_riddhi_siddhi_sandalwood_jaipur_key_2026",
        )


def test_production_accepts_a_real_secret_key():
    settings = Settings(
        ENVIRONMENT="production", SECRET_KEY="a" * 48, ALLOWED_ORIGINS="https://x.com"
    )
    assert settings.SECRET_KEY == "a" * 48


def test_development_generates_a_machine_local_secret():
    """Development must not fall back to a literal key an attacker could read
    off GitHub and use to forge admin tokens. The generated key is persisted per
    machine so `uvicorn --reload` does not invalidate the session on every save.
    """
    from app.core.config import COMPROMISED_SECRET_KEYS, MIN_SECRET_KEY_LENGTH

    settings = Settings(ENVIRONMENT="development", SECRET_KEY="")
    assert len(settings.SECRET_KEY) >= MIN_SECRET_KEY_LENGTH
    assert settings.SECRET_KEY not in COMPROMISED_SECRET_KEYS


def test_development_replaces_the_leaked_key_rather_than_using_it():
    from app.core.config import COMPROMISED_SECRET_KEYS

    settings = Settings(
        ENVIRONMENT="development",
        SECRET_KEY="supersecret_riddhi_siddhi_sandalwood_jaipur_key_2026",
    )
    assert settings.SECRET_KEY not in COMPROMISED_SECRET_KEYS


@pytest.mark.parametrize("source", APP_SOURCES, ids=lambda p: p.name)
def test_no_source_file_contains_a_usable_fallback_secret(source: Path):
    """The literal must survive only as a blocklist entry in config.py."""
    text = source.read_text(encoding="utf-8")
    if source.name == "config.py":
        return
    assert "supersecret_riddhi_siddhi" not in text


def test_the_generated_dev_key_file_is_git_ignored():
    from app.core.config import DEV_SECRET_KEY_FILE

    ignore_rules = (BACKEND_ROOT.parent / ".gitignore").read_text(encoding="utf-8")
    assert DEV_SECRET_KEY_FILE.name in ignore_rules


@pytest.mark.parametrize("source", APP_SOURCES, ids=lambda p: p.name)
def test_no_naive_utcnow_calls_remain(source: Path):
    """The deprecated stdlib helper returns a naive datetime; every model must
    go through now_utc(). Matches call sites, so prose may still name it."""
    assert "utcnow(" not in source.read_text(encoding="utf-8"), (
        f"{source.relative_to(BACKEND_ROOT)} still has a naive UTC call site"
    )


@pytest.mark.parametrize("source", APP_SOURCES, ids=lambda p: p.name)
def test_no_deprecated_startup_event_hooks_remain(source: Path):
    """@app.on_event is deprecated in favour of a lifespan handler."""
    assert "on_event" not in source.read_text(encoding="utf-8"), (
        f"{source.relative_to(BACKEND_ROOT)} still uses @app.on_event"
    )
