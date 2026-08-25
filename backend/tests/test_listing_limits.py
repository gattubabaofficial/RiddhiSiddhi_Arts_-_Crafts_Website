"""Listing endpoints face the open internet, so their cost per request has to be
bounded: a capped page size and a query count that does not grow with the data.
"""
from __future__ import annotations

import pytest
from sqlalchemy import event

pytestmark = pytest.mark.anyio


async def _seed_products(client, auth_headers, category, count: int):
    for i in range(count):
        response = await client.post(
            "/api/v1/products",
            json={"category_id": category, "title": f"Mala {i}"},
            headers=auth_headers,
        )
        assert response.status_code == 201, response.text


async def test_an_absurd_page_size_is_refused(client):
    response = await client.get("/api/v1/products", params={"limit": 1_000_000})
    assert response.status_code == 422


async def test_a_negative_page_size_is_refused(client):
    response = await client.get("/api/v1/products", params={"limit": -1})
    assert response.status_code == 422


async def test_a_negative_offset_is_refused(client):
    response = await client.get("/api/v1/products", params={"offset": -1})
    assert response.status_code == 422


async def test_the_page_size_ceiling_is_still_usable(client):
    response = await client.get("/api/v1/products", params={"limit": 100})
    assert response.status_code == 200


async def test_listing_categories_does_not_scale_queries_with_row_count(
    client, auth_headers, db_engine
):
    """The per-category COUNT(*) loop was an N+1; product counts must come back
    in a single grouped query."""
    for i in range(8):
        response = await client.post(
            "/api/v1/categories", json={"name": f"Category {i}"}, headers=auth_headers
        )
        assert response.status_code == 201, response.text

    statements: list[str] = []

    def record(conn, cursor, statement, parameters, context, executemany):
        statements.append(statement)

    event.listen(db_engine.sync_engine, "before_cursor_execute", record)
    try:
        response = await client.get("/api/v1/categories")
    finally:
        event.remove(db_engine.sync_engine, "before_cursor_execute", record)

    assert response.status_code == 200
    assert len(response.json()) == 8
    selects = [s for s in statements if s.lstrip().upper().startswith("SELECT")]
    assert len(selects) <= 2, f"{len(selects)} SELECTs for 8 categories: {selects}"


async def test_category_product_counts_are_still_correct(
    client, auth_headers, category
):
    await _seed_products(client, auth_headers, category, 3)
    response = await client.get("/api/v1/categories")
    (listed,) = [c for c in response.json() if c["id"] == category]
    assert listed["product_count"] == 3


async def test_search_matches_are_paged_not_dumped(client, auth_headers, category):
    await _seed_products(client, auth_headers, category, 5)
    response = await client.get("/api/v1/products", params={"limit": 2})
    assert len(response.json()) == 2
