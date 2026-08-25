"""Every mutating endpoint must be behind the admin token.

Parametrised so a newly added write route that forgets its dependency shows up
here rather than in production.
"""
from __future__ import annotations

import pytest

pytestmark = pytest.mark.anyio

WRITE_ENDPOINTS = [
    ("POST", "/api/v1/products", {"category_id": 1, "title": "x"}),
    ("PUT", "/api/v1/products/1", {"title": "x"}),
    ("DELETE", "/api/v1/products/1", None),
    ("POST", "/api/v1/categories", {"name": "x"}),
    ("PUT", "/api/v1/categories/1", {"name": "x"}),
    ("DELETE", "/api/v1/categories/1", None),
    ("PUT", "/api/v1/reviews/1", {"status": "approved"}),
    ("DELETE", "/api/v1/reviews/1", None),
    ("GET", "/api/v1/enquiries", None),
    ("PUT", "/api/v1/enquiries/1/status", {"status": "closed"}),
    ("DELETE", "/api/v1/enquiries/1", None),
    ("POST", "/api/v1/reels", {"title": "x", "video_url": "x"}),
    ("PUT", "/api/v1/reels/1", {"title": "x"}),
    ("DELETE", "/api/v1/reels/1", None),
    ("POST", "/api/v1/banners", {"image_url": "x", "heading": "x"}),
    ("PUT", "/api/v1/banners/1", {"heading": "x"}),
    ("DELETE", "/api/v1/banners/1", None),
    ("GET", "/api/v1/admin/banners", None),
    ("POST", "/api/v1/collaborations", {"title": "x", "logo_url": "x"}),
    ("DELETE", "/api/v1/collaborations/1", None),
    ("PUT", "/api/v1/content/home-sections/hero", {"title": "x"}),
    ("PUT", "/api/v1/content/about-blocks/vision", {"title": "x"}),
    ("PUT", "/api/v1/settings", {"company_name": "x"}),
    ("POST", "/api/v1/upload", None),
]


@pytest.mark.parametrize("method,path,body", WRITE_ENDPOINTS)
async def test_write_endpoint_rejects_anonymous_callers(client, method, path, body):
    response = await client.request(method, path, json=body)
    assert response.status_code == 401, f"{method} {path} allowed an anonymous caller"


async def test_login_returns_a_token_for_valid_credentials(client, auth_headers):
    response = await client.get("/api/v1/auth/me", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["email"] == "admin@riddhi-test.example.com"


async def test_login_rejects_a_wrong_password(client, auth_headers):
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "admin@riddhi-test.example.com", "password": "wrong"},
    )
    assert response.status_code == 400


async def test_login_rejects_an_unknown_email(client):
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "nobody@riddhi-test.example.com", "password": "whatever"},
    )
    assert response.status_code == 400


async def test_a_token_signed_with_another_key_is_refused(client):
    from jose import jwt

    forged = jwt.encode({"sub": "admin@riddhi-test.example.com"}, "attacker-key", algorithm="HS256")
    response = await client.get(
        "/api/v1/auth/me", headers={"Authorization": f"Bearer {forged}"}
    )
    assert response.status_code == 401


async def test_public_read_endpoints_stay_open(client):
    for path in ("/api/v1/products", "/api/v1/categories", "/api/v1/banners"):
        assert (await client.get(path)).status_code == 200, path
