"""Slugs are the public URLs of the catalogue.

Two rules: a collision must never 500, and an existing slug must never change
underneath a link that has already been shared or indexed.
"""
from __future__ import annotations

import pytest

pytestmark = pytest.mark.anyio


def _product(category_id: int, title: str = "Pure Sandalwood Japa Mala") -> dict:
    return {"category_id": category_id, "title": title}


async def test_duplicate_product_title_gets_a_unique_slug_not_a_500(
    client, auth_headers, category
):
    first = await client.post(
        "/api/v1/products", json=_product(category), headers=auth_headers
    )
    assert first.status_code == 201, first.text

    second = await client.post(
        "/api/v1/products", json=_product(category), headers=auth_headers
    )
    assert second.status_code == 201, second.text
    assert second.json()["slug"] != first.json()["slug"]


async def test_a_third_collision_also_resolves(client, auth_headers, category):
    slugs = set()
    for _ in range(3):
        response = await client.post(
            "/api/v1/products", json=_product(category), headers=auth_headers
        )
        assert response.status_code == 201, response.text
        slugs.add(response.json()["slug"])
    assert len(slugs) == 3


async def test_duplicate_category_name_is_a_conflict_not_a_500(client, auth_headers):
    """Category.name is UNIQUE, so this is a client error. It used to surface as
    an unhandled IntegrityError -> 500."""
    payload = {"name": "Handcarved Elephants"}

    first = await client.post("/api/v1/categories", json=payload, headers=auth_headers)
    assert first.status_code == 201, first.text

    second = await client.post("/api/v1/categories", json=payload, headers=auth_headers)
    assert second.status_code == 409, second.text


async def test_two_distinct_category_names_that_slugify_alike_both_succeed(
    client, auth_headers
):
    first = await client.post(
        "/api/v1/categories", json={"name": "Loose Beads"}, headers=auth_headers
    )
    second = await client.post(
        "/api/v1/categories", json={"name": "Loose  Beads!"}, headers=auth_headers
    )
    assert first.status_code == 201, first.text
    assert second.status_code == 201, second.text
    assert first.json()["slug"] == "loose-beads"
    assert second.json()["slug"] == "loose-beads-2"


async def test_renaming_a_product_keeps_its_existing_slug(
    client, auth_headers, category
):
    created = (
        await client.post(
            "/api/v1/products", json=_product(category), headers=auth_headers
        )
    ).json()

    updated = await client.put(
        f"/api/v1/products/{created['id']}",
        json={"title": "Completely Different Title"},
        headers=auth_headers,
    )
    assert updated.status_code == 200, updated.text
    assert updated.json()["slug"] == created["slug"]
    assert updated.json()["title"] == "Completely Different Title"


async def test_a_product_slug_can_still_be_changed_deliberately(
    client, auth_headers, category
):
    created = (
        await client.post(
            "/api/v1/products", json=_product(category), headers=auth_headers
        )
    ).json()

    updated = await client.put(
        f"/api/v1/products/{created['id']}",
        json={"slug": "chosen-by-the-admin"},
        headers=auth_headers,
    )
    assert updated.status_code == 200, updated.text
    assert updated.json()["slug"] == "chosen-by-the-admin"


async def test_renaming_a_category_keeps_its_existing_slug(client, auth_headers):
    created = (
        await client.post(
            "/api/v1/categories", json={"name": "Loose Beads"}, headers=auth_headers
        )
    ).json()

    updated = await client.put(
        f"/api/v1/categories/{created['id']}",
        json={"name": "Loose Sandalwood Beads"},
        headers=auth_headers,
    )
    assert updated.status_code == 200, updated.text
    assert updated.json()["slug"] == created["slug"]


async def test_a_product_cannot_take_a_slug_another_product_already_owns(
    client, auth_headers, category
):
    first = (
        await client.post(
            "/api/v1/products", json=_product(category, "First"), headers=auth_headers
        )
    ).json()
    second = (
        await client.post(
            "/api/v1/products", json=_product(category, "Second"), headers=auth_headers
        )
    ).json()

    response = await client.put(
        f"/api/v1/products/{second['id']}",
        json={"slug": first["slug"]},
        headers=auth_headers,
    )
    assert response.status_code == 409


async def test_a_product_cannot_be_created_under_a_missing_category(
    client, auth_headers
):
    response = await client.post(
        "/api/v1/products", json=_product(999_999), headers=auth_headers
    )
    assert response.status_code == 400
