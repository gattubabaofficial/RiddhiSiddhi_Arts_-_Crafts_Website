"""The upload endpoint writes attacker-controlled bytes to disk, so it needs a
guard on every axis: who is calling, how big, and what kind of file.
"""
from __future__ import annotations

import pytest

pytestmark = pytest.mark.anyio

UPLOAD_URL = "/api/v1/upload"
PNG_BYTES = b"\x89PNG\r\n\x1a\n" + b"0" * 64


def _png(name: str = "photo.png"):
    return {"files": (name, PNG_BYTES, "image/png")}


async def test_upload_rejects_anonymous_callers(client):
    response = await client.post(UPLOAD_URL, files=_png())
    assert response.status_code == 401


async def test_upload_rejects_a_garbage_token(client):
    response = await client.post(
        UPLOAD_URL, files=_png(), headers={"Authorization": "Bearer not-a-real-token"}
    )
    assert response.status_code == 401


async def test_upload_accepts_an_authenticated_admin(client, auth_headers, upload_dir):
    response = await client.post(UPLOAD_URL, files=_png(), headers=auth_headers)
    assert response.status_code == 200, response.text

    (url,) = response.json()
    assert url.startswith("/static/uploads/")
    assert (upload_dir / url.rsplit("/", 1)[1]).exists()


async def test_upload_rejects_a_disallowed_extension(client, auth_headers):
    response = await client.post(
        UPLOAD_URL,
        files={"files": ("payload.exe", b"MZ\x90\x00", "application/octet-stream")},
        headers=auth_headers,
    )
    assert response.status_code == 400


async def test_upload_rejects_a_file_over_the_size_limit(client, auth_headers):
    # conftest pins MAX_UPLOAD_SIZE_MB=1.
    oversized = b"\x89PNG\r\n\x1a\n" + b"0" * (2 * 1024 * 1024)
    response = await client.post(
        UPLOAD_URL,
        files={"files": ("huge.png", oversized, "image/png")},
        headers=auth_headers,
    )
    assert response.status_code == 413


async def test_oversized_upload_leaves_no_partial_file_behind(
    client, auth_headers, upload_dir
):
    before = set(upload_dir.iterdir())
    oversized = b"\x89PNG\r\n\x1a\n" + b"0" * (2 * 1024 * 1024)
    await client.post(
        UPLOAD_URL,
        files={"files": ("huge.png", oversized, "image/png")},
        headers=auth_headers,
    )
    assert set(upload_dir.iterdir()) == before


async def test_upload_rejects_content_type_that_contradicts_the_extension(
    client, auth_headers
):
    """A .png that announces itself as HTML is how stored-XSS gets served back."""
    response = await client.post(
        UPLOAD_URL,
        files={"files": ("sneaky.png", b"<script>alert(1)</script>", "text/html")},
        headers=auth_headers,
    )
    assert response.status_code == 400


async def test_upload_ignores_path_traversal_in_the_client_filename(
    client, auth_headers, upload_dir
):
    response = await client.post(
        UPLOAD_URL,
        files={"files": ("../../../../evil.png", PNG_BYTES, "image/png")},
        headers=auth_headers,
    )
    assert response.status_code == 200, response.text

    (url,) = response.json()
    assert ".." not in url
    stored = upload_dir / url.rsplit("/", 1)[1]
    assert stored.resolve().parent == upload_dir.resolve()


async def test_upload_rejects_a_file_with_no_extension(client, auth_headers):
    response = await client.post(
        UPLOAD_URL,
        files={"files": ("noextension", PNG_BYTES, "image/png")},
        headers=auth_headers,
    )
    assert response.status_code == 400


async def test_upload_rejects_bytes_that_contradict_a_matching_content_type(
    client, auth_headers
):
    """The declared type is consistent with the extension, but the bytes are
    not a PNG. Only the magic-byte check catches this one."""
    response = await client.post(
        UPLOAD_URL,
        files={"files": ("sneaky.png", b"<script>alert(1)</script>", "image/png")},
        headers=auth_headers,
    )
    assert response.status_code == 400


async def test_upload_rejects_a_polyglot_jpeg_with_png_bytes(client, auth_headers):
    response = await client.post(
        UPLOAD_URL,
        files={"files": ("mismatch.jpg", PNG_BYTES, "image/jpeg")},
        headers=auth_headers,
    )
    assert response.status_code == 400


async def test_upload_accepts_a_real_jpeg(client, auth_headers):
    jpeg = b"\xff\xd8\xff\xe0" + b"\x00" * 64
    response = await client.post(
        UPLOAD_URL,
        files={"files": ("real.jpg", jpeg, "image/jpeg")},
        headers=auth_headers,
    )
    assert response.status_code == 200, response.text
