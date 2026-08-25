"""The two anonymous write endpoints (enquiries, reviews) are the site's spam
surface. They need a rate limit and a bound on how much text they will store.
"""
from __future__ import annotations

import pytest

from app.core.ratelimit import reset_rate_limits

pytestmark = pytest.mark.anyio

ENQUIRY = {
    "name": "Rahul Verma",
    "mobile": "+919812345678",
    "email": "rahul@example.com",
    "message": "Please share your wholesale price list for 8mm japa malas.",
}


@pytest.fixture(autouse=True)
def _clean_limiter():
    reset_rate_limits()
    yield
    reset_rate_limits()


async def test_a_genuine_enquiry_is_accepted(client):
    response = await client.post("/api/v1/enquiries", json=ENQUIRY)
    assert response.status_code == 201, response.text
    assert response.json()["status"] == "new"


async def test_repeated_enquiries_from_one_client_are_throttled(client):
    statuses = [
        (await client.post("/api/v1/enquiries", json=ENQUIRY)).status_code
        for _ in range(12)
    ]
    assert 429 in statuses, f"no throttling after 12 submissions: {statuses}"


async def test_repeated_reviews_from_one_client_are_throttled(client):
    review = {"user_name": "Bot", "rating": 5, "text": "great"}
    statuses = [
        (await client.post("/api/v1/reviews", json=review)).status_code
        for _ in range(12)
    ]
    assert 429 in statuses, f"no throttling after 12 submissions: {statuses}"


async def test_throttling_does_not_touch_public_reads(client):
    for _ in range(30):
        assert (await client.get("/api/v1/products")).status_code == 200


async def test_an_enquiry_message_of_unbounded_length_is_refused(client):
    response = await client.post(
        "/api/v1/enquiries", json={**ENQUIRY, "message": "x" * 100_000}
    )
    assert response.status_code == 422


async def test_an_enquiry_needs_a_real_email_address(client):
    response = await client.post(
        "/api/v1/enquiries", json={**ENQUIRY, "email": "not-an-email"}
    )
    assert response.status_code == 422


async def test_an_enquiry_cannot_be_submitted_blank(client):
    response = await client.post(
        "/api/v1/enquiries", json={**ENQUIRY, "name": "   ", "message": "  "}
    )
    assert response.status_code == 422
