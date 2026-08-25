"""Deleting a category cascades to every product inside it. That is a lot of
work to destroy with one click, so it must be deliberate.
"""
from __future__ import annotations

import pytest

pytestmark = pytest.mark.anyio


async def _add_product(client, auth_headers, category, title="Mala"):
    response = await client.post(
        "/api/v1/products",
        json={"category_id": category, "title": title},
        headers=auth_headers,
    )
    assert response.status_code == 201, response.text
    return response.json()


async def test_deleting_a_category_that_still_holds_products_is_refused(
    client, auth_headers, category
):
    await _add_product(client, auth_headers, category)

    response = await client.delete(
        f"/api/v1/categories/{category}", headers=auth_headers
    )
    assert response.status_code == 409
    assert "product" in response.json()["detail"].lower()


async def test_the_refused_delete_destroyed_nothing(client, auth_headers, category):
    product = await _add_product(client, auth_headers, category)
    await client.delete(f"/api/v1/categories/{category}", headers=auth_headers)

    assert (await client.get(f"/api/v1/products/{product['id']}")).status_code == 200
    assert (await client.get(f"/api/v1/categories/{category}")).status_code == 200


async def test_an_empty_category_deletes_without_ceremony(client, auth_headers):
    created = (
        await client.post(
            "/api/v1/categories", json={"name": "Temporary"}, headers=auth_headers
        )
    ).json()

    response = await client.delete(
        f"/api/v1/categories/{created['id']}", headers=auth_headers
    )
    assert response.status_code == 204


async def test_a_cascade_delete_is_available_when_asked_for_explicitly(
    client, auth_headers, category
):
    product = await _add_product(client, auth_headers, category)

    response = await client.delete(
        f"/api/v1/categories/{category}",
        params={"cascade": "true"},
        headers=auth_headers,
    )
    assert response.status_code == 204
    assert (await client.get(f"/api/v1/products/{product['id']}")).status_code == 404


async def test_similar_products_resolve_from_the_ids_the_admin_chose(
    client, auth_headers, category
):
    """similar_product_ids was stored and then ignored by every reader."""
    a = await _add_product(client, auth_headers, category, "Alpha")
    b = await _add_product(client, auth_headers, category, "Beta")
    c = await _add_product(client, auth_headers, category, "Gamma")

    await client.put(
        f"/api/v1/products/{a['id']}",
        json={"similar_product_ids": [c["id"], b["id"]]},
        headers=auth_headers,
    )

    response = await client.get(f"/api/v1/products/{a['slug']}/similar")
    assert response.status_code == 200, response.text
    assert [p["id"] for p in response.json()] == [c["id"], b["id"]]


async def test_similar_products_fall_back_to_the_same_category(
    client, auth_headers, category
):
    a = await _add_product(client, auth_headers, category, "Alpha")
    b = await _add_product(client, auth_headers, category, "Beta")

    response = await client.get(f"/api/v1/products/{a['slug']}/similar")
    assert response.status_code == 200
    returned = [p["id"] for p in response.json()]
    assert b["id"] in returned
    assert a["id"] not in returned, "a product must not be similar to itself"
